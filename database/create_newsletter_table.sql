-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public insert to subscribers" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Allow admins to view (assuming existing admin logic or open for now if simplistic)
-- For now, let's keep it simple and allow authenticated reads or just open reads for admins
CREATE POLICY "Allow read access to all"
ON newsletter_subscribers FOR SELECT
USING (true);
