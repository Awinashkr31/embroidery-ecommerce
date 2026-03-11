-- Force Reset Admin Password
-- Useful when email recovery fails.

-- 1. Ensure pgcrypto extension is available for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Generate a secure random password and update the admin user
WITH new_credentials AS (
    SELECT encode(gen_random_bytes(16), 'base64') AS new_password
),
updated_user AS (
    UPDATE auth.users
    SET encrypted_password = crypt((SELECT new_password FROM new_credentials), gen_salt('bf')),
        email_confirmed_at = now(),
        updated_at = now()
    WHERE email = 'awinashkr31@gmail.com'
    RETURNING email, updated_at
)
-- 3. Output the generated password and verify the update
SELECT u.email, u.updated_at, c.new_password AS generated_password
FROM updated_user u, new_credentials c;
