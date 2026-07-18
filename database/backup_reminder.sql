-- ============================================================================
-- 💾 DATABASE BACKUP REMINDER
-- Sends a weekly reminder to check that Supabase backups are running.
-- Inserts into crash_logs with source='system', which triggers email alert.
--
-- PREREQUISITES:
-- 1. Enable pg_cron extension: Supabase Dashboard → Extensions → pg_cron → Enable
-- 2. Run crash_logs_table.sql first (if not already done)
-- 3. Run crash_alert_webhook.sql first (for email alerts)
--
-- Supabase Backup Info:
--   Free plan  → Weekly backups (automatic)
--   Pro plan   → Daily backups + Point-in-Time Recovery (PITR)
--   Check: Supabase Dashboard → Settings → Database → Backups
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================================
-- Weekly backup reminder — Every Sunday at 3 AM IST (9:30 PM Saturday UTC)
-- ============================================================================
SELECT cron.schedule(
    'weekly-backup-reminder',
    '30 21 * * 6',           -- 9:30 PM UTC Saturday = 3:00 AM IST Sunday
    $$
    INSERT INTO crash_logs (
        error_message,
        source,
        function_name,
        extra_context
    ) VALUES (
        '💾 Weekly Backup Check Reminder: Verify that Supabase automatic backups are running. Check Dashboard → Settings → Database → Backups.',
        'system',
        'backup-reminder',
        '{"type": "reminder", "action": "Check Supabase Dashboard → Settings → Database → Backups"}'::jsonb
    );
    $$
);

-- ============================================================================
-- To check scheduled jobs:
--   SELECT * FROM cron.job;
--
-- To unschedule:
--   SELECT cron.unschedule('weekly-backup-reminder');
-- ============================================================================
