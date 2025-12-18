
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
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminLogin() {
    console.log('--- Testing Admin Login ---');
    
    // Replace with a known test user credentials if possible, or try with a dummy
    // Since I don't know the admin email/pass, I can only verify if the AUTH service is reachable.
    // However, I can check if 'admin_users' table exists via a select (assuming I can read it if I'm anon? unlikely).
    
    // Better check: Try to sign in with a fake user and expect 'Invalid login credentials' 
    // rather than a network error or 500.
    
    const email = "admin@example.com";
    const password = "wrongpassword";

    console.log(`Attempting login for ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log("Login result:", error.message);
        if (error.message.includes('Invalid login credentials')) {
            console.log("✅ Auth service is reachable (received expected invalid creds error)");
        } else {
            console.error("❌ Unexpected error:", error);
        }
    } else {
        console.log("✅ Login successful (Unexpected for fake credentials)");
    }
}

testAdminLogin();
