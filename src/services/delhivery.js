/**
 * Delhivery API Service
 * 
 * note: Requires VITE_DELHIVERY_TOKEN in .env file
 */

import { supabase } from '../../config/supabase';

const BASE_URL = '/delhivery-api';


export const DelhiveryService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        const token = import.meta.env.VITE_DELHIVERY_TOKEN;
        
        if (!token) {
            console.warn('Delhivery Token not found. Skipping strict serviceability check.');
            // Fallback: Return true so we don't block users if config is missing
            return { serviceable: true, city: '', state: '' };
        }

        try {
            const response = await fetch(`${BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Delhivery API failed');
            }

            const data = await response.json();
            
            // Delhivery returns: { "delivery_codes": [ { "postal_code": { ... } } ] }
            // Check structure carefully based on standard API response
            const deliveryCodes = data.delivery_codes;
            
            if (deliveryCodes && deliveryCodes.length > 0) {
                const codeData = deliveryCodes.find(c => c.postal_code.pin == pincode);
                
                if (codeData) {
                    const info = codeData.postal_code;
                    // Check logic for 'serviceable' based on your needs (e.g., is_pre_paid, is_cod)
                    // Usually 'pre_paid' support is the baseline
                    const isServiceable = info.pre_paid === "Y" || info.cod === "Y";

                    return {
                        serviceable: isServiceable,
                        city: info.district,
                        state: info.state_code, // Or check if they return full state name
                        codAvailable: info.cod === "Y",
                        details: info
                    };
                }
            }

            return { serviceable: false };

        } catch (error) {
            console.error('Delhivery Serviceability Error:', error);
            // On error, maybe fallback to allowing it or showing specific error?
            // For now, return false to be safe, or true to be permissible?
            // Let's return false but log it.
            return { serviceable: false, error: error.message }; 
        }
    },

    /**
     * Create Order / Generate Waybill
     * @param {object} orderDetails 
     * @returns {Promise<any>}
     */
    createOrder: async (orderDetails) => {
        const token = import.meta.env.VITE_DELHIVERY_TOKEN;
        if (!token) throw new Error("Delhivery Token missing");

        // Format payload typically required by Delhivery
        // This is a generic structure; fields might vary based on specific Delhivery account config
        const payload = {
            "format": "json",
            "data": {
                "shipments": [
                    {
                        "name": orderDetails.customerName,
                        "add": orderDetails.address,
                        "pin": orderDetails.pincode,
                        "city": orderDetails.city,
                        "state": orderDetails.state,
                        "country": "India",
                        "phone": orderDetails.phone,
                        "order": orderDetails.orderId,
                        "payment_mode": orderDetails.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
                        "mode": orderDetails.mode || 'S',
                        "return_pin": "", // Configurable: Warehouse pincode
                        "return_city": "",
                        "return_phone": "",
                        "return_add": "",
                        "products_desc": "Embroidery Items",
                        "hsn_code": "",
                        "cod_amount": orderDetails.paymentMethod === 'cod' ? orderDetails.amount : 0,
                        "order_date": new Date().toISOString(),
                        "total_amount": orderDetails.amount,
                        "seller_add": "", // Warehouse address
                        "seller_name": "Enbroidery",
                        "seller_inv": "", // Invoice number
                        "quantity": orderDetails.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
                        "waybill": "", // Leave empty for auto-generation
                        "shipment_width": "10", // Estimates
                        "shipment_height": "10",
                        "shipment_depth": "10",
                        "shipment_weight": "500" // Grams
                    }
                ],
            "pickup_location": {
                    "name": import.meta.env.VITE_DELHIVERY_WAREHOUSE_NAME || "Warehouse_Name", // MUST MATCH configured warehouse name in Delhivery Panel
                    "add": "Warehouse Address",
                    "city": "Remote City",
                    "pin_code": "110001",
                    "country": "India",
                    "phone": "9876543210"
                }
            }
        };

        try {
            // "Waybill/Order Creation" endpoint - typically cmu/create.json
            // Delhivery requires format=json&data={JSON} as FORM DATA
            const formData = new URLSearchParams();
            formData.append('format', 'json');
            formData.append('data', JSON.stringify(payload.data));

            const response = await fetch(`${BASE_URL}/api/cmu/create.json`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    // Content-Type is auto-set with URLSearchParams, but explicit is fine too
                },
                body: formData
            });

            if (!response.ok) {
                 const errText = await response.text();
                 throw new Error(`Delhivery Order Creation Failed: ${errText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Delhivery Create Order Error:', error);
            throw error;
        }
    },

    /**
     * Calculate Shipping Cost via Supabase Edge Function
     * @param {object} params { weight, origin_pin, dest_pin, mode, payment_type, amount }
     */
    calculateShipping: async (params) => {
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-rate-check', {
                body: params
            });

            if (error) throw error;
            
            // Check if function returned an error in the body
            if (data && data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Shipping Calculation Error:', error);
            
            // Try to extract actual error message from Supabase FunctionsHttpError
            if (error && error.context && typeof error.context.json === 'function') {
                try {
                    const errBody = await error.context.json();
                    if (errBody && errBody.error) {
                        throw new Error(errBody.error);
                    }
                } catch (e) {
                    // unexpected json parse error, ignore
                }
            }
            
            throw error;
        }
    },

    /**
     * Track Shipment
     * @param {string} waybill 
     */
    trackShipment: async (waybill) => {
        const token = import.meta.env.VITE_DELHIVERY_TOKEN;
        if (!token) throw new Error("Token missing");

        try {
            const response = await fetch(`${BASE_URL}/api/v1/packages/json/?waybill=${waybill}&token=${token}`, {
                method: 'GET'
            });

            if (!response.ok) throw new Error("Tracking API failed");
            
            const data = await response.json();
            // Parse response to find status
            // Response format: { Shipments: [ { Status: { Status: 'Delivered', ... }, Scans: [...] } ] }
            return data;
        } catch (error) {
            console.error("Tracking Error:", error);
            throw error;
        }
    }
};
