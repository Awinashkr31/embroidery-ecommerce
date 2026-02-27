import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log("Testing products fetch...");
  try {
     const { data, error } = await supabase.from('products').select('*').limit(1);
     if (error) {
         console.log("Products Error:", JSON.stringify(error, null, 2));
     } else {
         console.log("Products count fetched:", data?.length);
     }
  } catch (err) {
      console.log("Caught:", err);
  }
}

testFetch();
