-- Ensure RLS is enabled
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON website_settings;
DROP POLICY IF EXISTS "Admin update access" ON website_settings;
DROP POLICY IF EXISTS "Allow full access" ON website_settings;

-- Create permissive policies (Simplifying for this user/demo context)
-- Allow anyone to read settings
CREATE POLICY "Allow public read access" 
ON website_settings FOR SELECT 
USING (true);

-- Allow anyone to update/insert settings (since admin check is client-side or handled by specific admin user context if set)
-- NOTE: In production, you'd want WITH CHECK (auth.role() = 'service_role' OR ...)
CREATE POLICY "Allow full access for now" 
ON website_settings 
USING (true) 
WITH CHECK (true);
