-- Fix Storage Permissions for 'images' bucket

-- 1. Ensure the bucket exists with higher limits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin Upload" ON storage.objects;

-- Drop policies we are about to create to ensure idempotency
DROP POLICY IF EXISTS "Public Read Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

-- 3. Create Permissive Policies (for Dev/Firebase Auth compatibility)

-- Allow Public Read
CREATE POLICY "Public Read Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow Public Insert (Auth + Anon for Dev Bypass)
CREATE POLICY "Public Insert Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Allow Public Update
CREATE POLICY "Public Update Images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );

-- Allow Public Delete
CREATE POLICY "Public Delete Images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );
