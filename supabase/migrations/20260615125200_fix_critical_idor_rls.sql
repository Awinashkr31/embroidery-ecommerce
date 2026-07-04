-- ==========================================
-- FIX CRITICAL IDOR / BROKEN ACCESS CONTROL
-- ==========================================
-- This migration drops the overly permissive `USING (true)` and `TO public` 
-- RLS policies that were exposing customer data to unauthenticated API calls.
-- Strict `auth.uid() = user_id` policies already exist in the schema but were bypassed.

-- 1. Secure 'orders' table
DROP POLICY IF EXISTS "Anyone can create orders" ON "public"."orders";
DROP POLICY IF EXISTS "Anyone can view all orders" ON "public"."orders";
DROP POLICY IF EXISTS "Public can checkout (insert orders)" ON "public"."orders";
DROP POLICY IF EXISTS "Public can view their own orders" ON "public"."orders";

-- 2. Secure 'users' table
DROP POLICY IF EXISTS "Public insert access" ON "public"."users";
DROP POLICY IF EXISTS "Public select access" ON "public"."users";
DROP POLICY IF EXISTS "Public update access" ON "public"."users";
DROP POLICY IF EXISTS "Anyone can view users" ON "public"."users";
DROP POLICY IF EXISTS "Anyone can update users" ON "public"."users";

-- 3. Secure 'addresses' table
DROP POLICY IF EXISTS "Allow app access to addresses" ON "public"."addresses";

-- 4. Secure 'cart_items' table
DROP POLICY IF EXISTS "Allow app access to cart" ON "public"."cart_items";

-- 5. Secure 'wishlist_items' table
DROP POLICY IF EXISTS "Allow app access to wishlist" ON "public"."wishlist_items";
DROP POLICY IF EXISTS "Public can insert wishlists" ON "public"."wishlist_items";
DROP POLICY IF EXISTS "Public can view wishlists" ON "public"."wishlist_items";
DROP POLICY IF EXISTS "Public can delete wishlists" ON "public"."wishlist_items";

-- 6. Secure 'mehndi_bookings' and 'custom_requests' (optional but recommended)
DROP POLICY IF EXISTS "Anyone can delete bookings" ON "public"."mehndi_bookings";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."bookings";
DROP POLICY IF EXISTS "Anyone can create bookings" ON "public"."mehndi_bookings";
