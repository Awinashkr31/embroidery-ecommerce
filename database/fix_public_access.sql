-- FIX PUBLIC ACCESS (Run this to fix "Images not showing")

-- 1. WEBSITE SETTINGS (Allow Public Read)
-- Ensure 'anon' (public) has permission to convert rows (Table Access)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.website_settings TO anon, authenticated;

-- Enable RLS
ALTER TABLE IF EXISTS public.website_settings ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to ensure clean state
DROP POLICY IF EXISTS "Public Read Settings" ON public.website_settings;

CREATE POLICY "Public Read Settings"
ON public.website_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. STORAGE (Allow Public View of Images)
-- This ensures the images themselves are visible to visitors.
DROP POLICY IF EXISTS "Public Read Images" ON storage.objects;

CREATE POLICY "Public Read Images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'images' );
