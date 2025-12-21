-- FINAL COMPREHENSIVE FIX
-- Run this in Supabase SQL Editor

-- 1. FIX STORAGE PERMISSIONS (Firebase Auth workaround)
-- Since you use Firebase for Auth, Supabase sees users as 'anon'. 
-- We must allow 'public' role to upload to the 'images' bucket.
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Updates" ON storage.objects;

-- Allow everyone (public) to View, Upload, and Update in 'images' bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'images' );
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT TO public WITH CHECK ( bucket_id = 'images' );
CREATE POLICY "Public Updates" ON storage.objects FOR UPDATE TO public USING ( bucket_id = 'images' );


-- 2. FIX ORDERS TABLE
-- Add 'user_email' if it doesn't exist, to match Profile.jsx's expectation OR we can standardize on 'customer_email'.
-- Let's enable Profile.jsx to work by ensuring 'user_email' exists or copying 'customer_email' data if needed.
-- Make sure the column exists:
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_email TEXT;
-- Optional: If you use 'customer_email' mostly, sync it:
UPDATE orders SET user_email = customer_email WHERE user_email IS NULL;


-- 3. FIX REVIEWS TABLE
-- Add 'user_id' so we can fetch user reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id TEXT;  -- Using TEXT assuming Firebase UID is string
