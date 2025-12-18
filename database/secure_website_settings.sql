-- Secure the website_settings table by enabling Row Level Security (RLS).

-- 1. Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Note: Currently, this locks the table so no one can access it (which is safe if unused).
-- If you plan to use this table to store site config (logo, title, etc.), uncomment the policies below:

-- Allow everyone (public) to READ settings
-- CREATE POLICY "Enable read access for all users" ON public.website_settings
-- FOR SELECT TO public USING (true);

-- Allow only authenticated users (or admins) to UPDATE settings
-- CREATE POLICY "Enable update for authenticated users only" ON public.website_settings
-- FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
