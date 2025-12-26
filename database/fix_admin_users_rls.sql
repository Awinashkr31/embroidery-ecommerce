-- Fix for: Table public.admin_users has RLS enabled, but no policies exist

-- Allow authenticated users to view admin users (needed for admin dashboard checks if implemented)
CREATE POLICY "Allow authenticated to view admin_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- Allow admins to update admin users (broad permission consistent with other tables in this project)
CREATE POLICY "Allow authenticated to update admin_users"
ON admin_users FOR UPDATE
TO authenticated
USING (true);

-- Allow admins to insert new admin users
CREATE POLICY "Allow authenticated to insert admin_users"
ON admin_users FOR INSERT
TO authenticated
WITH CHECK (true);
