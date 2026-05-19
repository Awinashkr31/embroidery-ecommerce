/**
 * Delhivery API Service
 */

import { supabase } from '../config/supabase';

export const DelhiveryService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'check-serviceability', payload: { pincode } }
            });

            if (error) {
                 console.error('Edge Function Error:', error);
                 return { serviceable: false, error: 'Network Error' };
            }

            if (data?.error) {
                console.warn('Delhivery Logic Error:', data.error);
                return { serviceable: false, error: data.error };
            }

            // Delhivery returns: { "delivery_codes": [ { "postal_code": { ... } } ] }
            const deliveryCodes = data?.delivery_codes;
            
            if (deliveryCodes && deliveryCodes.length > 0) {
                const codeData = deliveryCodes.find(c => c.postal_code.pin == pincode);
                
                if (codeData) {
                    const info = codeData.postal_code;
                    // Usually 'pre_paid' support is the baseline
                    const isServiceable = info.pre_paid === "Y" || info.cod === "Y";

                    // EDD Calculation based on Delhivery zone data
                    const processingDays = 2; // Handmade processing time

                    // Use Delhivery's max_days if available, otherwise estimate by zone
                    let transitDays;
                    if (info.max_days && Number(info.max_days) > 0) {
                        transitDays = Number(info.max_days);
                    } else {
                        // Zone-based heuristic using state and area type
                        const originState = "PB"; // Punjab (warehouse state)
                        const destState = (info.state_code || "").toUpperCase();
                        const isODA = info.is_oda === "Y";
                        const isMetro = ["DL", "MH", "KA", "TN", "WB", "TG", "GJ"].includes(destState);
                        const isSameState = destState === originState;
                        const isNorthIndia = ["PB", "HR", "HP", "UK", "UP", "RJ", "DL", "CH", "JK"].includes(destState);
                        const isNorthEast = ["AS", "AR", "MN", "ML", "MZ", "NL", "TR", "SK"].includes(destState);

                        if (isSameState) {
                            transitDays = isODA ? 3 : 2;
                        } else if (isNorthIndia) {
                            transitDays = isODA ? 5 : 3;
                        } else if (isMetro) {
                            transitDays = isODA ? 6 : 4;
                        } else if (isNorthEast) {
                            transitDays = isODA ? 9 : 7;
                        } else {
                            transitDays = isODA ? 7 : 5;
                        }
                    }
                    
                    const minDays = processingDays + transitDays;
                    const maxDays = minDays + 2;

                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + minDays);
                    
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + maxDays);

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    // Handle cross-month display
                    const eddString = minDate.getMonth() === maxDate.getMonth()
                        ? `${minDate.getDate()}–${maxDate.getDate()} ${monthNames[maxDate.getMonth()]}`
                        : `${minDate.getDate()} ${monthNames[minDate.getMonth()]}–${maxDate.getDate()} ${monthNames[maxDate.getMonth()]}`;

                    return {
                        serviceable: isServiceable,
                        city: info.district,
                        state: info.state_code, 
                        codAvailable: info.cod === "Y",
                        eddString: eddString,
                        processingDays,
                        transitDays,
                        details: info
                    };
                }
            }

            return { serviceable: false, error: 'Pincode not serviceable' };

        } catch (error) {
            console.error('Delhivery Serviceability Error:', error);
            // On error, maybe fallback to allowing it or showing specific error?
            // For now, return false to be safe.
            return { serviceable: false, error: error.message }; 
        }
    },

    /**
     * Calculate Shipping Rates
     * @param {object} params - { weight, origin_pin, dest_pin, mode, payment_type, amount }
     * @returns {Promise<any>}
     */
    calculateShipping: async (params) => {
        try {
            // Uses dedicated delhivery-rate-check edge function
            const { data, error } = await supabase.functions.invoke('delhivery-rate-check', {
                body: params
            });

            if (error) {
                console.error('Edge Function Error:', error);
                throw new Error('Network Error during rate calculation');
            }

            if (data?.error) {
                console.warn('Delhivery Rate Error:', data.error);
                throw new Error(data.error);
            }

            return data; // Return the rates object
        } catch (error) {
            console.error('Delhivery Calculate Shipping Error:', error);
            throw error;
        }
    },

    /**
     * Create Order / Generate Waybill
     * @param {object} orderDetails 
     * @returns {Promise<any>}
     */
    createOrder: async (orderDetails) => {
        const payload = {
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
                    "products_desc": "Embroidery Items",
                    "cod_amount": orderDetails.paymentMethod === 'cod' ? orderDetails.amount : 0,
                    "order_date": new Date().toISOString(),
                    "total_amount": orderDetails.amount,
                    "seller_name": "Enbroidery",
                    "quantity": orderDetails.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
                    "waybill": "",
                    "shipment_width": "10",
                    "shipment_height": "10",
                    "shipment_depth": "10",
                    "shipment_weight": "500"
                }
            ]
            // NOTE: pickup_location and return details are now configured
            // server-side in the Edge Function using Supabase secrets.
        };

        try {
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'create-order', payload: { data: payload } }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error('Delhivery Create Order Error:', error);
            throw error;
        }
    },

    /**
     * Create Return / Reverse Pickup
     * @param {object} returnDetails 
     * @returns {Promise<any>}
     */
    createReturn: async (returnDetails) => {
        const payload = {
            "shipments": [
                {
                    "name": returnDetails.customerName,
                    "add": returnDetails.address,
                    "pin": returnDetails.pincode,
                    "city": returnDetails.city,
                    "state": returnDetails.state,
                    "country": "India",
                    "phone": returnDetails.phone,
                    "order": returnDetails.orderId + "-RET",
                    "payment_mode": "Prepaid", // Reverse pickups are prepaid by the merchant
                    "return_direction": "R", // R indicates Reverse Pickup
                    "products_desc": "Return: Embroidery Items",
                    "cod_amount": 0,
                    "order_date": new Date().toISOString(),
                    "total_amount": returnDetails.amount,
                    "seller_name": "Enbroidery",
                    "quantity": returnDetails.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
                    "waybill": "",
                    "shipment_width": "10",
                    "shipment_height": "10",
                    "shipment_depth": "10",
                    "shipment_weight": "500"
                }
            ]
        };

        try {
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'create-order', payload: { data: payload } } // Same endpoint
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error('Delhivery Create Return Error:', error);
            throw error;
        }
    },

    /**
     * Track Shipment
     * @param {string} waybill 
     */
    trackShipment: async (waybill) => {
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'track-shipment', payload: { waybill } }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error("Tracking Error:", error);
            throw error;
        }
    }
};
