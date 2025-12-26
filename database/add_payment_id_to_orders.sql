-- Add payment_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
