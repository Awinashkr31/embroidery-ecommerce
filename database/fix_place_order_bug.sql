-- Function to place an order securely
-- This function takes the full order object, inserts it, and returns the result.
-- It handles the JSONB fields correctly.

CREATE OR REPLACE FUNCTION place_order(order_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with creator privileges (needed if RLS is strict)
AS $$
DECLARE
  new_order_id UUID;
  result_order JSONB;
BEGIN
  -- Insert the order
  INSERT INTO orders (
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    items,
    subtotal,
    shipping_cost,
    discount,
    total,
    status,
    payment_method,
    payment_status,
    payment_id, -- Handle optional field
    coupon_code,
    created_at
  ) VALUES (
    (order_data->>'customer_name')::VARCHAR,
    (order_data->>'customer_email')::VARCHAR,
    (order_data->>'customer_phone')::VARCHAR,
    (order_data->'shipping_address'),
    (order_data->'items'),
    (order_data->>'subtotal')::DECIMAL,
    (order_data->>'shipping_cost')::DECIMAL,
    (order_data->>'discount')::DECIMAL,
    (order_data->>'total')::DECIMAL,
    COALESCE((order_data->>'status')::order_status, 'pending'),
    (order_data->>'payment_method')::VARCHAR,
    COALESCE((order_data->>'payment_status')::VARCHAR, 'pending'),
    (order_data->>'payment_id')::VARCHAR,
    (order_data->>'coupon_code')::VARCHAR,
    NOW()
  )
  RETURNING id INTO new_order_id;

  -- Verify and return the full order as JSON
  -- We select back the data to ensure we have the generated ID and timestamps
  SELECT to_jsonb(o) INTO result_order
  FROM orders o
  WHERE id = new_order_id;

  RETURN result_order;
EXCEPTION WHEN OTHERS THEN
  -- Raise exception to be caught by client
  RAISE EXCEPTION 'Failed to place order: %', SQLERRM;
END;
$$;
