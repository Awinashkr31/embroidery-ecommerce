-- Fix for: Table public.bookings has multiple permissive policies for role anon
-- Issue: Having separate policies for "Admins" and "Users" forces Postgres to check both separate logic paths.
-- Fix: Combine them into a single policy using OR logic.

-- 1. For table: mehndi_bookings (Primary target in schema)
DROP POLICY IF EXISTS "Allow admins to view all bookings" ON mehndi_bookings;
DROP POLICY IF EXISTS "Allow users to view own bookings" ON mehndi_bookings;

CREATE POLICY "Consolidated view policy"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- 1. Admin Access (Check against known admin email or role)
  ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com')
  OR
  -- 2. User Access (Own bookings by email)
  ((select auth.jwt() ->> 'email') = email)
);


-- 2. For table: bookings (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Allow admins to view all bookings" ON bookings;
        DROP POLICY IF EXISTS "Allow users to view own bookings" ON bookings;
        
        -- Creating combined policy
        EXECUTE '
            CREATE POLICY "Consolidated view policy"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                ((select auth.jwt() ->> ''email'') = ''admin@enbroidery.com'') 
                OR 
                (auth.uid()::text = user_id::text) -- Assuming user_id exists in bookings
            );
        ';
    END IF;
END
$$;
