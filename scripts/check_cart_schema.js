import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCartSchema() {
    console.log("Fetching cart_items schema info...");
    
    // We can't query information_schema easily via client, so we insert a dummy item and catch the error or inspect returned data
    // Or just try to select * limit 1 and print keys
    
    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching cart_items:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("--- COLUMNS FOUND ---");
        const item = data[0];
        Object.keys(item).forEach(key => {
            console.log(`${key}: ${typeof item[key]} (Value: ${item[key]})`);
        });
        console.log("--- END ---");
    } else {
        console.log("No items found in cart_items table. Cannot inspect structure from data.");
        // Try inserting a dummy item to see if it works? No, might mess up data.
    }
}

checkCartSchema();
