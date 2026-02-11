import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'awinashkr31@gmail.com';
const password = 'Plmzaq@123'; // Password from user screenshot

async function testLogin() {
    console.log(`Testing login for ${email} with password: ${password}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("❌ Login Failed:", error.message);
        if (error.message.includes("Email not confirmed")) {
             console.log("✅ User EXISTS but is not confirmed.");
             console.log("➡️ ACTION REQUIRED: Run confirm_email.sql");
        } else if (error.message.includes("Invalid login credentials")) {
             console.log("⚠️  Invalid credentials. Either user does not exist, or password is wrong.");
        }
    } else {
        console.log("✅ Login Success!");
        console.log("User ID:", data.user.id);
        console.log("Session Access Token:", data.session.access_token.substring(0, 20) + "...");
    }
}

testLogin();
