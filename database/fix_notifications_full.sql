-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;

-- 1. SELECT: Users can see notifications where user_email matches their auth email
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING (
  lower(user_email) = lower(auth.jwt() ->> 'email')
);

-- 2. DELETE: Users can delete notifications where user_email matches their auth email
CREATE POLICY "Users can delete own notifications" ON notifications
FOR DELETE USING (
  lower(user_email) = lower(auth.jwt() ->> 'email')
);

-- 3. INSERT: Allow authenticated users to insert (required for some flows if not strictly system-only)
-- Ideally this should be restricted, but for debugging/admin panel usage:
CREATE POLICY "Authenticated users can insert notifications" ON notifications
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
