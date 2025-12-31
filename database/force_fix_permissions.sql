-- FORCE FIX RLS for Website Settings & Images
-- This script drops ALL restriction policies and resets them to PUBLIC READ.

-- 1. SETTINGS TABLE
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public Read ALL" ON public.website_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.website_settings;
DROP POLICY IF EXISTS "Allow Admin Access" ON public.website_settings;

-- Grant usage (just in case)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.website_settings TO postgres; 
GRANT ALL ON TABLE public.website_settings TO service_role;
GRANT SELECT ON TABLE public.website_settings TO anon, authenticated;

-- Create SIMPLE Public Read Policy
CREATE POLICY "Public Read Settings_Final"
ON public.website_settings
FOR SELECT
TO public
USING (true);

-- Create Admin Update Policy (using email check or service role)
-- For now, allow authenticated to update (since Admin is the only auth user)
CREATE POLICY "Admin Update Settings_Final"
ON public.website_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create Admin Insert Policy
CREATE POLICY "Admin Insert Settings_Final"
ON public.website_settings
FOR INSERT
TO authenticated
WITH CHECK (true);


-- 2. STORAGE BUCKET (Images)
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop all object policies
DROP POLICY IF EXISTS "Public Read Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

-- Re-create Public Read
CREATE POLICY "Public Read Images_Final"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'images' );

-- Re-create Auth Upload (Admin)
CREATE POLICY "Auth Insert Images_Final"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Re-create Auth Update/Delete
CREATE POLICY "Auth Manage Images_Final"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'images' );
