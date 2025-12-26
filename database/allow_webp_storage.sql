-- Allow WebP and other image types in the 'images' bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
WHERE id = 'images';

-- Alternatively, to allow ALL file types, you can run:
-- UPDATE storage.buckets SET allowed_mime_types = NULL WHERE id = 'images';
