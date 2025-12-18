
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

async function createAdmin() {
    console.log('--- Creating Admin User ---');
    
    const email = "admin@enbroidery.com";
    const password = "admin123password";

    // 1. Try to Login first (in case already exists)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (!loginError && loginData.session) {
        console.log("✅ Admin user already exists. Ready to use.");
        console.log("Email:", email);
        console.log("Password:", password);
        return;
    }

    // 2. Sign Up if not exists
    console.log("Creating new admin user...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: 'Admin User',
                role: 'admin' // Custom meta data, though not enforced by RLS yet in this codebase
            }
        }
    });

    if (signUpError) {
        console.error("❌ Failed to create admin:", signUpError.message);
    } else {
        console.log("✅ Admin user created successfully!");
        console.log("Email:", email);
        console.log("Password:", password);
        if (!signUpData.session) {
            console.log("⚠️ Verify email might be required depending on Supabase settings. check console/inbox.");
        }
    }
}

createAdmin();
