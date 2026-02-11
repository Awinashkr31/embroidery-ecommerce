// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy delhivery-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Security Check
    // Configure DELHIVERY_WEBHOOK_SECRET in your Supabase Dashboard -> Edge Functions -> Secrets
    const secret = Deno.env.get("DELHIVERY_WEBHOOK_SECRET");
    // Check header or query param
    const incomingToken = req.headers.get("x-delhivery-token") || new URL(req.url).searchParams.get("secret");

    if (secret && incomingToken !== secret) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
        });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log("Received Webhook Payload:", JSON.stringify(payload));

    // Delhivery Payload Structure (Generic fallback handling)
    const shipment = payload.Shipment || payload; // Fallback for different payload structures
    const awb = shipment.AWB || shipment.awb;
    const statusObj = shipment.Status || shipment;
    let newStatus = statusObj.Status || statusObj.status; 
    const statusLocation = statusObj.StatusLocation || statusObj.location;
    const statusTime = statusObj.StatusDateTime || statusObj.timestamp || new Date().toISOString();
    const orderRef = shipment.ReferenceNo || shipment.ref_no; // Assuming we sent our Order ID as Ref

    if (!awb || !newStatus) {
        throw new Error("Invalid payload: Missing AWB or Status");
    }

    // Normalize Status for RTO/Failure
    const statusLower = String(newStatus).toLowerCase();
    if (statusLower.includes("rto") || statusLower.includes("return")) {
        newStatus = "RTO Initiated";
    } else if (statusLower.includes("fail") || statusLower.includes("undelivered")) {
        newStatus = "Delivery Failed"; 
    }

    // 1. Find Order (by AWB or Reference)
    let { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, current_status')
        .eq('waybill_id', awb)
        .single();
    
    if (findError || !order) {
        // Try identifying by Reference Number (Order ID)
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
            courier_partner: 'Delhivery'
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
            remarks: `Update from Delhivery (AWB: ${awb})`
        });

    if (logError) throw logError;

    return new Response(JSON.stringify({ success: true, message: "Tracking updated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
