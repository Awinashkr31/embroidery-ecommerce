-- Add clothing_information column to products table to store flexible clothing details
-- This avoids creating many sparse columns for specific clothing attributes
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS clothing_information JSONB DEFAULT NULL;

-- Comment on column for clarity
COMMENT ON COLUMN products.clothing_information IS 'Stores clothing-specific details like gender, sizes (with stock), fit, fabric, pattern, etc. in JSONB format.';
