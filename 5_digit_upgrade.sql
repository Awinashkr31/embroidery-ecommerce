-- 1. Safely alter all referencing tables to prevent Foreign Key crashes
-- First, drop the foreign key constraint from order_status_logs
ALTER TABLE "public"."order_status_logs" DROP CONSTRAINT IF EXISTS "order_status_logs_order_id_fkey";
ALTER TABLE "public"."reviews" DROP CONSTRAINT IF EXISTS "reviews_order_id_fkey";

-- Change the related column to VARCHAR
ALTER TABLE "public"."order_status_logs" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "public"."reviews" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;

-- Now change the primary orders table
ALTER TABLE "public"."orders" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "public"."orders" ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT;

-- Finally, put the foreign key constraint back!
ALTER TABLE "public"."order_status_logs" 
  ADD CONSTRAINT "order_status_logs_order_id_fkey" 
  FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;

ALTER TABLE "public"."reviews" 
  ADD CONSTRAINT "reviews_order_id_fkey" 
  FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;

-- 2. Create a secure while-loop function to generate unique 5-digit numbers
CREATE OR REPLACE FUNCTION "public"."generate_5digit_id"() RETURNS VARCHAR AS $$
DECLARE
  new_id VARCHAR(5);
  is_unique bool;
BEGIN
  is_unique := false;
  WHILE NOT is_unique LOOP
    -- Generate a number between 00000 and 99999
    new_id := LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    -- Verify it does not already exist
    PERFORM 1 FROM orders WHERE id = new_id;
    IF NOT FOUND THEN
      is_unique := true;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Replace the existing place_order RPC to utilize the new unique generator!
CREATE OR REPLACE FUNCTION "public"."place_order"("order_data" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_order_id VARCHAR(5);
  result_order JSONB;
BEGIN
  -- Generate unique 5 digit id
  new_order_id := generate_5digit_id();

  -- Insert the order manually supplying the id
  INSERT INTO orders (
    id,
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
    payment_id,
    coupon_code,
    user_id,
    created_at
  ) VALUES (
    new_order_id,
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
  );

  -- Fetch the finalized object and return to Vite frontend
  SELECT to_jsonb(o) INTO result_order
  FROM orders o
  WHERE id = new_order_id;

  RETURN result_order;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Failed to place order: %', SQLERRM;
END;
$$;
