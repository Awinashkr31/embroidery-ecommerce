-- Add 'fabric' column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric TEXT;
