-- Add missing tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS current_status VARCHAR(50) DEFAULT 'Placed',
ADD COLUMN IF NOT EXISTS last_status_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS expected_delivery_date TIMESTAMPTZ;

-- Ensure courier_partner defaults to Delhivery (already in add_shipping_fields_to_orders.sql but good to enforce if needed)
-- ALTER TABLE orders ALTER COLUMN courier_partner SET DEFAULT 'Delhivery';

-- Create Order Status Logs table for timeline
CREATE TABLE IF NOT EXISTS order_status_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL, -- e.g., "In Transit", "Delivered"
    location VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;

-- Policies for order_status_logs
-- Public/Authenticated users can view logs for their own orders (conceptually, or public if order_id is known/linked? usually secured by order ownership)
-- For simplicity in this demo environment, allowing read access.
CREATE POLICY "Enable read access for all users" ON order_status_logs FOR SELECT USING (true);

-- Allow service_role (backend) to insert logs
CREATE POLICY "Enable insert for service_role only" ON order_status_logs FOR INSERT TO service_role WITH CHECK (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_logs_order_id ON order_status_logs(order_id);
