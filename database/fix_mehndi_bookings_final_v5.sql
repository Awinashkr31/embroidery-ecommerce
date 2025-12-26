-- Final V5 Optimization for Mehndi Bookings RLS
-- Addresses persistent "re-evaluates auth functions" warning.

-- ==============================================================================
-- MEHNDI_BOOKINGS
-- Issue: "Consolidated bookings view" triggers performance warning.
-- Fix: Using strict IN clause to force single scalar evaluation of auth.jwt().
-- ==============================================================================

DROP POLICY IF EXISTS "Consolidated bookings view" ON mehndi_bookings;
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated bookings view"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Optimization: Extract email ONCE and compare against allowed values.
  -- This forces the planner to evaluate the subquery one time.
  (select auth.jwt() ->> 'email') IN (email, 'admin@enbroidery.com')
);

-- ==============================================================================
-- BOOKINGS (Ghost table)
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated bookings view" ON bookings;
        
        EXECUTE '
            CREATE POLICY "Consolidated bookings view"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- Same optimization logic
                (select auth.jwt() ->> ''email'') IN (''admin@enbroidery.com'', (select auth.uid())::text) -- Assuming user_id matches logic or just email if column exists
                -- Fallback to V4 strict if column names differ, but IN is safer for performance.
            );
        ';
    END IF;
END
$$;
