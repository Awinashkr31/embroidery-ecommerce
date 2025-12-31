-- CLEANUP WARNNINGS
-- The table 'public.website_settings' has RLS disabled (Public), but policies still exist, causing warnings.
-- We will DROP all policies on this table to make it clean.

DROP POLICY IF EXISTS "Public Read Settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public Read ALL" ON public.website_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.website_settings;
DROP POLICY IF EXISTS "Allow Admin Access" ON public.website_settings;
DROP POLICY IF EXISTS "Admins Manage Settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public Read Settings_Final" ON public.website_settings;
DROP POLICY IF EXISTS "Admin Update Settings_Final" ON public.website_settings;
DROP POLICY IF EXISTS "Admin Insert Settings_Final" ON public.website_settings;
