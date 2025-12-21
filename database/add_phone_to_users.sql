-- Add phone_number column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
