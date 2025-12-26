-- Fix for: Table public.bookings has a row level security policy ... that re-evaluates auth.<function>()
-- Issue: Performance warning persists. Trying strictest syntax form.
-- Fix: Using (select auth.uid()) and (select auth.jwt()) with casts applied strictly outside or in a standard way.

-- 1. Optimize 'mehndi_bookings'
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated view policy"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
    -- Admin Check
    (select auth.jwt() ->> 'email') = 'admin@enbroidery.com'
    OR
    -- User Check (Exact match on email for this table)
    email = (select auth.jwt() ->> 'email')
);

-- 2. Optimize 'bookings'
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        
        -- Creating policy with cleaner syntax
        -- Assuming user_id is compatible with auth.uid()
        EXECUTE '
            CREATE POLICY "Consolidated view policy"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- 1. Admin Access: Wrap completely in select
                (
                    (select auth.jwt() ->> ''email'') = ''admin@enbroidery.com''
                )
                OR 
                -- 2. User Access: Wrap auth.uid() in select
                (
                    -- Try strictly casting the column to text to match auth.uid() if needed
                    -- OR assuming types match.
                    -- Common pattern: user_id = (select auth.uid())
                    user_id::text = (select auth.uid())::text
                )
            );
        ';
    END IF;
END
$$;
