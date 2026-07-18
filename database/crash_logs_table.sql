-- ============================================================================
-- 🔍 CRASH LOGS TABLE
-- Stores crash/error reports from frontend (React) and Edge Functions
-- Run this in Supabase SQL Editor: supabase.com → SQL Editor → New Query
-- ============================================================================

CREATE TABLE IF NOT EXISTS crash_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Error details
    error_message TEXT,
    error_stack TEXT,
    component_stack TEXT,
    
    -- Source info (where the error happened)
    source TEXT NOT NULL DEFAULT 'frontend',  -- 'frontend', 'edge-function', 'api'
    function_name TEXT,                       -- Edge function name (e.g. 'process-checkout')
    
    -- Context
    url TEXT,                                 -- Page URL or request URL
    user_agent TEXT,                          -- Browser info
    request_method TEXT,                      -- HTTP method (for edge functions)
    extra_context JSONB DEFAULT '{}',         -- Any additional data
    
    -- Tracking
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    notes TEXT                                -- Admin notes about the resolution
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE crash_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from frontend (both anon and authenticated users)
CREATE POLICY "Allow crash logging"
    ON crash_logs FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow service_role full access (for edge functions and admin dashboard)
CREATE POLICY "Service role full access on crash_logs"
    ON crash_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Authenticated users can read crash_logs"
    ON crash_logs FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update (for admin dashboard resolution)
CREATE POLICY "Authenticated users can update crash_logs"
    ON crash_logs FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- Indexes for fast lookups
-- ============================================================================

CREATE INDEX idx_crash_logs_source ON crash_logs(source);
CREATE INDEX idx_crash_logs_created_at ON crash_logs(created_at DESC);
CREATE INDEX idx_crash_logs_resolved ON crash_logs(resolved) WHERE resolved = false;
CREATE INDEX idx_crash_logs_function_name ON crash_logs(function_name) WHERE function_name IS NOT NULL;

-- ============================================================================
-- Auto-cleanup: Delete crash logs older than 90 days (optional)
-- Run this as a Supabase CRON job if you want automatic cleanup
-- ============================================================================
-- SELECT cron.schedule(
--     'cleanup-old-crash-logs',
--     '0 3 * * 0',  -- Every Sunday at 3 AM
--     $$DELETE FROM crash_logs WHERE created_at < NOW() - INTERVAL '90 days' AND resolved = true$$
-- );
