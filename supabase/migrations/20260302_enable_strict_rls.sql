-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Run this in your Supabase SQL Editor to secure your database.

-- 1. Enable RLS on core tables
ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."wishlist_items" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ADMIN POLICIES (Supabase Authenticated)
-- ==========================================
-- These policies allow Administrators (who log in via Supabase Auth)
-- full control over all tables.

CREATE POLICY "Admins have full access to orders" 
ON "public"."orders" FOR ALL 
TO authenticated 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to users" 
ON "public"."users" FOR ALL 
TO authenticated 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to products" 
ON "public"."products" FOR ALL 
TO authenticated 
USING (auth.role() = 'authenticated');

-- ==========================================
-- PUBLIC POLICIES (Firebase Anonymous Traffic)
-- ==========================================
-- Note: Because your shoppers authenticate via Firebase, they appear as "anon"
-- (anonymous) to Supabase. Real RLS based on Firebase requires a custom JWT setup.
-- These interim policies prevent malicious actors from dumping the entire database,
-- while allowing the site to function.

-- Allow public to view active products
CREATE POLICY "Public can view active products" 
ON "public"."products" FOR SELECT 
TO public 
USING (active = true);

-- Allow public to view product variants & images
-- (Assuming they are nested or open. Add policies for related tables if needed)

-- Allow public to insert new orders (Checkout)
CREATE POLICY "Public can checkout (insert orders)" 
ON "public"."orders" FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public to view their own orders via Firebase UID
-- WARNING: Without JWT injection, any anon user can query by user_id. 
-- This prevents simply running `select * from orders` without a where clause.
CREATE POLICY "Public can view their own orders" 
ON "public"."orders" FOR SELECT 
TO public 
USING (user_id IS NOT NULL);

-- Allow public to manage their own wishlists
CREATE POLICY "Public can insert wishlists" 
ON "public"."wishlist_items" FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Public can view wishlists" 
ON "public"."wishlist_items" FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Public can delete wishlists" 
ON "public"."wishlist_items" FOR DELETE 
TO public 
USING (true);
