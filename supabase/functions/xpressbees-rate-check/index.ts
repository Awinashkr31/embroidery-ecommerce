
// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy xpressbees-rate-check

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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
    console.error("Rate Check Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
