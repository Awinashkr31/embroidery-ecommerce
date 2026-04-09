-- DROP the old function that accepts UUIDs to prevent overloading confusion
DROP FUNCTION IF EXISTS public.cancel_order(uuid, text);

-- Now Create/Replace the NEW function that accepts TEXT
CREATE OR REPLACE FUNCTION public.cancel_order(
  p_order_id TEXT,
  p_email TEXT
) RETURNS jsonb AS $$
DECLARE
  v_order RECORD;
  v_new_status TEXT;
BEGIN
  -- Fetch the order and verify ownership
  SELECT * INTO v_order
  FROM orders
  WHERE id = p_order_id AND (customer_email = p_email OR user_id::text = p_email);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Order not found or unauthorized');
  END IF;

  -- Determine new status based on current status
  IF v_order.status IN ('pending', 'confirmed') THEN
    v_new_status := 'cancelled';
  ELSIF v_order.status = 'processing' THEN
    v_new_status := 'cancellation_requested';
  ELSE
    RETURN jsonb_build_object('success', false, 'message', 'Order cannot be cancelled in its current status');
  END IF;

  -- Update order
  UPDATE orders
  SET status = v_new_status::order_status
  WHERE id = p_order_id;

  -- Create log entry using correct 'remarks' column
  INSERT INTO order_status_logs (order_id, status, remarks)
  VALUES (p_order_id, v_new_status::order_status, 'Cancellation triggered by user on Customer Portal');

  RETURN jsonb_build_object(
    'success', true, 
    'message', CASE WHEN v_new_status = 'cancelled' THEN 'Order cancelled successfully' ELSE 'Cancellation requested' END, 
    'new_status', v_new_status
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
