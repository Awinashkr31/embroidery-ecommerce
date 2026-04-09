import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log("Users in public.users:", data?.length);
  if (data?.length > 0) {
    console.log("Samples:", data.slice(0, 3));
  }
}
checkUsers();
