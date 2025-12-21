-- Enable RLS just in case
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create custom requests" ON custom_requests;
DROP POLICY IF EXISTS "Anyone can view custom requests" ON custom_requests;
DROP POLICY IF EXISTS "Anyone can update custom requests" ON custom_requests;
DROP POLICY IF EXISTS "Anyone can delete custom requests" ON custom_requests;

-- Create full access policy (since this is a simple app using mock admin)
CREATE POLICY "Enable full access for all users" ON custom_requests FOR ALL USING (true) WITH CHECK (true);

-- Insert a sample request if table is empty
INSERT INTO custom_requests (name, email, phone, description, budget, status)
SELECT 'Test User', 'test@example.com', '1234567890', 'I want a custom embroidery of a sunflower on a denim jacket.', '2500', 'new'
WHERE NOT EXISTS (SELECT 1 FROM custom_requests LIMIT 1);
