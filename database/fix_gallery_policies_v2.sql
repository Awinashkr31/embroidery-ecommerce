
-- 1. GALLERY TABLE POLICIES
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert gallery images" ON gallery;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON gallery;
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON gallery;

-- Create policies for Gallery Table
CREATE POLICY "Anyone can insert gallery images" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery images" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery images" ON gallery FOR DELETE USING (true);


-- 2. STORAGE BUCKET CONFIGURATION
-- Ensure 'images' bucket exists (idempotent)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;


-- 3. STORAGE OBJECT POLICIES
-- Drop existing policies to avoid conflicts (Fixes "policy already exists" error)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Create policies for Storage Objects ('images' bucket)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'images' );

CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public Update" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'images' );
