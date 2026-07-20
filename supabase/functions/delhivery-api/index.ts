import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ALLOWED_ORIGINS = [
  'https://www.Crochet Wali.live',
  'https://Crochet Wali.live',
  'http://localhost:5173',
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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()

    if (!action) {
      throw new Error('Action is required')
    }

    const delhiveryToken = Deno.env.get('DELHIVERY_TOKEN')
    if (!delhiveryToken) {
      throw new Error('Delhivery Token not configured')
    }

    let response;
    let data;

    if (action === 'check-serviceability') {
      const { pincode } = payload;
      if (!pincode) throw new Error('Pincode is required');
      
      const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${delhiveryToken}`,
          'Content-Type': 'application/json'
        }
      });
      data = await response.json();
    } 
    else if (action === 'create-order') {
       const url = `https://track.delhivery.com/api/cmu/create.json`;
       const formData = new URLSearchParams();
       formData.append('format', 'json');
       formData.append('data', JSON.stringify(payload.data));

       response = await fetch(url, {
           method: 'POST',
           headers: {
               'Authorization': `Token ${delhiveryToken}`,
           },
           body: formData
       });
       
       if (!response.ok) {
           const errText = await response.text();
           throw new Error(`Delhivery Create Order Error: ${errText}`);
       }
       data = await response.json();
    }
    else if (action === 'track-shipment') {
        const { waybill } = payload;
        if (!waybill) throw new Error('Waybill is required');
        
        const url = `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}&token=${delhiveryToken}`;
        response = await fetch(url, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Delhivery Tracking Error: ${response.statusText}`);
        }
        data = await response.json();
    }
    else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // 🔍 Structured error logging
    console.error(JSON.stringify({
      function: 'delhivery-api',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));

    // Log to crash_logs table
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
      const sbLog = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await sbLog.from('crash_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        source: 'edge-function',
        function_name: 'delhivery-api',
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
