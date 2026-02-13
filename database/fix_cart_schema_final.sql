-- 1. Ensure user_id is TEXT (to support Firebase UIDs)
-- If it was accidentally changed to UUID or you want to be sure, this ensures it's TEXT.
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cart_items' 
        AND column_name = 'user_id' 
        AND data_type = 'uuid'
    ) THEN 
        ALTER TABLE cart_items ALTER COLUMN user_id TYPE text USING user_id::text;
    END IF; 
END $$;

-- 2. Handle RLS (Row Level Security)
-- Since Firebase users authenticate via Client but Supabase sees them as 'anon', standard RLS won't work easily.
-- For now, we will ALLOW public access to cart_items so Firebase users can save their carts.

-- Option A: Disable RLS completely (Simplest for now)
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- If you prefer Option B (Keep RLS but allow Anon), uncomment below:
-- ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public access to cart_items" ON cart_items;
-- CREATE POLICY "Public access to cart_items" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- 3. Verify
SELECT * FROM cart_items LIMIT 5;
