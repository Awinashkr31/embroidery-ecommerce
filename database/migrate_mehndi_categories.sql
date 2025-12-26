-- Migration script to rename Mehndi categories
-- Run this in the Supabase SQL Editor

UPDATE gallery 
SET category = 'Bridal Mehndi' 
WHERE category = 'Bridal';

UPDATE gallery 
SET category = 'Party Mehndi' 
WHERE category = 'Party';

UPDATE gallery 
SET category = 'Casual Mehndi' 
WHERE category = 'Casual';
