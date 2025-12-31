import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Testing connection...");
    const { data, error, count } = await supabase
        .from('website_settings')
        .select('*', { count: 'exact' });
    
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success! Count:", count);
        console.log("Data:", data);
    }
}

test();
