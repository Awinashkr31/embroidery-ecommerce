
/**
 * Xpressbees API Service
 * 
 * note: Requires VITE_XPRESSBEES_TOKEN in .env file
 */

import { supabase } from '../../config/supabase';

const BASE_URL = 'https://ship.xpressbees.com/api'; // Standard Xpressbees API URL, confirm with user if different

export const XpressbeesService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        const token = import.meta.env.VITE_XPRESSBEES_TOKEN;
        
        if (!token) {
            console.warn('Xpressbees Token not found. Skipping strict serviceability check.');
            return { serviceable: true, city: '', state: '' };
        }

        try {
            // Adjust endpoint based on specific Xpressbees API documentation
            const response = await fetch(`${BASE_URL}/courier/serviceability?pincode=${pincode}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Xpressbees API failed');
            }

            const data = await response.json();
             // Adjust response parsing based on actual API response
            if (data.status && data.data) {
                 return {
                    serviceable: data.data.serviceable, 
                    city: data.data.city,
                    state: data.data.state,
                    codAvailable: data.data.cod === true,
                    details: data.data
                 };
            }

            return { serviceable: false };

        } catch (error) {
            console.error('Xpressbees Serviceability Error:', error);
            // Fallback
            return { serviceable: false, error: error.message }; 
        }
    },

    /**
     * Create Order / Generate Waybill
     * @param {object} orderDetails 
     * @returns {Promise<any>}
     */
    createOrder: async (orderDetails) => {
        const token = import.meta.env.VITE_XPRESSBEES_TOKEN;
        if (!token) throw new Error("Xpressbees Token missing");

        const payload = {
            "order_number": orderDetails.orderId,
            "payment_method": orderDetails.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
            "consignee": {
                "name": orderDetails.customerName,
                "address": orderDetails.address,
                "pincode": orderDetails.pincode,
                "city": orderDetails.city,
                "state": orderDetails.state,
                "phone": orderDetails.phone
            },
            "pickup": {
                "warehouse_name": import.meta.env.VITE_XPRESSBEES_WAREHOUSE_NAME || "Main Warehouse"
            },
            "order_items": orderDetails.items.map(item => ({
                "name": item.name,
                "sku": item.sku || item.id,
                "qty": item.quantity,
                "price": item.price
            })),
            "collectable_amount": orderDetails.paymentMethod === 'cod' ? orderDetails.amount : 0
        };

        try {
            const response = await fetch(`${BASE_URL}/shipments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                 const errText = await response.text();
                 throw new Error(`Xpressbees Order Creation Failed: ${errText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Xpressbees Create Order Error:', error);
            throw error;
        }
    },

    /**
     * Calculate Shipping Cost via Supabase Edge Function
     * @param {object} params { weight, origin_pin, dest_pin, payment_type, amount }
     */
    calculateShipping: async (params) => {
        try {
            const { data, error } = await supabase.functions.invoke('xpressbees-rate-check', {
                body: params
            });

            if (error) throw error;
            
            if (data && data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Shipping Calculation Error:', error);
            
            if (error && error.context && typeof error.context.json === 'function') {
                try {
                    const errBody = await error.context.json();
                    if (errBody && errBody.error) {
                        throw new Error(errBody.error);
                    }
                } catch (e) {}
            }
            
            throw error;
        }
    },

    /**
     * Track Shipment
     * @param {string} waybill 
     */
    trackShipment: async (waybill) => {
        const token = import.meta.env.VITE_XPRESSBEES_TOKEN;
        if (!token) throw new Error("Token missing");

        try {
            const response = await fetch(`${BASE_URL}/shipments/track/${waybill}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Tracking API failed");

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Tracking Error:", error);
            throw error;
        }
    }
};
