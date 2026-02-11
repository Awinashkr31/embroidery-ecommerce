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

const ADMIN_EMAIL = 'awinashkr31@gmail.com';
const TEMP_PASSWORD = 'TemporaryAdminPassword123!';

async function setupAdmin() {
    console.log(`Checking status for ${ADMIN_EMAIL}...`);

    // 1. Try to Sign In (to check if valid credentials, though we don't know real password)
    // We can't really do this without locking the account if we guess wrong too many times. 
    // Instead, let's try to Sign Up.
    
    console.log("Attempting to create admin user...");
    const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: TEMP_PASSWORD,
    });

    if (error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
            console.log("✅ User already exists.");
            console.log("Since you are getting 'Invalid login credentials', you likely have the wrong password.");
            console.log("Please use the 'Forgot Password' link on the login page, or use the Supabase Dashboard to reset it.");
        } else {
            console.error("❌ Failed to create user:", error.message);
        }
    } else {
        if (data.user && data.user.identities && data.user.identities.length === 0) {
             console.log("✅ User already exists (SignUp returned existing user with empty identities/or no error but no new user).");
             console.log("Please check your password.");
        } else {
            console.log("✅ Admin user created successfully!");
            console.log(`Email: ${ADMIN_EMAIL}`);
            console.log(`Password: ${TEMP_PASSWORD}`);
            console.log("⚠️  IMPORTANT: Please login and change this password immediately.");
            console.log("⚠️  NOTE: You may need to run 'confirm_email.sql' in Supabase SQL Editor if email confirmation is enabled.");
        }
    }
}

setupAdmin();
