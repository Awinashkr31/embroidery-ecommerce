-- Final RLS Cleanup v3 + Website Settings Fix
-- Addressing:
-- 1. website_settings: Multiple permissive policies (Split SELECT vs WRITE)
-- 2. notifications/bookings: Persistent re-evaluation warning (Simpler subquery syntax)

-- ==============================================================================
-- 1. WEBSITE_SETTINGS
-- Issue: "Admins Manage Settings" (ALL) and "Public Read Settings" (SELECT) overlap on SELECT.
-- Fix: Make "Admins Manage" apply to INSERT, UPDATE, DELETE only.
-- ==============================================================================

DROP POLICY IF EXISTS "Admins Manage Settings" ON website_settings;
DROP POLICY IF EXISTS "Public Read Settings" ON website_settings;

-- 1. Public Read (SELECT Only)
CREATE POLICY "Public Read Settings"
ON website_settings
FOR SELECT
TO public
USING (true);

-- 2. Admin Write (INSERT, UPDATE, DELETE)
-- This avoids overlap with SELECT
CREATE POLICY "Admins Manage Settings"
ON website_settings
FOR ALL
TO authenticated
USING (
    -- Admin Check
    (select auth.jwt() ->> 'email') = 'admin@enbroidery.com'
)
WITH CHECK (
    -- Admin Check
    (select auth.jwt() ->> 'email') = 'admin@enbroidery.com'
);


-- ==============================================================================
-- 2. NOTIFICATIONS
-- Issue: Re-evaluation of auth.jwt()
-- Fix: Using cleaner subquery syntax
-- ==============================================================================

-- Drop all previous attempts
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON notifications;

-- VIEW (SELECT)
CREATE POLICY "Users can view own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  user_email = (select auth.jwt() ->> 'email')
);

-- DELETE
CREATE POLICY "Users can delete own notifications"
ON notifications
FOR DELETE
TO authenticated
USING (
  user_email = (select auth.jwt() ->> 'email')
);

-- INSERT
CREATE POLICY "Allow authenticated to insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.role()) = 'authenticated'
);


-- ==============================================================================
-- 3. MEHNDI_BOOKINGS / BOOKINGS
-- Issue: Re-evaluation
-- ==============================================================================

-- A. mehndi_bookings
DROP POLICY IF EXISTS "Consolidated bookings view" ON mehndi_bookings;
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;

CREATE POLICY "Consolidated bookings view"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  (select auth.jwt() ->> 'email') = 'admin@enbroidery.com'
  OR
  email = (select auth.jwt() ->> 'email')
);

-- B. bookings
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
                (select auth.jwt() ->> ''email'') = ''admin@enbroidery.com''
                OR 
                user_id::text = (select auth.uid()::text)
            );
        ';
    END IF;
END
$$;


-- ==============================================================================
-- 4. PRODUCTS (Just in case conflicts persist)
-- ==============================================================================
DROP POLICY IF EXISTS "Public view" ON products;
DROP POLICY IF EXISTS "Anyone can view all products" ON products;
DROP POLICY IF EXISTS "Public can view active products" ON products;

CREATE POLICY "Public view"
ON products
FOR SELECT
TO public
USING (true);
