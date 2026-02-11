-- Add shipping cost tracking columns to orders table

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS estimated_shipping_cost DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS final_shipping_cost DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS charged_weight DECIMAL(10, 2), -- In Grams
ADD COLUMN IF NOT EXISTS pricing_checked_at TIMESTAMP WITH TIME ZONE;

-- Add comments for clarity
COMMENT ON COLUMN public.orders.estimated_shipping_cost IS 'Shipping cost calculated via Delhivery Rate API before shipment';
COMMENT ON COLUMN public.orders.final_shipping_cost IS 'Actual shipping cost charged by Delhivery (to be reconciled later)';
COMMENT ON COLUMN public.orders.charged_weight IS 'Weight used for calculation in Grams';
