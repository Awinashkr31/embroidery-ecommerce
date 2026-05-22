-- Migration script for adding detailed address fields to the addresses table

ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS house_no VARCHAR(100),
ADD COLUMN IF NOT EXISTS area VARCHAR(255),
ADD COLUMN IF NOT EXISTS landmark VARCHAR(255),
ADD COLUMN IF NOT EXISTS address_type VARCHAR(20) DEFAULT 'Home';

