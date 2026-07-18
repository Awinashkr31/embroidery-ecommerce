import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify Authorization Header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    // Create Supabase client with the user's auth token to verify it
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
    })
    
    // Verify the user token is valid
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
        })
    }

    const { weight, origin_pin, dest_pin, mode, payment_type, amount } = await req.json()

    // Validate inputs
    if (!origin_pin || !dest_pin || !weight) {
      throw new Error('Missing required fields: origin_pin, dest_pin, weight')
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(origin_pin.toString()) || !pinRegex.test(dest_pin.toString())) {
       throw new Error('Invalid pincode format. Must be 6 digits.')
    }
    
    if (isNaN(Number(weight)) || Number(weight) <= 0) {
       throw new Error('Invalid weight')
    }
    
    if (payment_type === 'cod' && (isNaN(Number(amount)) || Number(amount) < 0)) {
       throw new Error('Invalid COD amount')
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

    // 1. Check Internal Edge Cache
    const cacheKeyString = `https://internal.cache/rates?${url.searchParams.toString()}`;
    const cacheReq = new Request(cacheKeyString, { method: 'GET' });
    let cache;
    try {
        cache = await caches.open('delhivery-rates');
        const cachedResponse = await cache.match(cacheReq);
        if (cachedResponse) {
            console.log(`Cache HIT for ${cacheKeyString}`);
            const cachedData = await cachedResponse.json();
            return new Response(JSON.stringify(cachedData), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }
    } catch (cacheErr) {
        console.warn("Cache API not available or error:", cacheErr);
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
      
      // Negative Caching for invalid pincodes (prevent DoS)
      if (cache) {
         const errorResponse = new Response(JSON.stringify({ error: `Delhivery API Error: ${response.statusText}` }), {
             headers: { 'Cache-Control': 'max-age=300' } // 5 min TTL for errors
         });
         cache.put(cacheReq, errorResponse).catch(err => console.error("Cache write error:", err));
      }

      throw new Error(`Delhivery API Error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Delhivery Response:", JSON.stringify(data))

    const result = Array.isArray(data) ? data[0] : data;

    // 2. Save to Cache
    if (cache) {
        // Create a clone with Cache-Control for Deno's internal TTL (1 hour)
        const cacheResponse = new Response(JSON.stringify(result), {
            headers: { 'Cache-Control': 'max-age=3600' }
        });
        cache.put(cacheReq, cacheResponse).catch(err => console.error("Cache write error:", err));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // 🔍 Structured error logging
    console.error(JSON.stringify({
      function: 'delhivery-rate-check',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));

    // Log to crash_logs table
    try {
      const sbLog = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await sbLog.from('crash_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        source: 'edge-function',
        function_name: 'delhivery-rate-check',
        url: req.url,
        request_method: req.method
      });
    } catch (_) { /* Silent */ }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
