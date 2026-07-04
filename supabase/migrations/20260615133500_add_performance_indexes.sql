-- ==========================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- ==========================================
-- This migration adds compound indexes to speed up the primary 
-- product fetch queries that filter by `active` and sort by `created_at`.

-- 1. Optimize `active` + `created_at` sorting for the main product feed
CREATE INDEX IF NOT EXISTS "idx_products_active_created_at" ON "public"."products" USING btree ("active", "created_at" DESC);

-- 2. Optimize `active` + `featured` for the featured products slice (optional but good for homepage)
CREATE INDEX IF NOT EXISTS "idx_products_active_featured" ON "public"."products" USING btree ("active", "featured");

-- 3. Optimize fetching by homepage_tags (since it's an array, GIN index is best if queried by @>, but for simplicity we can use standard indexes if exact match or rely on sequential scan on small active subsets. Since it's JSONB, GIN is optimal)
CREATE INDEX IF NOT EXISTS "idx_products_homepage_tags" ON "public"."products" USING gin ("homepage_tags");
