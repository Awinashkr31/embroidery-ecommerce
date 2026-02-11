
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testQuery() {
  // 1. Get an ID first
  const { data: orders } = await supabase.from('orders').select('id').limit(1);
  if (!orders || orders.length === 0) {
      console.log("No orders found.");
      return;
  }
  const id = orders[0].id;
  console.log(`Testing with ID: ${id}`);

  // 2. Test EXACT query from OrderDetails.jsx
  console.log("--- Testing query WITH order_status_logs ---");
  const { data: withLogs, error: errorWithLogs } = await supabase
    .from('orders')
    .select('*, shipping_address, items, order_status_logs(*)')
    .eq('id', id)
    .single();

  if (errorWithLogs) {
      console.error("!!! Query WITH logs CLASH !!! Error:", errorWithLogs);
  } else {
      console.log("+++ Query WITH logs PASSED +++");
      console.log("Logs count:", withLogs.order_status_logs ? withLogs.order_status_logs.length : 'N/A');
  }

  // 3. Test query WITHOUT order_status_logs
  console.log("--- Testing query WITHOUT order_status_logs ---");
  const { data: withoutLogs, error: errorWithoutLogs } = await supabase
    .from('orders')
    .select('*, shipping_address, items')
    .eq('id', id)
    .single();

  if (errorWithoutLogs) {
      console.error("!!! Query WITHOUT logs CLASH !!! Error:", errorWithoutLogs);
  } else {
      console.log("+++ Query WITHOUT logs PASSED +++");
  }

  // 4. Test order_status_logs DIRECTLY
  console.log("--- Testing order_status_logs DIRECTLY ---");
  const { data: logs, error: logsError } = await supabase
    .from('order_status_logs')
    .select('*')
    .limit(1);

  if (logsError) {
      console.error("!!! Logs Table Error:", logsError);
  } else {
      console.log("+++ Logs Table Access PASSED +++");
  }
}

testQuery();
