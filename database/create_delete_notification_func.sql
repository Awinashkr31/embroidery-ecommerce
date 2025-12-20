-- Function to securely delete a notification with DEBUG info
CREATE OR REPLACE FUNCTION delete_notification(notification_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_email TEXT;
  stored_user_email TEXT;
BEGIN
  -- Get email from the current authenticated user's JWT
  current_user_email := auth.jwt() ->> 'email';
  
  -- Get the email stored on the notification
  SELECT user_email INTO stored_user_email FROM notifications WHERE id = notification_id;
  
  IF NOT FOUND THEN
     -- Notification doesn't exist at all
     RETURN FALSE;
  END IF;

  -- Check match with detailed debug error if fails
  IF lower(trim(stored_user_email)) != lower(trim(current_user_email)) THEN
     RAISE EXCEPTION 'Access Denied: Notification belongs to "%", but you are "%"', stored_user_email, current_user_email;
  END IF;

  -- Attempt delete
  DELETE FROM notifications WHERE id = notification_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
