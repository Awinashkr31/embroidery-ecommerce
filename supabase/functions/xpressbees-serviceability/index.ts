import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = 'https://ship.xpressbees.com/api';

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pincode } = await req.json();

    const token = Deno.env.get("XPRESSBEES_TOKEN");
    if (!token) {
        throw new Error("Server configuration error: Xpressbees Token missing");
    }

    const apiUrl = `${BASE_URL}/courier/serviceability?pincode=${pincode}`;

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Xpressbees Serviceability Check Failed: ${errText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Serviceability Check Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
