
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  // Fetch one row
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  if (data && data.length > 0) {
    const order = data[0];
    console.log("Keys:", Object.keys(order));
    console.log("Type of 'items':", typeof order.items, Array.isArray(order.items) ? "(Array)" : "");
    console.log("Content of 'items':", JSON.stringify(order.items).slice(0, 100));
    console.log("Type of 'shipping_address':", typeof order.shipping_address);
  } else {
    console.log("No orders found to inspect.");
  }
}

inspect();
