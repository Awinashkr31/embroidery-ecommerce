import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Convert ArrayBuffer to Hex String
function buf2hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('');
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the user that called the function.
    // We use the service role key to bypass RLS for fetching products secure price
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData: any = await req.json()
    const { action } = requestData

    // Initialize Razorpay keys
    const key_id = Deno.env.get('RAZORPAY_KEY_ID')
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are missing in Edge Function secrets.')
    }

    if (action === 'create-order') {
        const { cartItems, couponCode } = requestData

        // 1. Calculate Subtotal Securely
        let subtotal = 0 
        const productIds = cartItems.map((i: any) => i.id)
        
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, price, variants, "clothingInformation"')
            .in('id', productIds)

        if (prodError) throw prodError

        cartItems.forEach((item: any) => {
            const product = products?.find((p: any) => p.id === item.id)
            if(product) {
                let itemPrice = Number(product.price);
                
                // Account for Color-based Variant Pricing
                if (item.variantId && product.variants && Array.isArray(product.variants)) {
                    const variant = product.variants.find((v: any) => v.id === item.variantId);
                    if (variant && variant.price) {
                        itemPrice = Number(variant.price);
                    }
                } 
                // Fallback to older clothing selection matrix pricing
                else if (product.clothingInformation?.variantStock && item.selectedSize && item.selectedColor) {
                    const key = `${item.selectedColor}-${item.selectedSize}`;
                    const variantData = product.clothingInformation.variantStock[key];
                    if (variantData && variantData.price) {
                        itemPrice = Number(variantData.price);
                    }
                }

                subtotal += itemPrice * item.quantity
            }
        })

        // 2. Apply Coupon
        let discount = 0
        if (couponCode) {
            // Placeholder: Backend verification of coupons can be implemented here.
        }
        
        // Fetch dynamic shipping settings
        const { data: settingsData, error: settingsError } = await supabase
            .from('website_settings')
            .select('setting_key, setting_value')
            .in('setting_key', ['shipping_free_delivery_threshold', 'shipping_delivery_charge'])

        if (settingsError) throw settingsError

        let freeDeliveryThreshold = 499
        let deliveryCharge = 50

        if (settingsData) {
            const thresholdSetting = settingsData.find((s: any) => s.setting_key === 'shipping_free_delivery_threshold')
            const chargeSetting = settingsData.find((s: any) => s.setting_key === 'shipping_delivery_charge')
            
            if (thresholdSetting && thresholdSetting.setting_value) {
                freeDeliveryThreshold = Number(thresholdSetting.setting_value)
            }
            if (chargeSetting && chargeSetting.setting_value) {
                deliveryCharge = Number(chargeSetting.setting_value)
            }
        }
        
        // Replicating frontend dynamic shipping logic
        const shipping = subtotal < freeDeliveryThreshold ? deliveryCharge : 0
        
        const totalAmount = subtotal - discount + shipping

        // 3. Create Razorpay Order
        const options = {
            amount: Math.round(totalAmount * 100), // convert to paise
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
            console.error('Razorpay Order Creation Error:', errorText);
            throw new Error(`Razorpay API Error: ${orderRes.statusText}`);
        }

        const order = await orderRes.json();

        return new Response(JSON.stringify(order), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }

    if (action === 'verify-signature') {
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

        if (generated_signature === signature) {
             return new Response(JSON.stringify({ status: 'success' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        } else {
             return new Response(JSON.stringify({ status: 'failure' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error: any) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
