
/**
 * Xpressbees API Service
 */

import { supabase } from '../../config/supabase';

export const XpressbeesService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        try {
            const { data, error } = await supabase.functions.invoke('xpressbees-serviceability', {
                body: { pincode }
            });

            if (error) throw error;

            if (data && data.error) {
                // If it's a dev environment and token is missing in edge function, we could potentially fallback.
                // But edge function errors are usually strings or objects.
                throw new Error(data.error);
            }

             // Adjust response parsing based on actual API response
            if (data && data.status && data.data) {
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

            // Check for missing token error from edge function to provide dev fallback
            let isMissingToken = false;
            if (error && error.message && error.message.includes('Server configuration error')) {
                 isMissingToken = true;
            } else if (error && error.context && typeof error.context.json === 'function') {
                try {
                    const errBody = await error.context.json();
                    if (errBody && errBody.error && errBody.error.includes('Server configuration error')) {
                        isMissingToken = true;
                    }
                } catch (e) {}
            }

            if (isMissingToken) {
                 console.warn('Xpressbees Token not found on server. Skipping strict serviceability check.');
                 return { serviceable: true, city: '', state: '' };
            }

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
            const { data, error } = await supabase.functions.invoke('xpressbees-create-order', {
                body: payload
            });

            if (error) throw error;

            if (data && data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Xpressbees Create Order Error:', error);

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
        try {
            const { data, error } = await supabase.functions.invoke('xpressbees-track-shipment', {
                body: { waybill }
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
