-- Create Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL, -- Using email to link potential Guest users too if needed, or Auth users
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error', 'promo'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action_link VARCHAR(255) -- Optional URL to redirect content
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admin can do everything (assumes admin is handled via role or app logic, here simplistic public for now as per project pattern)
CREATE POLICY "Public insert access" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public update access" ON notifications FOR UPDATE USING (true);

-- Index for faster lookups
CREATE INDEX idx_notifications_email ON notifications(user_email);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
