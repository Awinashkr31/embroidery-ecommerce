
-- Add user_email to track who wrote the review
ALTER TABLE reviews ADD COLUMN user_email TEXT;

-- Add unique constraint to ensure one review per product per user
ALTER TABLE reviews ADD CONSTRAINT unique_user_product_review UNIQUE (user_email, product_id);

-- Update RLS to allow users to insert their own reviews
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.email() = user_email);

-- Allow users to view their own reviews (already covered by "Anyone can view reviews" but good to be explicit for updates if needed)
-- We might want to allow users to UPDATE their own review too?
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.email() = user_email);
