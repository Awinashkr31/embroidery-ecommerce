import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load .env relative to this file
// If running from root, it's just .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const delhiveryToken = process.env.VITE_DELHIVERY_TOKEN;

console.log("Supabase URL:", supabaseUrl);
// console.log("Key:", supabaseKey); // Don't log key
console.log("Delhivery Token (Local Env):", delhiveryToken ? "Present" : "Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEdgeFunction() {
  console.log("Invoking edge function 'delhivery-rate-check'...");

  const payload = {
    weight: 500,
    origin_pin: "110001",
    dest_pin: "560001", // Bangalore
    mode: "S",
    payment_type: "prepaid",
    amount: 1000
  };

  try {
    const { data, error } = await supabase.functions.invoke('delhivery-rate-check', {
      body: payload
    });

    console.log("Response Data:", data);
    
    if (error) {
      console.error("Response Error Object:", error);
      if (error && error.context && typeof error.context.json === 'function') {
           try {
               const errorBody = await error.context.json();
               console.error("Error Body (JSON):", errorBody);
           } catch (e) {
               console.error("Could not parse error body JSON", e);
               const textBody = await error.context.text();
                console.error("Error Body (Text):", textBody);
           }
      } else {
        console.log("No error context/json method available.");
      }
    } else {
        console.log("Success!");
    }

  } catch (err) {
    console.error("Unexpected Exception:", err);
  }
}

testEdgeFunction();
