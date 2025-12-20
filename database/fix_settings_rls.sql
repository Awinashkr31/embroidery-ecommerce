-- Enable RLS
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (for frontend display)
CREATE POLICY "Public can view settings" ON website_settings FOR SELECT USING (true);

-- Allow admins to update settings (Mocked for now as 'true' but restricted by app logic ideally)
-- In production, this should check key-auth or similar, but for this dev setup:
CREATE POLICY "Anyone can update settings" ON website_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings update" ON website_settings FOR UPDATE USING (true);

-- Insert default settings if not exists
INSERT INTO website_settings (setting_key, setting_value, description)
VALUES 
('storeName', '"Enbroidery"', 'Name of the store'),
('storeDescription', '"Handcrafted embroidery and mehndi art"', 'Short description'),
('contactEmail', '"contact@enbroidery.com"', 'Public contact email'),
('contactPhone', '"9876543210"', 'Public phone number'),
('address', '"123 Art Street, Creative City"', 'Physical address')
ON CONFLICT (setting_key) DO NOTHING;
