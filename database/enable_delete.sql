-- Enable DELETE for public users (Required for replacing profile photos)
-- Since Firebase Auth users appear as 'public' to Supabase

CREATE POLICY "Public Deletes"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'images' );
