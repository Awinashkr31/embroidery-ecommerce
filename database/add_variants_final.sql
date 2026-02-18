-- 1. Add variants support to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 2. Update cart_items to support variants
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS variant_id TEXT,
ADD COLUMN IF NOT EXISTS selected_size TEXT,
ADD COLUMN IF NOT EXISTS selected_color TEXT;

-- 3. Update wishlist_items to support variants
ALTER TABLE wishlist_items
ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- 4. Ensure RLS policies are updated (optional, usually covered by existing policies)
-- Just a comment: existing RLS on cart_items typically allows own rows, which covers new columns.

-- 5. Create index for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_variant_id ON wishlist_items(variant_id);
