/**
 * SHIPPING & DELIVERY CONSTANTS (Single Source of Truth)
 * 
 * Confirmed values (owner-verified, October 2026):
 * - FREE_SHIPPING_THRESHOLD = ₹999
 * - SHIPPING_CHARGE_BELOW_THRESHOLD = ₹50
 * - MINIMUM_ORDER_VALUE = ₹99
 * - CRAFTING/DISPATCH_TIME = 2–4 days crafting
 * - DELIVERY_TIME = 4–7 business days shipping
 * - EXPRESS_OPTION = none stated (do not advertise an express option)
 */

// Confirmed owner-verified values
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_CHARGE_BELOW_THRESHOLD = 50;
export const MINIMUM_ORDER_VALUE = 99;
export const DISPATCH_DAYS = "2–4 days crafting";
export const DELIVERY_DAYS = "4–7 business days shipping";
export const EXPRESS_OPTION = ""; // None stated — do not advertise express option

// Standardized UI strings to keep copy identical everywhere
export const SHIPPING_SUMMARY = {
  freeShippingText: `Free shipping on orders over ₹${FREE_SHIPPING_THRESHOLD}`,
  freeShippingThresholdLabel: `₹${FREE_SHIPPING_THRESHOLD}`,
  shippingFeeLabel: `₹${SHIPPING_CHARGE_BELOW_THRESHOLD}`,
  minimumOrderLabel: `₹${MINIMUM_ORDER_VALUE}`,
  dispatchText: `Handcrafted & dispatched within ${DISPATCH_DAYS}`,
  deliveryText: `Standard delivery in ${DELIVERY_DAYS} across India`,
  expressText: EXPRESS_OPTION,
  fullShippingPolicy: `Orders of ₹${FREE_SHIPPING_THRESHOLD} and above qualify for Free Standard Delivery across India. For orders under ₹${FREE_SHIPPING_THRESHOLD}, a flat standard shipping fee of ₹${SHIPPING_CHARGE_BELOW_THRESHOLD} applies. Minimum order value is ₹${MINIMUM_ORDER_VALUE}. All pieces are handmade to order and require ${DISPATCH_DAYS}, followed by ${DELIVERY_DAYS}.`
};
