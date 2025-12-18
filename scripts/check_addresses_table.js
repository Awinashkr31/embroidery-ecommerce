
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

let supabaseUrl, supabaseAnonKey;

try {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = value.trim();
            if (key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = value.trim();
        }
    }
} catch (e) {
    console.error('Error reading .env file:', e);
    process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
    console.log('Checking addresses table...');
    const { data, error } = await supabase.from('addresses').select('*').limit(1);
    
    if (error) {
        console.error('Error accessing addresses table:', error.message);
        if (error.code === '42P01') {
             console.log('Table "addresses" likely does not exist.');
        }
    } else {
        console.log('Table "addresses" exists. Data check:', data);
    }
}

checkTable();
