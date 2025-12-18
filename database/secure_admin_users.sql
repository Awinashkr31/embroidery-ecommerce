-- Secure the admin_users table by enabling Row Level Security (RLS).
-- This prevents anonymous access to the table.

-- 1. Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Note: By default, enabling RLS without adding any policies means NO ONE (except service_role) 
-- can access the table. Since this table does not appear to be used in your 
-- frontend code, this is the most secure setting.

-- If you intend to use this table later, you can add a policy like:
-- CREATE POLICY "Allow admins to read" ON public.admin_users
-- FOR SELECT TO authenticated USING (auth.uid() = id);
