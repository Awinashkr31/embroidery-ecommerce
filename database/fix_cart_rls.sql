-- 1. Clear existing policies FIRST (Must do this before altering column)
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
-- Also drop any potentially conflicting policies with different names if you suspect them
-- (e.g., from old migrations)

-- 2. Ensure user_id is UUID (Best Practice)
-- This block attempts to cast the column to UUID if it's not already.
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cart_items' 
        AND column_name = 'user_id' 
        AND data_type = 'character varying'
    ) THEN 
        ALTER TABLE cart_items ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    END IF; 
END $$;

-- 3. Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Clean Slate)
-- Using universal casting just in case the ALTER failed silently (though it shouldn't)
-- or if the user ran this on an already correct DB.

CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Verify
SELECT * FROM cart_items LIMIT 5;
