
// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy xpressbees-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function timingSafeEqual(a: string, b: string): boolean {
    const aView = new TextEncoder().encode(a || "");
    const bView = new TextEncoder().encode(b || "");
    if (aView.byteLength !== bView.byteLength) return false;
    let result = 0;
    for (let i = 0; i < aView.byteLength; i++) {
        result |= aView[i] ^ bView[i];
    }
    return result === 0;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Security Check
    // Configure XPRESSBEES_WEBHOOK_SECRET in your Supabase Dashboard -> Edge Functions -> Secrets
    const secret = Deno.env.get("XPRESSBEES_WEBHOOK_SECRET");
    const incomingToken = req.headers.get("x-xpressbees-token") || new URL(req.url).searchParams.get("secret");

    if (secret && !timingSafeEqual(incomingToken || "", secret)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
        });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Received Xpressbees Webhook:", JSON.stringify(payload));

    // Xpressbees Payload Structure (Generic fallback)
    // Adjust based on actual payload: often includes 'awb', 'status', 'order_number'
    const awb = payload.awb_number || payload.awb;
    const newStatus = payload.status;
    const statusLocation = payload.current_location || payload.location;
    const statusTime = payload.status_date || new Date().toISOString();
    const orderRef = payload.order_number || payload.ref_id;

    if (!awb || !newStatus) {
        throw new Error("Invalid payload: Missing AWB or Status");
    }

    // 1. Find Order
    let { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, current_status')
        .eq('waybill_id', awb)
        .single();
    
    if (findError || !order) {
         if (orderRef) {
             const { data: orderByRef, error: refError } = await supabase
                .from('orders')
                .select('id, current_status')
                .eq('id', orderRef) 
                .single();
             if (!refError && orderByRef) order = orderByRef;
         }
    }

    if (!order) {
        return new Response(JSON.stringify({ message: "Order not found", awb }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
        });
    }

    // 2. Update Order Status
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            current_status: newStatus,
            last_status_at: statusTime,
            courier_partner: 'Xpressbees'
        })
        .eq('id', order.id);

    if (updateError) throw updateError;

    // 3. Insert Log
    const { error: logError } = await supabase
        .from('order_status_logs')
        .insert({
            order_id: order.id,
            status: newStatus,
            location: statusLocation,
            timestamp: statusTime,
            remarks: `Update from Xpressbees (AWB: ${awb})`
        });

    if (logError) throw logError;

    return new Response(JSON.stringify({ success: true, message: "Tracking updated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    // 🔍 Structured error logging
    console.error(JSON.stringify({
      function: 'xpressbees-webhook',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));

    // Log to crash_logs table
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const sbLog = createClient(supabaseUrl, supabaseKey);
      await sbLog.from('crash_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        source: 'edge-function',
        function_name: 'xpressbees-webhook',
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
