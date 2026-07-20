// ============================================================================
// 🚨 SEND CRASH ALERT
// Triggered by Supabase Database Webhook when a new crash is logged.
// Sends email notification to admin via Resend API.
//
// Required secrets (set in Supabase Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY       — Get from https://resend.com (free: 100 emails/day)
//   CRASH_ALERT_EMAIL    — Admin email (e.g., awinashkr31@gmail.com)
//   WEBHOOK_SECRET       — Secret to validate webhook calls
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Security: Verify webhook secret
    const secret = Deno.env.get("WEBHOOK_SECRET");
    const incomingToken = req.headers.get("x-webhook-secret") || new URL(req.url).searchParams.get("secret");

    if (secret && !timingSafeEqual(incomingToken || "", secret)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
        });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const CRASH_ALERT_EMAIL = Deno.env.get("CRASH_ALERT_EMAIL") || "awinashkr31@gmail.com";

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured. Skipping email alert.");
      return new Response(JSON.stringify({ message: "Email not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const payload = await req.json();
    const { type, table, record } = payload;

    // Only process INSERTs on crash_logs
    if (table !== "crash_logs" || type !== "INSERT") {
      return new Response(JSON.stringify({ message: "Ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const crash = record;
    const timestamp = new Date(crash.created_at || Date.now()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    // Build email HTML
    const sourceEmoji = crash.source === 'frontend' ? '🖥️' : crash.source === 'edge-function' ? '⚡' : '🤖';
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 24px; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🚨 Crash Alert — Embroidery</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">${timestamp}</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 16px 16px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #737373; width: 120px;">Source</td>
              <td style="padding: 8px 0; font-weight: 600;">${sourceEmoji} ${crash.source || 'unknown'}</td>
            </tr>
            ${crash.function_name ? `
            <tr>
              <td style="padding: 8px 0; color: #737373;">Function</td>
              <td style="padding: 8px 0; font-weight: 600;">${crash.function_name}</td>
            </tr>` : ''}
            ${crash.url ? `
            <tr>
              <td style="padding: 8px 0; color: #737373;">URL</td>
              <td style="padding: 8px 0; word-break: break-all;">${crash.url}</td>
            </tr>` : ''}
          </table>
          
          <div style="margin-top: 16px; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #991b1b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Error Message</p>
            <p style="margin: 0; color: #dc2626; font-family: monospace; font-size: 13px; word-break: break-all;">${crash.error_message || 'No message'}</p>
          </div>

          ${crash.error_stack ? `
          <div style="margin-top: 12px; padding: 16px; background: #1c1917; border-radius: 12px; overflow-x: auto;">
            <p style="margin: 0 0 8px; font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Stack Trace</p>
            <pre style="margin: 0; color: #d6d3d1; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${crash.error_stack.substring(0, 1000)}</pre>
          </div>` : ''}

          <div style="margin-top: 20px; text-align: center;">
            <a href="https://www.Crochet Wali.live/sadmin/crash-logs" 
               style="display: inline-block; background: #991b1b; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px;">
              View in Dashboard →
            </a>
          </div>
        </div>
        
        <p style="text-align: center; color: #a8a29e; font-size: 11px; margin-top: 16px;">
          Crochet Wali — Automated Crash Alert System
        </p>
      </div>
    `;

    // Send via Resend API
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Crash Alert <onboarding@resend.dev>",
        to: CRASH_ALERT_EMAIL,
        subject: `🚨 Crash: ${crash.source} — ${(crash.error_message || 'Unknown error').substring(0, 60)}`,
        html: emailHtml
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend API Error:", errText);
      throw new Error(`Email send failed: ${emailRes.statusText}`);
    }

    const emailResult = await emailRes.json();
    console.log(`✅ Crash alert email sent to ${CRASH_ALERT_EMAIL}`, emailResult);

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error(JSON.stringify({
      function: 'send-crash-alert',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
