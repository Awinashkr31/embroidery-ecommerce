-- Force Reset Admin Password
-- Useful when email recovery fails.

-- 1. Ensure pgcrypto extension is available for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Update the password for the admin user
-- REPLACE 'NewStrongPassword123!' with your desired password
UPDATE auth.users
SET encrypted_password = crypt('NewStrongPassword123!', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'awinashkr31@gmail.com';

-- 3. Verify the update
SELECT email, updated_at FROM auth.users WHERE email = 'awinashkr31@gmail.com';
