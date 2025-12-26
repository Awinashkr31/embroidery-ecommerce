-- RLS Optimization & Conflict Resolution V2
-- Addressing persistent performance warnings and new product policy conflicts.

-- ==============================================================================
-- 1. PRODUCTS
-- Issue: Multiple permissive policies ("Anyone can view all products" vs "Public can view active products")
-- Fix: Consolidate into a single Public View policy.
-- ==============================================================================

DROP POLICY IF EXISTS "Anyone can view all products" ON products;
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Public view" ON products;

-- Create single consolidated policy
CREATE POLICY "Public view"
ON products
FOR SELECT
TO public
USING (true);


-- ==============================================================================
-- 2. NOTIFICATIONS
-- Issue: "re-evaluates auth.<function>()". Warning persists.
-- Fix: Using strict scalar subquery wrapper for auth.jwt() extraction.
-- ==============================================================================

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
-- Dropping other variations just in case
DROP POLICY IF EXISTS "users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "View own notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  -- Strict subquery wrapper for the entire expression
  user_email = (select (auth.jwt() ->> 'email'))
);

CREATE POLICY "Users can delete own notifications"
ON notifications
FOR DELETE
TO authenticated
USING (
  -- Strict subquery wrapper for the entire expression
  user_email = (select (auth.jwt() ->> 'email'))
);


-- ==============================================================================
-- 3. MEHNDI_BOOKINGS / BOOKINGS
-- Issue: "re-evaluates auth.<function>()".
-- Fix: Ensure admin check is also wrapped in subquery.
-- ==============================================================================

-- A. mehndi_bookings
DROP POLICY IF EXISTS "Consolidated view policy" ON mehndi_bookings;
DROP POLICY IF EXISTS "Consolidated bookings view" ON mehndi_bookings;
DROP POLICY IF EXISTS "Anyone can view bookings" ON mehndi_bookings;

CREATE POLICY "Consolidated bookings view"
ON mehndi_bookings
FOR SELECT
TO authenticated
USING (
  -- Admin Check: Wrapped in select
  ( (select (auth.jwt() ->> 'email')) = 'admin@enbroidery.com' )
  OR
  -- User Check: Wrapped in select
  ( email = (select (auth.jwt() ->> 'email')) )
);

-- B. bookings (Ghost table check)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        DROP POLICY IF EXISTS "Consolidated view policy" ON bookings;
        DROP POLICY IF EXISTS "Consolidated bookings view" ON bookings;
        
        EXECUTE '
            CREATE POLICY "Consolidated bookings view"
            ON bookings
            FOR SELECT
            TO authenticated
            USING (
                ( (select (auth.jwt() ->> ''email'')) = ''admin@enbroidery.com'' ) 
                OR 
                ( user_id = (select auth.uid()) )
            );
        ';
    END IF;
END
$$;


-- ==============================================================================
-- 4. REVIEWS
-- Issue: "Users can insert their own reviews" re-evaluates.
-- Fix: Wrap auth.role() check.
-- ==============================================================================
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;

CREATE POLICY "Users can insert their own reviews"
ON reviews
FOR INSERT
TO authenticated
WITH CHECK (
   (select auth.role()) = 'authenticated'
);
