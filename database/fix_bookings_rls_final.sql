-- Fix for: Table public.bookings has a row level security policy ... that re-evaluates auth.<function>()
-- Issue: Previous fix missed wrapping auth.uid() in a subquery for the 'bookings' table fallback.
-- Fix: Ensure ALL calls to auth.uid() and auth.jwt() are wrapped in (select ...).

-- 1. For table: mehndi_bookings
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated view policy"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Admin Access
  ( (select auth.jwt() ->> 'email') = 'admin@enbroidery.com' )
  OR
  -- User Access (Own bookings)
  ( email = (select auth.jwt() ->> 'email') )
);


-- 2. For table: bookings (The one explicitly flagged by the error)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        
        -- Correcting the auth.uid() usage here:
        EXECUTE '
            CREATE POLICY "Consolidated view policy"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- Admin check
                ( (select auth.jwt() ->> ''email'') = ''admin@enbroidery.com'' ) 
                OR 
                -- User check: (select auth.uid()) optimization
                ( user_id::text = (select auth.uid()::text) )
            );
        ';
    END IF;
END
$$;
