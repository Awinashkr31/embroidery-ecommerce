-- Final RLS Cleanup - Robust Version
-- Handles "Policy already exists" errors by strictly dropping before creating.

-- ==============================================================================
-- 1. NOTIFICATIONS
-- ==============================================================================

-- Drop ALL possible variations of the policy names (Case Sensitive)
DROP POLICY IF EXISTS "Public select access" ON notifications;
DROP POLICY IF EXISTS "Public insert access" ON notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;
DROP POLICY IF EXISTS "authenticated users can insert notifications" ON notifications; -- lowercase variation
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON notifications;

-- Clean slate creation
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT TO authenticated
USING ( user_email = (select auth.jwt() ->> 'email') );

CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE TO authenticated
USING ( user_email = (select auth.jwt() ->> 'email') );

CREATE POLICY "Allow authenticated to insert notifications"
ON notifications FOR INSERT TO authenticated
WITH CHECK ( (select auth.role()) = 'authenticated' );


-- ==============================================================================
-- 2. REVIEWS
-- ==============================================================================

DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "users can insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can create reviews" ON reviews;

CREATE POLICY "Users can insert their own reviews"
ON reviews FOR INSERT TO authenticated
WITH CHECK ( (select auth.role()) = 'authenticated' );


-- ==============================================================================
-- 3. MEHNDI_BOOKINGS
-- ==============================================================================

DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;
DROP POLICY IF EXISTS "Allow admins to view all bookings" ON mehndi_bookings;
DROP POLICY IF EXISTS "Allow users to view own bookings" ON mehndi_bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON mehndi_bookings;
DROP POLICY IF EXISTS "Consolidated bookings view" ON mehndi_bookings; -- Dropping the name used in previous attempt

CREATE POLICY "Consolidated bookings view"
ON mehndi_bookings FOR SELECT TO authenticated
USING (
  ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com')
  OR
  (email = (select auth.jwt() ->> 'email'))
);

-- 4. BOOKINGS (Ghost table cleanup)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        DROP POLICY IF EXISTS "Consolidated bookings view" ON bookings;
        
        EXECUTE '
            CREATE POLICY "Consolidated bookings view"
            ON bookings FOR SELECT TO authenticated
            USING (
                ((select auth.jwt() ->> ''email'') = ''admin@enbroidery.com'') 
                OR 
                (user_id::text = (select auth.uid())::text)
            );
        ';
    END IF;
END
$$;
