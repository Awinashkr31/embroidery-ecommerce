-- Add selected_size column to cart_items table
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS selected_size TEXT;

-- Update RLS if necessary (though existing ones should cover the new column implicitly)
-- Just ensuring the column is available for the anon/authenticated roles logic
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cart_items TO anon;
