
// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy xpressbees-rate-check

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    const { weight, origin_pin, dest_pin, payment_type, amount } = await req.json();

    const token = Deno.env.get("XPRESSBEES_TOKEN"); // Set this in Supabase Secrets
    if (!token) {
        throw new Error("Server configuration error: Xpressbees Token missing");
    }

    // Example Xpressbees Rate API endpoint - verify with docs
    const apiUrl = "https://ship.xpressbees.com/api/courier/serviceability"; 
    
    const response = await fetch(apiUrl, {
        method: "POST", // or GET depending on API
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            origin: origin_pin,
            destination: dest_pin,
            weight: weight,
            payment_type: payment_type,
            order_amount: amount
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Xpressbees Rate/Serviceability Check Failed: ${errText}`);
    }

    const data = await response.json();
    
    // Transform to standard format if needed
    // Assuming data returns { freight: 100, gst: 18, total: 118 }
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    // 🔍 Structured error logging
    console.error(JSON.stringify({
      function: 'xpressbees-rate-check',
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
        function_name: 'xpressbees-rate-check',
        url: req.url,
        request_method: req.method
      });
    } catch (_) { /* Silent */ }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
