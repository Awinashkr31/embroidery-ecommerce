-- Allow users to delete their own notifications based on email matching
CREATE POLICY "Users can delete own notifications" ON notifications
FOR DELETE USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
