-- Enable RLS on table if not already enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to delete their own notifications based on email matching
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;

CREATE POLICY "Users can delete own notifications" ON notifications
FOR DELETE USING (
  lower(user_email) = (SELECT lower(email) FROM auth.users WHERE id = auth.uid())
);
