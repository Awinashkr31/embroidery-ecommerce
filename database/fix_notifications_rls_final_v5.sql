-- Final V5 RLS Fix - Renaming Policies to Ensure Fresh Application
-- Addressing persistent re-evaluation warnings by using fresh policy names and strict subqueries.

-- ==============================================================================
-- 1. NOTIFICATIONS
-- ==============================================================================

-- Drop ALL old variations
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "View own notifications" ON notifications;

-- Create NEW named policies (V5) to ensure clean creation
CREATE POLICY "view_own_notifications_v5"
ON notifications
FOR SELECT
TO authenticated
USING (
  -- Strict subquery wrapper
  user_email = (select auth.jwt() ->> 'email')
);

CREATE POLICY "delete_own_notifications_v5"
ON notifications
FOR DELETE
TO authenticated
USING (
  -- Strict subquery wrapper
  user_email = (select auth.jwt() ->> 'email')
);

-- Optimization for INSERT (if needed)
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON notifications;
CREATE POLICY "insert_own_notifications_v5"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.role()) = 'authenticated'
);

-- ==============================================================================
-- 2. MEHNDI_BOOKINGS
-- ==============================================================================

DROP POLICY IF EXISTS "Consolidated bookings view" ON mehndi_bookings;
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "view_bookings_consolidated_v5"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Strict IN clause optimization
  (select auth.jwt() ->> 'email') IN (email, 'admin@enbroidery.com')
);

-- ==============================================================================
-- 3. BOOKINGS (Ghost table)
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated bookings view" ON bookings;
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        
        EXECUTE '
            CREATE POLICY "view_bookings_consolidated_v5"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                -- V5 Logic: user_id OR Admin email
                -- Mixed types logic handled by separate OR branches, but wrapped strictly.
                (
                   user_id = (select auth.uid())
                )
                OR 
                (
                   (select auth.jwt() ->> ''email'') = ''admin@enbroidery.com''
                )
            );
        ';
    END IF;
END
$$;

-- ==============================================================================
-- 4. REVIEWS
-- ==============================================================================
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
CREATE POLICY "insert_reviews_v5"
ON reviews
FOR INSERT
TO authenticated
WITH CHECK (
   (select auth.role()) = 'authenticated'
);
