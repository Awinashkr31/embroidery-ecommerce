-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  package_id TEXT,
  package_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (even unauthenticated) to insert bookings (public booking form)
CREATE POLICY "Allow public insert access" ON bookings
  FOR INSERT WITH CHECK (true);

-- Policy: Allow users to view their own bookings (if they are logged in)
CREATE POLICY "Allow users to view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Allow admins to view all bookings
-- Assuming admin has a specific role or we check against an admin table/metadata
-- For now, let's assume we use the 'service_role' or a custom admin check.
-- Since we lack a robust role system in this snippet, we'll create a policy that might need adjustment
-- based on the existing admin setup. 
-- Looking at previous history, there is an 'admin_users' table.
CREATE POLICY "Allow admins to view all bookings" ON bookings
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Allow admins to update bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );
