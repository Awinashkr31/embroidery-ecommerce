CREATE OR REPLACE FUNCTION cancel_order(p_order_id UUID, p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator (admin)
AS $$
DECLARE
    v_order RECORD;
    v_new_status TEXT;
    v_message TEXT;
BEGIN
    -- Fetch the order checking email match
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id AND customer_email = p_email;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    -- Determine new status logic
    IF v_order.status IN ('pending', 'confirmed') THEN
        v_new_status := 'cancelled';
        v_message := 'Order cancelled successfully';
    ELSIF v_order.status IN ('processing', 'shipped') THEN
        v_new_status := 'cancellation_requested';
        v_message := 'Cancellation requested successfully';
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Order cannot be cancelled in current status');
    END IF;

    -- Perform Update
    UPDATE orders
    SET status = v_new_status
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', v_message, 'new_status', v_new_status);
END;
$$;

-- Allow public access (needed for anon users via Profile page)
-- Security is improved by requiring the secret (UUID) + Email combination
GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_order(UUID, TEXT) TO service_role;
