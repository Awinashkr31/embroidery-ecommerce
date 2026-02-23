-- =============================================================================
-- Enbroidery — Critical Security & Schema Fixes
-- Run this ONCE in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Safe to re-run: uses IF EXISTS / IF NOT EXISTS throughout
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. PRODUCTS: Lock down write access to admin
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can create products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

CREATE POLICY "Admins can create products" ON products
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com')
  WITH CHECK ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

-- ─────────────────────────────────────────────
-- 2. ORDERS: Lock down write access
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON orders;

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

-- ─────────────────────────────────────────────
-- 3. REVIEWS: Lock down update/delete to admin
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin can update reviews" ON reviews;
DROP POLICY IF EXISTS "Admin can delete reviews" ON reviews;

CREATE POLICY "Admins can update reviews" ON reviews
  FOR UPDATE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

CREATE POLICY "Admins can delete reviews" ON reviews
  FOR DELETE TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

-- ─────────────────────────────────────────────
-- 4. ORDER STATUS LOGS: Allow admin inserts
--    (was service_role only — admin panel couldn't write logs)
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Enable insert for service_role only" ON order_status_logs;
DROP POLICY IF EXISTS "Admins can insert status logs" ON order_status_logs;

CREATE POLICY "Admins can insert status logs" ON order_status_logs
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.jwt() ->> 'email') = 'admin@enbroidery.com');

-- ─────────────────────────────────────────────
-- 5. SCHEMA: Add user_id to orders
--    Required for order history by user & future RLS
-- ─────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ─────────────────────────────────────────────
-- 6. SCHEMA: Add user_id + order_id to reviews
--    Code already inserts user_id — DB was missing the column
-- ─────────────────────────────────────────────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);

-- ─────────────────────────────────────────────
-- 7. SCHEMA: Add fabric column to products
--    App code references this column; base schema was missing it
-- ─────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric TEXT;

-- ─────────────────────────────────────────────
-- 8. ENUM: Add missing order status values
--    Prevents runtime errors when app sets these statuses
-- ─────────────────────────────────────────────
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'confirmed';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'cancellation_requested';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'return_requested';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded';

-- ─────────────────────────────────────────────
-- 9. PERFORMANCE: Covering index for approved reviews
--    Product pages fetch reviews by product_id WHERE status='approved'
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved
  ON reviews(product_id) WHERE status = 'approved';

-- ─────────────────────────────────────────────
-- 10. PERFORMANCE: Unique constraint for cart variants
--     Prevents duplicate cart rows for the same product+variant combination
-- ─────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_variant_unique
  ON cart_items(
    user_id,
    product_id,
    COALESCE(variant_id, ''),
    COALESCE(selected_size, ''),
    COALESCE(selected_color, '')
  );

-- =============================================================================
-- Done. Verify with:
--   SELECT policyname, cmd FROM pg_policies WHERE tablename IN ('products','orders','reviews','order_status_logs');
-- =============================================================================
