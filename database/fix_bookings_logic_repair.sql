-- Fix for: Table public.bookings Has RLS performance warning
-- Correction: My previous script (V5) had a logical flaw mixing email and UID comparisons for this table.
-- This script applies the correct, strict optimization.

-- 1. Correcting 'bookings' policy (Targeting the error)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated bookings view" ON bookings;
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        
        EXECUTE '
            CREATE POLICY "Consolidated bookings view"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- STRICT OPTIMIZATION:
                -- 1. User Access: Compare user_id to auth.uid() wrapped in select
                (
                   user_id = (select auth.uid())
                )
                OR 
                -- 2. Admin Access: Compare email constant wrapped in select
                (
                   (select auth.jwt() ->> ''email'') = ''admin@enbroidery.com''
                )
            );
        ';
    END IF;
END
$$;

-- 2. Double checking 'mehndi_bookings' (Just to be safe and consistent)
-- If the V5 IN-clause optimization worked, we keep it. 
-- If the user reported mehndi_bookings issue again, we'd revert to this OR logic with strict wrapping.
-- Currently, user only reported public.bookings in the last message.
