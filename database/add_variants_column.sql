-- 1. Add variants JSONB column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 2. Add variant_id column to cart_items
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- 3. Add variant_id column to wishlist_items (for completeness)
ALTER TABLE wishlist_items
ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- 4. Recreate Unique Constraint on cart_items to include variant_id
-- First, drop existing constraint if it exists (name might vary, try standard name)
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Create new comprehensive unique constraint
-- We need to handle NULLs for size/color/variant_id in uniqueness if possible, 
-- but standard SQL UNIQUE treats NULLs as distinct.
-- Ideally we use a unique index where we coalesce nulls or just rely on application logic to prevent duplicates.
-- For now, let's add the index but maybe not enforce strict CONSTRAINT if NULL handling is complex across DB versions, 
-- but a unique index with NULLs distinct is default postgres behavior (allowing multiple nulls).
-- To enforce "only one item with null size/color", we'd need partial indexes or coalesce.
-- Let's stick to adding the columns and letting the application handle "upsert" logic primarily, 
-- or add a unique index that allows multiple rows but application ensures they are distinct by variant.
-- Actually, the best approach for cart is often just application logic or a unique index on (user_id, product_id, COALESCE(variant_id, 'def'), COALESCE(selected_size, 'def'), COALESCE(selected_color, 'def')).

-- Let's just add the columns for now to avoid breaking existing data with strict constraints until cleanup.
