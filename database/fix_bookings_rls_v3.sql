-- Fix for: Table public.bookings has a row level security policy ... that re-evaluates auth.<function>()
-- Issue: Persistence of performance warning suggests previous fix syntax wasn't sufficient.
-- Fix: Using strict scalar subqueries for all auth checks.

-- 1. Optimize 'mehndi_bookings'
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated view policy"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Strict scalar subquery optimization
  email = (select auth.jwt() ->> 'email')
  OR
  'admin@enbroidery.com' = (select auth.jwt() ->> 'email')
);

-- 2. Optimize 'bookings' (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        
        EXECUTE '
            CREATE POLICY "Consolidated view policy"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- Optimize: Compare column vs Scalar Subquery
                user_id::text = (select auth.uid()::text)
                OR
                ''admin@enbroidery.com'' = (select auth.jwt() ->> ''email'')
            );
        ';
    END IF;
END
$$;
