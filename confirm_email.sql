-- Confirm the admin email manually
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'awinashkr31@gmail.com';
