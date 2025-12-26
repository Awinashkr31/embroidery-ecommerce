-- Add 'images' column to store multiple image URLs
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Migrate existing single images to the new array column
-- This ensures old images are not lost and appear in the new multi-image compatible view
UPDATE gallery 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL;
