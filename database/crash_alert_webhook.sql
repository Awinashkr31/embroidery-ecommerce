-- ============================================================================
-- 🚨 CRASH ALERT WEBHOOK
-- Triggers the send-crash-alert Edge Function whenever a new crash is logged.
--
-- SETUP STEPS:
-- 1. First, deploy the edge function: supabase functions deploy send-crash-alert
-- 2. Then run this SQL in Supabase SQL Editor
-- 3. Set secrets in Supabase Dashboard → Edge Functions → Secrets:
--    - RESEND_API_KEY (from https://resend.com - free 100 emails/day)
--    - CRASH_ALERT_EMAIL = awinashkr31@gmail.com
--    - WEBHOOK_SECRET = (generate a random string)
--
-- ALTERNATIVE: Use Supabase Dashboard UI
-- If you prefer the UI method instead of SQL:
--   1. Go to Database → Webhooks → Create Webhook
--   2. Table: crash_logs
--   3. Events: INSERT
--   4. Type: Supabase Edge Function
--   5. Function: send-crash-alert
--   6. Add header: x-webhook-secret = your WEBHOOK_SECRET value
-- ============================================================================

-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: Supabase Database Webhooks are best configured via the Dashboard UI.
-- The Dashboard method is recommended because it handles auth tokens automatically.
--
-- However, if you want to do it via SQL using pg_net, here's how:
--
-- This creates a trigger that calls the Edge Function on every crash_logs INSERT.
-- Replace YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY with actual values.

CREATE OR REPLACE FUNCTION notify_crash_alert()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
  supabase_url TEXT;
  service_key TEXT;
BEGIN
  -- Build webhook payload matching Supabase webhook format
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'crash_logs',
    'record', row_to_json(NEW)::jsonb
  );

  -- Get Supabase URL from settings (available in Supabase environment)
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key := current_setting('app.settings.service_role_key', true);
  
  -- If settings aren't available, use hardcoded URL (replace with your actual URL)
  IF supabase_url IS NULL THEN
    -- ⚠️ REPLACE THIS with your actual Supabase project URL
    supabase_url := 'https://YOUR_PROJECT_ID.supabase.co';
  END IF;

  -- Call the edge function via pg_net (async HTTP request)
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-crash-alert',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_key, '')
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on crash_logs table
DROP TRIGGER IF EXISTS trigger_crash_alert ON crash_logs;
CREATE TRIGGER trigger_crash_alert
  AFTER INSERT ON crash_logs
  FOR EACH ROW
  EXECUTE FUNCTION notify_crash_alert();

-- ============================================================================
-- ⚡ RECOMMENDED: Use Supabase Dashboard instead of SQL
-- 
-- Go to: Database → Webhooks → Create Webhook
-- This is easier and handles authentication automatically.
-- ============================================================================
