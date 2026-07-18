// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy delhivery-webhook

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

    // 4. Trigger Notifications for key status changes
    const notificationStatuses = ['shipped', 'out for delivery', 'delivered', 'rto initiated', 'delivery failed'];
    if (notificationStatuses.includes(statusLower)) {
        try {
            // Call a central notification handler edge function
            // In a real implementation, this would send Email/WhatsApp
            const notificationUrl = `${supabaseUrl}/functions/v1/send-notification`;
            await fetch(notificationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                    'x-internal-key': Deno.env.get('INTERNAL_SERVICE_KEY') || ''
                },
                body: JSON.stringify({
                    orderId: order.id,
                    status: newStatus,
                    awb: awb,
                    courier: 'Delhivery'
                })
            });
            console.log(`Notification triggered for Order ${order.id} - ${newStatus}`);
        } catch (notifErr) {
            console.error("Failed to trigger notification:", notifErr);
            // Don't throw, we still want to return 200 to Delhivery
        }
    }

    return new Response(JSON.stringify({ success: true, message: "Tracking updated and notifications triggered" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    // 🔍 Structured error logging
    console.error(JSON.stringify({
      function: 'delhivery-webhook',
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
        function_name: 'delhivery-webhook',
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
