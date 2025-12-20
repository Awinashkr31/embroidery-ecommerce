-- Function to handle atomic order placement and stock decrement
CREATE OR REPLACE FUNCTION place_order(
  order_data JSONB
) RETURNS JSONB AS $$
DECLARE
  new_order JSONB;
  item JSONB;
  product_record RECORD;
  item_qty INTEGER;
  item_id UUID;
BEGIN
  -- 1. Validate Stock for ALL items before inserting order
  FOR item IN SELECT * FROM jsonb_array_elements(order_data->'items')
  LOOP
    item_id := (item->>'id')::UUID;
    item_qty := (item->>'quantity')::INTEGER;

    -- Lock product row to prevent race conditions
    SELECT * INTO product_record FROM products WHERE id = item_id FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', item_id;
    END IF;

    IF product_record.stock_quantity < item_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product: % (Available: %, Requested: %)', product_record.name, product_record.stock_quantity, item_qty;
    END IF;

    -- Decrement stock 
    -- Note: We rely on the frontend/context to map stock > 0 to "In Stock"
    UPDATE products 
    SET stock_quantity = stock_quantity - item_qty
    WHERE id = item_id;
    
  END LOOP;

  -- 2. Insert Order
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
    payment_status
  ) VALUES (
    order_data->>'customer_name',
    order_data->>'customer_email',
    order_data->>'customer_phone',
    (order_data->>'shipping_address')::JSONB,
    order_data->'items',
    (order_data->>'subtotal')::DECIMAL,
    (order_data->>'shipping_cost')::DECIMAL,
    (order_data->>'discount')::DECIMAL,
    (order_data->>'total')::DECIMAL,
    (order_data->>'status')::order_status,
    order_data->>'payment_method',
    order_data->>'payment_status'
  ) RETURNING to_jsonb(orders.*) INTO new_order;

  -- 3. Create Notification for User
  INSERT INTO notifications (
    user_email,
    title,
    message,
    type,
    is_read,
    created_at
  ) VALUES (
    order_data->>'customer_email',
    'Order Confirmed',
    'Your order #' || (new_order->>'id') || ' has been placed successfully.',
    'success',
    false,
    NOW()
  );

  RETURN new_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
