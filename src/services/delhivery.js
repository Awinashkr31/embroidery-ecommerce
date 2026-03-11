/**
 * Delhivery API Service
 * 
 * note: Uses supabase edge function proxy to avoid exposing tokens in client.
 */

import { supabase } from '../../config/supabase';


export const DelhiveryService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-proxy', {
                body: { action: 'checkServiceability', payload: { pincode } }
            });

            if (error) {
                console.warn('Delhivery proxy error. Skipping strict serviceability check.', error);
                return { serviceable: true, city: '', state: '' };
            }

            // Check if function returned an error in the body
            if (data && data.error) {
                 console.warn('Delhivery proxy returned error. Skipping strict serviceability check.', data.error);
                 return { serviceable: true, city: '', state: '' };
            }
            
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
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-proxy', {
                body: { action: 'createOrder', payload: { orderDetails } }
            });

            if (error) throw error;

            if (data && data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Delhivery Create Order Error:', error);

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
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-proxy', {
                body: { action: 'trackShipment', payload: { waybill } }
            });

            if (error) throw error;
            
            if (data && data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error("Tracking Error:", error);

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
    }
};
