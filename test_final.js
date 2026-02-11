import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verifying deployed function 'delhivery-rate-check'...");
  const payload = {
    weight: 500,
    origin_pin: "110001",
    dest_pin: "560001",
    mode: "S",
    payment_type: "prepaid",
    amount: 1000
  };

  const { data, error } = await supabase.functions.invoke('delhivery-rate-check', {
    body: payload
  });

  if (error) {
    console.error("Verification Failed:", error);
    process.exit(1);
  }

  console.log("Verification Success! Data:", data);
}

verify();
