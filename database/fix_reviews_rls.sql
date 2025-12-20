-- Drop the restrictive policy
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;

-- Create a permissive policy for viewing reviews (so admin can see 'pending' ones)
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

-- Insert sample reviews (ensure product IDs exist or use a subquery/generic fallback if possible, 
-- but since we can't know UUIDs for sure, we'll try to select from products table)

DO $$
DECLARE
    prod_id UUID;
BEGIN
    -- Get a product ID (limit 1)
    SELECT id INTO prod_id FROM products LIMIT 1;

    IF prod_id IS NOT NULL THEN
        INSERT INTO reviews (product_id, user_name, rating, comment, status)
        VALUES 
        (prod_id, 'Sarah J.', 5, 'Absolutely beautiful embroidery! exceeded my expectations.', 'approved'),
        (prod_id, 'Mike R.', 4, 'Great quality but shipping took a bit longer than expected.', 'pending'),
        (prod_id, 'Emily W.', 5, 'The details are amazing. Will definitely buy again.', 'pending');
    END IF;
END $$;
