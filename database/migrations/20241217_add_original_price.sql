-- Add original_price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
