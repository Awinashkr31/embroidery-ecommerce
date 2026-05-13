const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.from('website_settings').select('*').in('setting_key', ['cod_status', 'chatbot_enabled']);
  console.log(JSON.stringify(data, null, 2));
}
run();
