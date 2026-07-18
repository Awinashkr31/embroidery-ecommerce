-- ============================================================================
-- ⏰ UPTIME MONITOR
-- Checks if the ML API is healthy every 5 minutes.
-- If unhealthy, logs to crash_logs (which triggers email alert).
--
-- PREREQUISITES:
-- 1. Enable pg_cron extension: Supabase Dashboard → Extensions → pg_cron → Enable
-- 2. Enable pg_net extension: Supabase Dashboard → Extensions → pg_net → Enable
-- 3. Replace YOUR_ML_API_URL with your actual FastAPI URL
--    Example: https://your-api.railway.app/health
--
-- Run this SQL in Supabase SQL Editor after enabling extensions.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================================
-- Uptime check results table
-- ============================================================================
CREATE TABLE IF NOT EXISTS uptime_checks (
    id BIGSERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL,
    status TEXT NOT NULL,         -- 'healthy', 'unhealthy', 'timeout', 'error'
    response_time_ms INTEGER,
    response_body JSONB,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE uptime_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on uptime_checks"
    ON uptime_checks FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can read uptime_checks"
    ON uptime_checks FOR SELECT
    TO authenticated
    USING (true);

-- Index
CREATE INDEX idx_uptime_checks_checked_at ON uptime_checks(checked_at DESC);

-- ============================================================================
-- Health check function
-- ⚠️ REPLACE 'https://YOUR_ML_API_URL/health' with your actual API URL
-- ============================================================================
CREATE OR REPLACE FUNCTION check_api_health()
RETURNS void AS $$
DECLARE
  start_time TIMESTAMPTZ;
  response_status INT;
BEGIN
  start_time := clock_timestamp();

  -- Make HTTP request to health endpoint
  -- ⚠️ REPLACE THIS URL with your actual FastAPI health endpoint
  PERFORM net.http_post(
    url := 'https://YOUR_ML_API_URL/health',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );

  -- Log successful check
  INSERT INTO uptime_checks (endpoint, status, response_time_ms)
  VALUES (
    'ml-api',
    'healthy',
    EXTRACT(MILLISECONDS FROM clock_timestamp() - start_time)::INT
  );

EXCEPTION WHEN OTHERS THEN
  -- Log failure
  INSERT INTO uptime_checks (endpoint, status, response_time_ms)
  VALUES ('ml-api', 'error', EXTRACT(MILLISECONDS FROM clock_timestamp() - start_time)::INT);

  -- Also log to crash_logs for email alert
  INSERT INTO crash_logs (error_message, source, function_name, extra_context)
  VALUES (
    '🔴 ML API Health Check Failed: ' || SQLERRM,
    'system',
    'uptime-monitor',
    jsonb_build_object('endpoint', 'ml-api', 'error', SQLERRM)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Schedule: Run every 5 minutes
-- ============================================================================
SELECT cron.schedule(
    'uptime-check-ml-api',
    '*/5 * * * *',           -- Every 5 minutes
    $$ SELECT check_api_health(); $$
);

-- ============================================================================
-- Cleanup: Delete uptime checks older than 7 days (runs daily at 4 AM)
-- ============================================================================
SELECT cron.schedule(
    'cleanup-uptime-checks',
    '0 4 * * *',             -- Daily at 4 AM UTC
    $$ DELETE FROM uptime_checks WHERE checked_at < NOW() - INTERVAL '7 days'; $$
);

-- ============================================================================
-- To check scheduled jobs:
--   SELECT * FROM cron.job;
--
-- To unschedule:
--   SELECT cron.unschedule('uptime-check-ml-api');
--   SELECT cron.unschedule('cleanup-uptime-checks');
-- ============================================================================
