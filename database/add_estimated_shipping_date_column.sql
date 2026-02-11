-- Add estimated_shipping_date column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS estimated_shipping_date TIMESTAMPTZ;

-- Comment on column
COMMENT ON COLUMN public.orders.estimated_shipping_date IS 'Expected date when the order will be shipped';
