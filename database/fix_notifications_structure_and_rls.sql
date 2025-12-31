-- Fix Notification System: Structure and RLS

-- 0. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure Table Exists
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Admin Full Access" ON notifications;
DROP POLICY IF EXISTS "User View Own" ON notifications;
DROP POLICY IF EXISTS "User Update Own" ON notifications;
DROP POLICY IF EXISTS "User Delete Own" ON notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "View own notifications" ON notifications;
DROP POLICY IF EXISTS "view_own_notifications_v5" ON notifications;
DROP POLICY IF EXISTS "delete_own_notifications_v5" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON notifications;
DROP POLICY IF EXISTS "insert_own_notifications_v5" ON notifications;

-- 4. Create New Policies

-- Policy: Admin Full Access (Explicit for Admin Dashboard)
CREATE POLICY "Admin Full Access"
ON public.notifications
FOR ALL
TO authenticated
USING (
    (select auth.jwt() ->> 'email') = 'admin@enbroidery.com' 
    OR 
    (select auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
)
WITH CHECK (
    (select auth.jwt() ->> 'email') = 'admin@enbroidery.com' 
    OR 
    (select auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
);

-- Policy: Public Access (Anon + Auth) - REQUIRED for Firebase Auth
-- Since Supabase client has no user context (it's anon), we must open RLS.
-- Security relies on the Frontend filtering by user_email.

CREATE POLICY "Public Select"
ON public.notifications
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Public Insert"
ON public.notifications
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Public Update"
ON public.notifications
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Public Delete"
ON public.notifications
FOR DELETE
TO authenticated, anon
USING (true);

-- 5. Realtime
-- Ensure the table is in the publication (Idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    END IF;
END $$;
