CREATE OR REPLACE FUNCTION "public"."place_order"("order_data" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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
    user_id,
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
    (order_data->>'user_id')::UUID,
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
