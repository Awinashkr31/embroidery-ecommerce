-- Comprehensive Fix for RLS Performance & Conflicts
-- Target Tables: public.notifications, public.mehndi_bookings

-- ==========================================
-- 1. NOTIFICATIONS TABLE
-- Issues: Re-evaluation of auth functions in SELECT and DELETE policies.
-- ==========================================

-- Drop excessive/unoptimized policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON notifications; -- Recreating to be safe/consistent

-- Optimization: Use (select auth.jwt() ->> 'email') to ensure single execution.
-- Assuming 'user_email' is the column name based on frontend usage.

CREATE POLICY "Users can view own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  user_email = (select auth.jwt() ->> 'email')
);

CREATE POLICY "Users can delete own notifications"
ON notifications
FOR DELETE
TO authenticated
USING (
  user_email = (select auth.jwt() ->> 'email')
);

-- Re-apply insert policy (optimized)
CREATE POLICY "Allow authenticated to insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);


-- ==========================================
-- 2. MEHNDI_BOOKINGS TABLE
-- Issues: Multiple permissive policies (Conflict) + Re-evaluation (Performance).
-- ==========================================

-- Drop the redundant/conflicting "Anyone" policy
DROP POLICY IF EXISTS "Anyone can view bookings" ON mehndi_bookings;

-- Drop and Recreate the Consolidated Policy with Strict Optimization
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated view policy"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Strict Boolean Logic with Subqueries
  (
    -- User Check
    email = (select auth.jwt() ->> 'email')
  )
  OR
  (
    -- Admin Check
    'admin@enbroidery.com' = (select auth.jwt() ->> 'email')
  )
);
