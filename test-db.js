import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Test direct connection (which might fail due to Antivirus)
const directUrl = process.env.VITE_SUPABASE_URL;
const directSupabase = createClient(directUrl, supabaseAnonKey);

// Test Vite proxy connection
const proxyUrl = 'http://localhost:5173/supabase-api';
const proxySupabase = createClient(proxyUrl, supabaseAnonKey);

async function testConnection(name, client) {
    console.log(`\nTesting ${name} connection to: ${client.supabaseUrl}`);
    try {
        const { data, error } = await client.from('products').select('*').limit(1);
        
        if (error) {
            console.error(`❌ ${name} connection failed with error:`);
            console.error(error);
        } else {
            console.log(`✅ ${name} connection successful!`);
            console.log(`Retrieved ${data.length} records.`);
        }
    } catch (err) {
        console.error(`❌ ${name} connection threw an exception:`);
        console.error(err.message);
    }
}

async function runTests() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass Node SSL to match Proxy
    
    await testConnection('Proxy (Vite)', proxySupabase);
    await testConnection('Direct', directSupabase);
}

runTests();
