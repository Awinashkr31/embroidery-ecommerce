import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Restrict CORS to known production domains
const ALLOWED_ORIGINS = [
  'https://www.embroiderybysana.live',
  'https://embroiderybysana.live',
  'http://localhost:5173', // dev only
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
    'Vary': 'Origin',
  };
}

function buf2hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
    const aView = new TextEncoder().encode(a);
    const bView = new TextEncoder().encode(b);
    if (aView.byteLength !== bView.byteLength) return false;
    let result = 0;
    for (let i = 0; i < aView.byteLength; i++) {
        result |= aView[i] ^ bView[i];
    }
    return result === 0;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData: any = await req.json()
    const { action } = requestData

    const key_id = Deno.env.get('RAZORPAY_KEY_ID')
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    // ============================================================================
    // Helper: Securely Calculate Total Amount
    // ============================================================================
    const calculateSecureTotals = async (cartItems: any[], couponCode: string | null, isGiftWrapped: boolean = false) => {
        let subtotal = 0 
        const productIds = cartItems.map((i: any) => i.id)
        
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, price, variants, clothing_information')
            .in('id', productIds)

        if (prodError) throw prodError

        cartItems.forEach((item: any) => {
            const product = products?.find((p: any) => p.id === item.id)
            if(product) {
                let itemPrice = Number(product.price);
                if (item.variantId && product.variants && Array.isArray(product.variants)) {
                    const variant = product.variants.find((v: any) => v.id === item.variantId);
                    if (variant && variant.price) {
                        itemPrice = Number(variant.price);
                    }
                } 
                else if (product.clothing_information?.variantStock && item.selectedSize && item.selectedColor) {
                    const key = `${item.selectedColor}-${item.selectedSize}`;
                    const variantData = product.clothing_information.variantStock[key];
                    if (variantData && variantData.price) {
                        itemPrice = Number(variantData.price);
                    }
                }
                subtotal += itemPrice * item.quantity
            }
        })

        let discount = 0
        if (couponCode) {
            const { data: coupon, error: couponError } = await supabase
                .from('coupons')
                .select('discount, type, min_order, max_discount, expiry, usage_limit, included_categories')
                .eq('code', couponCode.toUpperCase().trim())
                .single();

            if (!couponError && coupon) {
                // Validate expiry
                if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
                    throw new Error('Coupon has expired');
                }
                // Validate minimum order
                if (coupon.min_order && subtotal < Number(coupon.min_order)) {
                    throw new Error(`Minimum order of ₹${coupon.min_order} required`);
                }
                // Calculate discount
                if (coupon.type === 'percentage') {
                    discount = Math.round(subtotal * (Number(coupon.discount) / 100));
                    if (coupon.max_discount) {
                        discount = Math.min(discount, Number(coupon.max_discount));
                    }
                } else {
                    discount = Number(coupon.discount);
                }
            } else {
                throw new Error('Invalid coupon code');
            }
        }
        
        const { data: settingsData, error: settingsError } = await supabase
            .from('website_settings')
            .select('setting_key, setting_value')
            .in('setting_key', ['shipping_free_delivery_threshold', 'shipping_delivery_charge'])

        if (settingsError) throw settingsError

        let freeDeliveryThreshold = 499
        let deliveryCharge = 50

        if (settingsData) {
            const thresholdSetting = settingsData.find((s: any) => s.setting_key === 'shipping_free_delivery_threshold')
            if (thresholdSetting?.setting_value) freeDeliveryThreshold = Number(thresholdSetting.setting_value)

            const chargeSetting = settingsData.find((s: any) => s.setting_key === 'shipping_delivery_charge')
            if (chargeSetting?.setting_value) deliveryCharge = Number(chargeSetting.setting_value)
        }
        
        const shipping = subtotal < freeDeliveryThreshold ? deliveryCharge : 0
        let giftWrapTotal = 0;
        if (isGiftWrapped) {
            giftWrapTotal = 29;
        }
        const totalAmount = subtotal - discount + shipping + giftWrapTotal

        return { subtotal, discount, shipping, giftWrapTotal, totalAmount }
    }

    // ============================================================================
    // Action: Validate COD Checkout
    // ============================================================================
    if (action === 'validate-cod') {
        const { cartItems, couponCode, clientTotal, isGiftWrapped } = requestData

        const totals = await calculateSecureTotals(cartItems, couponCode, isGiftWrapped)

        // Prevent client-side manipulation. If they send ₹0, and we calculated ₹500, we reject.
        // We allow a small tolerance for floating point rounding diffs if any.
        if (Math.abs(totals.totalAmount - (clientTotal || 0)) > 5) {
             throw new Error(`Total mismatch. Client sent ${clientTotal}, but Server calculated ${totals.totalAmount}.`)
        }

        return new Response(JSON.stringify({ status: 'valid', totals }), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
            status: 200,
        })
    }

    // ============================================================================
    // Action: Create Razorpay Order
    // ============================================================================
    if (action === 'create-order') {
        if (!key_id || !key_secret) throw new Error('Razorpay keys missing.')

        const { cartItems, couponCode, isGiftWrapped } = requestData
        const totals = await calculateSecureTotals(cartItems, couponCode, isGiftWrapped)

        const options = {
            amount: Math.round(totals.totalAmount * 100), // convert to paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        }

        const authHeader = `Basic ${btoa(`${key_id}:${key_secret}`)}`
        const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(options)
        });

        if (!orderRes.ok) {
            const errorText = await orderRes.text();
            throw new Error(`Razorpay API Error: ${orderRes.statusText}`);
        }

        const order = await orderRes.json();

        return new Response(JSON.stringify(order), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
            status: 200,
        })
    }

    // ============================================================================
    // Action: Verify Razorpay Signature
    // ============================================================================
    if (action === 'verify-signature') {
        if (!key_secret) throw new Error('Razorpay keys missing.')
        const { paymentId, orderId, signature } = requestData
        
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key_secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(orderId + "|" + paymentId)
        );
        
        const generated_signature = buf2hex(signatureBuffer);

        if (timingSafeEqual(generated_signature, signature)) {
             return new Response(JSON.stringify({ status: 'success' }), {
                headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
                status: 200,
            })
        } else {
             return new Response(JSON.stringify({ status: 'failure' }), {
                headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
                status: 400,
            })
        }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error: any) {
    // 🔍 Structured error logging for Supabase Edge Function Logs
    console.error(JSON.stringify({
      function: 'process-checkout',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    }));

    // Also log to crash_logs table for dashboard visibility
    try {
      const supabaseForLog = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await supabaseForLog.from('crash_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        source: 'edge-function',
        function_name: 'process-checkout',
        url: req.url,
        request_method: req.method,
        extra_context: { action: 'unknown' }
      });
    } catch (_) { /* Don't let logging crash the error handler */ }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
