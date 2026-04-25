import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Make sure to add FIREBASE_SERVICE_ACCOUNT_JSON to your Supabase Edge Function Secrets
// representing the service account json for your Firebase project.
// You also need SUPABASE_URL and SUPABASE_ANON_KEY (usually injected by default).
// And maybe a custom SUPABASE_SERVICE_ROLE_KEY if needed to bypass RLS.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { type, table, record, old_record } = payload;
    
    console.log(`Received webhook for table ${table} with operation ${type}`);

    // Determine the message title and body based on the table
    let title = "Admin Alert";
    let body = "A new event occurred.";

    if (table === "orders" && type === "INSERT") {
      title = "New Order Received!";
      body = `Order #${record.id?.slice(0,8) || 'unknown'} has been placed for ₹${record.total_amount || 0}.`;
    } else if (table === "users" && type === "INSERT") {
      title = "New User Registration";
      body = `A new user just registered.`;
    } else if (table === "custom_requests" && type === "INSERT") {
      title = "New Custom Request";
      body = `A new custom embroidery request was submitted.`;
    } else if (table === "messages" && type === "INSERT") {
       title = "New Support Message";
       body = `You have received a new support message.`;
    } else if (table === "bookings" && type === "INSERT") {
       title = "New Booking";
       body = `A new booking has been made.`;
    } else {
      // Ignore other events
      return new Response(JSON.stringify({ message: "Ignored event type." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    // Need service role key to bypass RLS and get all admin tokens
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase configuration.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all admin FCM tokens
    const { data: tokens, error } = await supabase
      .from("admin_fcm_tokens")
      .select("token");

    if (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }

    if (!tokens || tokens.length === 0) {
      console.log("No admin tokens found. Exiting.");
      return new Response(JSON.stringify({ message: "No admin tokens to notify." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const fcmTokens = tokens.map((t: any) => t.token);

    // -------------------------------------------------------------
    // Send FCM Notification
    // Here we use the HTTP v1 API. We need an OAuth2 access token.
    // In a real edge function, you'd use a service account JWT to get the access token.
    // Deno doesn't natively support firebase-admin easily without polyfills, 
    // but you can fetch to the FCM API if you generate a JWT.
    // For simplicity, we assume you will set up FIREBASE_SERVER_KEY (if using Legacy API)
    // or handle the JWT exchange for HTTP v1 API.
    // Since Google is deprecating Legacy API, HTTP v1 is recommended.
    // -------------------------------------------------------------

    const serviceAccountBase64 = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_BASE64");
    
    if (!serviceAccountBase64) {
         console.warn("FIREBASE_SERVICE_ACCOUNT_BASE64 not set. Can't send push. Setup instructions needed.");
         return new Response(JSON.stringify({ message: "FCM not configured." }), {
             headers: { ...corsHeaders, "Content-Type": "application/json" },
             status: 200,
         });
    }

    const admin = await import("npm:firebase-admin");
    if (!admin.default.apps.length) {
        admin.default.initializeApp({
            credential: admin.default.credential.cert(JSON.parse(atob(serviceAccountBase64)))
        });
    }

    const response = await admin.default.messaging().sendEachForMulticast({
        tokens: fcmTokens,
        notification: { title, body }
    });

    console.log(`Successfully sent ${response.successCount} messages; failed ${response.failureCount}.`);

    return new Response(JSON.stringify({ message: "Notification process executed.", sentTo: response.successCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
