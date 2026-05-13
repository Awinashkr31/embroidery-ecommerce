const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('orders').insert({
    id: crypto.randomUUID(),
    customer_name: "Test",
    customer_email: "test@test.com",
    customer_phone: "1234567890",
    shipping_address: {},
    items: [],
    subtotal: 0,
    shipping_cost: 0,
    cod_charge: 0,
    discount: 0,
    total: 0,
    status: 'pending',
    payment_method: 'cod'
  }).select();
  console.log(error || data);
}
run();
