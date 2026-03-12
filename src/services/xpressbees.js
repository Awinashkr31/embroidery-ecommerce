
/**
 * Xpressbees API Service
 * 
 * Securely uses Supabase Edge Functions to prevent exposing the API token.
 * All calls are routed through the 'delhivery-api' Edge Function with provider: 'xpressbees'.
 */

import { supabase } from '../config/supabase';

export const XpressbeesService = {
    /**
     * Check if a pincode is serviceable
     * @param {string} pincode 
     * @returns {Promise<{serviceable: boolean, city: string, state: string, details: any}>}
     */
    checkServiceability: async (pincode) => {
        try {
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'xb-check-serviceability', payload: { pincode } }
            });

            if (error) {
                console.error('Edge Function Error:', error);
                return { serviceable: false, error: 'Network Error' };
            }

            if (data?.error) {
                console.warn('Xpressbees Logic Error:', data.error);
                return { serviceable: false, error: data.error };
            }

            if (data?.status && data?.data) {
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
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'xb-calculate-shipping', payload: { data: params } }
            });

            if (error) {
                 console.error('Edge Function Error:', error);
                 throw new Error('Network Error during rate calculation');
            }

            if (data?.error) {
                console.warn('Xpressbees Rate Error:', data.error);
                throw new Error(data.error);
            }

            return data?.data || data; // Return the rates object
        } catch (error) {
            console.error('Xpressbees Calculate Shipping Error:', error);
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
                "warehouse_name": "Main Warehouse"
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
            const { data, error } = await supabase.functions.invoke('delhivery-api', {
                body: { action: 'xb-create-order', payload: { data: payload } }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error('Xpressbees Create Order Error:', error);
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
                body: { action: 'xb-track-shipment', payload: { waybill } }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        } catch (error) {
            console.error("Xpressbees Tracking Error:", error);
            throw error;
        }
    }
};
