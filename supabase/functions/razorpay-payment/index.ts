import Razorpay from 'npm:razorpay'
import { createClient } from 'jsr:@supabase/supabase-js@2'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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

    const requestData = await req.json()
    const { action } = requestData

    // Initialize Razorpay
    const key_id = Deno.env.get('RAZORPAY_KEY_ID')
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are missing in Edge Function secrets.')
    }

    const razorpay = new Razorpay({ key_id, key_secret })

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
            const product = products?.find(p => p.id === item.id)
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
            // Note: In a real app, you would fetch coupons from a 'coupons' table
            // For now, assuming standard logic or you might want to create a table.
            // Since we don't have a coupons table in the provided schema, 
            // valid coupons might be hardcoded or passed insecurely for now.
            // CAUTION: If coupons are client-side only (localStorage), we can't verify them securely easily without a DB table.
            // PROVISIONAL: Accept the discount if it's reasonable or create a mock verify.
            // Let's assume we trust the logic for now OR just ignore coupons to be safe if no table exists.
            
            // Checking if 'appliedCoupon' object was passed - strict security would require verify.
            // Let's assume no coupon support for 'Online' unless we add the table.
            // I will skip backend coupon verification for this MVP step to avoid scope creep, 
            // OR checks generic codes if known.
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
            const thresholdSetting = settingsData.find(s => s.setting_key === 'shipping_free_delivery_threshold')
            const chargeSetting = settingsData.find(s => s.setting_key === 'shipping_delivery_charge')
            
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

        const order = await razorpay.orders.create(options)

        return new Response(JSON.stringify(order), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }

    if (action === 'verify-signature') {
        const { paymentId, orderId, signature } = requestData
        
        // Node.js crypto module is available in Deno via "node:crypto"
        // @ts-ignore
        const crypto = await import("node:crypto");
        
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(orderId + "|" + paymentId)
            .digest("hex");

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

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
