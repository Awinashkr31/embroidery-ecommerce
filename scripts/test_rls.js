
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPublicAccess() {
    console.log('Testing public access to products table...');
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`Successfully fetched ${data.length} products.`);
        if (data.length > 0) {
            console.log('Sample product:', data[0]);
        }
    }
}

testPublicAccess();
