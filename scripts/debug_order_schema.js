
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

async function inspectSchema() {
  console.log("Inspecting 'orders' table schema...");
  
  // 1. Check if table exists and list columns
  const { data: columns, error: schemaError } = await supabase
    .rpc('get_table_info', { table_name: 'orders' }); // Assuming get_table_info exists or trying direct select if not

  // If RPC fails, try standard query (though accessing information_schema might be restricted)
  // Let's try fetching a single row without any filters to see structure
  const { data: sampleOrder, error: sampleError } = await supabase
    .from('orders')
    .select('*')
    .limit(1);

  if (sampleError) {
      console.error("Error fetching sample order:", sampleError);
  } else {
      console.log("Sample Order Keys:", sampleOrder && sampleOrder.length > 0 ? Object.keys(sampleOrder[0]) : "No orders found");
  }

  // 2. Fetch specific order (simulate error condition)
  // We need a valid ID to test. Let's list all IDs first.
  const { data: allOrders, error: listError } = await supabase
    .from('orders')
    .select('id, customer_email')
    .limit(5);

  if (listError) {
      console.error("Error listing orders:", listError);
  } else {
      console.log("Found Orders:", allOrders);
      if (allOrders.length > 0) {
          const testId = allOrders[0].id;
          console.log(`Testing fetch for ID: ${testId}`);
          
          const { data: detailedOrder, error: detailError } = await supabase
            .from('orders')
            .select('*, shipping_address, items, order_status_logs(*)')
            .eq('id', testId)
             //.order('timestamp', { foreignTable: 'order_status_logs', ascending: false }) // This might fail if relationship is wrong
            .single();

          if (detailError) {
              console.error("Detail Fetch Error:", detailError);
          } else {
              console.log("Detail Fetch Success!");
          }
      }
  }
}

inspectSchema();
