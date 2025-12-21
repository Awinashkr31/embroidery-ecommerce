-- Simply run these lines to enable the policies.
-- If the bucket 'images' doesn't exist, create it in the UI first (Storage > New Bucket > "images" > Public).

-- 1. Allow Public Viewing
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'images' );

-- 2. Allow Authenticated Users to Upload
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- 3. Allow Authenticated Users to Update
CREATE POLICY "Authenticated Updates"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );
