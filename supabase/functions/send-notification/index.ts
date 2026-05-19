// Follow this setup guide to integrate the Deno runtime into your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This function needs to be deployed to Supabase: npx supabase functions deploy send-notification

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const { orderId, status, awb, courier } = payload;

    if (!orderId || !status) {
        throw new Error("Missing required fields: orderId, status");
    }

    // 1. Fetch Order and Customer Details
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, customer_email, customer_phone, customer_name')
        .eq('id', orderId)
        .single();
    
    if (orderError || !order) {
        throw new Error(`Order not found: ${orderId}`);
    }

    // 2. Prepare Notification Content Based on Status
    const statusLower = status.toLowerCase();
    let emailSubject = '';
    let messageBody = '';

    if (statusLower.includes('shipped')) {
        emailSubject = `Your Order #${orderId.slice(0,8)} has been Shipped!`;
        messageBody = `Hi ${order.customer_name},\n\nYour order has been shipped via ${courier}. You can track it using AWB: ${awb}.\n\nTrack your order: https://enbroidery.com/track-order\n\nThanks,\nEnbroidery`;
    } else if (statusLower.includes('out for delivery')) {
        emailSubject = `Your Order #${orderId.slice(0,8)} is Out for Delivery!`;
        messageBody = `Hi ${order.customer_name},\n\nYour order is out for delivery today via ${courier}. AWB: ${awb}.\n\nThanks,\nEnbroidery`;
    } else if (statusLower.includes('delivered')) {
        emailSubject = `Your Order #${orderId.slice(0,8)} has been Delivered!`;
        messageBody = `Hi ${order.customer_name},\n\nYour order has been successfully delivered. We hope you love your purchase!\n\nThanks,\nEnbroidery`;
    } else if (statusLower.includes('failed') || statusLower.includes('rto')) {
        emailSubject = `Update regarding your Order #${orderId.slice(0,8)}`;
        messageBody = `Hi ${order.customer_name},\n\nThere was an issue delivering your order (${awb}). Please contact our support team for assistance.\n\nThanks,\nEnbroidery`;
    } else {
        emailSubject = `Order #${orderId.slice(0,8)} Update`;
        messageBody = `Hi ${order.customer_name},\n\nYour order status is now: ${status}.\n\nThanks,\nEnbroidery`;
    }

    // 3. Send Email (Example using Resend API)
    /*
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY && order.customer_email) {
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "orders@enbroidery.com",
                to: order.customer_email,
                subject: emailSubject,
                text: messageBody
            })
        });
    }
    */

    // 4. Send WhatsApp (Example using Meta Cloud API or Twilio)
    /*
    const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
    if (WHATSAPP_TOKEN && order.customer_phone) {
        // WhatsApp API Call Logic Here
    }
    */

    // 5. Log Notification in DB
    await supabase.from('notification_logs').insert([{
        order_id: orderId,
        type: 'email',
        status: 'sent',
        recipient: order.customer_email,
        content: emailSubject
    }]);

    console.log(`Successfully processed notifications for order ${orderId}`);

    return new Response(JSON.stringify({ success: true, message: "Notifications processed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Notification Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
