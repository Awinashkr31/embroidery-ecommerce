import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { weight, origin_pin, dest_pin, mode, payment_type, amount } = await req.json()

    // Validate inputs
    if (!origin_pin || !dest_pin || !weight) {
      throw new Error('Missing required fields: origin_pin, dest_pin, weight')
    }

    const delhiveryToken = Deno.env.get('DELHIVERY_TOKEN')
    if (!delhiveryToken) {
      throw new Error('Delhivery Token not configured')
    }

    // Delhivery Rate API URL
    // Documentation: https://track.delhivery.com/api/kinko/v1/invoice/charges/
    const url = new URL("https://track.delhivery.com/api/kinko/v1/invoice/charges/")
    
    // Add Query Parameters
    // md: S (Surface) or E (Express)
    // ss: Delivered (Status for calculation)
    // d_pin: Delivery Pincode
    // o_pin: Pickup Pincode
    // cgm: Charged weight in grams
    // pt: Payment Type (Pre-paid / COD)
    // cod: COD Amount (if any)

    url.searchParams.append("md", mode || "S") 
    url.searchParams.append("ss", "Delivered")
    url.searchParams.append("d_pin", dest_pin)
    url.searchParams.append("o_pin", origin_pin)
    url.searchParams.append("cgm", weight) // Weight in Grams
    url.searchParams.append("pt", payment_type === 'cod' ? "COD" : "Pre-paid")
    
    if (payment_type === 'cod' && amount) {
        url.searchParams.append("cod", amount)
    }

    console.log(`Fetching rates from: ${url.toString()}`)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Token ${delhiveryToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delhivery API Error:', errorText)
      throw new Error(`Delhivery API Error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Delhivery Response:", JSON.stringify(data))

    // Parse and standardize response for Frontend
    // Structure: { charges: { freight, fuel_surcharge, cod_charges, gst, total_amount }, ... }
    
    if (!data || !data[0] || !data[0].total_amount) {
         // Sometimes it returns array, sometimes object. Let's handle generic array response if applicable
    }
    
    // API typically returns an array of objects if multiple results, or single object?
    // Based on user snippet: 
    // { "success": true, "charges": { ... } }
    
    // However, some Delhivery APIs return array `[{ ... }]`. 
    // Let's assume the user snippet is correct but be defensive.
    const result = Array.isArray(data) ? data[0] : data;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
