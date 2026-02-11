-- Add shipping details to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS waybill_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS courier_partner VARCHAR(100) DEFAULT 'Delhivery',
ADD COLUMN IF NOT EXISTS shipping_metadata JSONB;

-- Index for searching by waybill
CREATE INDEX IF NOT EXISTS idx_orders_waybill_id ON orders(waybill_id);
