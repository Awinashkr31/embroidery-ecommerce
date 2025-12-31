-- 1. Fix the ENUM type to support cancellation requests
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'cancellation_requested';

-- 2. Update the function to use correct ENUM values and remove 'confirmed' check
CREATE OR REPLACE FUNCTION cancel_order(p_order_id UUID, p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_new_status order_status;
    v_message TEXT;
BEGIN
    -- Fetch order
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id AND customer_email = p_email;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    -- Logic: 
    -- 'pending' -> Direct Cancel
    -- 'processing', 'shipped' -> Request Cancellation
    
    IF v_order.status = 'pending' THEN
        v_new_status := 'cancelled';
        v_message := 'Order cancelled successfully';
    ELSIF v_order.status IN ('processing', 'shipped') THEN
        v_new_status := 'cancellation_requested';
        v_message := 'Cancellation requested successfully';
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Order cannot be cancelled in current status (' || v_order.status || ')');
    END IF;

    -- Perform Update
    UPDATE orders
    SET status = v_new_status
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', v_message, 'new_status', v_new_status);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO service_role;
