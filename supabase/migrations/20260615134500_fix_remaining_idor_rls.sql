-- ==========================================
-- FIX REMAINING IDOR / BROKEN ACCESS CONTROL
-- ==========================================

-- 1. Messages
DROP POLICY IF EXISTS "Anyone can view messages" ON "public"."messages";
DROP POLICY IF EXISTS "Anyone can create messages" ON "public"."messages";
DROP POLICY IF EXISTS "Anyone can submit messages" ON "public"."messages";
DROP POLICY IF EXISTS "Admin can manage messages" ON "public"."messages";

DROP POLICY IF EXISTS "Admin can view messages" ON "public"."messages";
CREATE POLICY "Admin can view messages" ON "public"."messages" FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can update messages" ON "public"."messages";
CREATE POLICY "Admin can update messages" ON "public"."messages" FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can delete messages" ON "public"."messages";
CREATE POLICY "Admin can delete messages" ON "public"."messages" FOR DELETE USING (public.is_admin());
DROP POLICY IF EXISTS "Anyone can insert messages" ON "public"."messages";
CREATE POLICY "Anyone can insert messages" ON "public"."messages" FOR INSERT WITH CHECK (true);

-- 2. Notifications
DROP POLICY IF EXISTS "Public Delete" ON "public"."notifications";
DROP POLICY IF EXISTS "Public Insert" ON "public"."notifications";
DROP POLICY IF EXISTS "Public Select" ON "public"."notifications";
DROP POLICY IF EXISTS "Public Update" ON "public"."notifications";
DROP POLICY IF EXISTS "Public update access" ON "public"."notifications";
DROP POLICY IF EXISTS "Allow Any Auth Insert" ON "public"."notifications";
DROP POLICY IF EXISTS "Allow Any Insert (Dev Bypass)" ON "public"."notifications";

DROP POLICY IF EXISTS "Users can view own notifications" ON "public"."notifications";
CREATE POLICY "Users can view own notifications" ON "public"."notifications" FOR SELECT USING (user_email = (auth.jwt() ->> 'email'));
DROP POLICY IF EXISTS "Users can update own notifications" ON "public"."notifications";
CREATE POLICY "Users can update own notifications" ON "public"."notifications" FOR UPDATE USING (user_email = (auth.jwt() ->> 'email'));
DROP POLICY IF EXISTS "Users can delete own notifications" ON "public"."notifications";
CREATE POLICY "Users can delete own notifications" ON "public"."notifications" FOR DELETE USING (user_email = (auth.jwt() ->> 'email'));
DROP POLICY IF EXISTS "Admin can insert notifications" ON "public"."notifications";
CREATE POLICY "Admin can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK (public.is_admin());

-- 3. Custom Requests
DROP POLICY IF EXISTS "Enable full access for all users" ON "public"."custom_requests";

DROP POLICY IF EXISTS "Anyone can insert custom requests" ON "public"."custom_requests";
CREATE POLICY "Anyone can insert custom requests" ON "public"."custom_requests" FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can view custom requests" ON "public"."custom_requests";
CREATE POLICY "Admin can view custom requests" ON "public"."custom_requests" FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can update custom requests" ON "public"."custom_requests";
CREATE POLICY "Admin can update custom requests" ON "public"."custom_requests" FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can delete custom requests" ON "public"."custom_requests";
CREATE POLICY "Admin can delete custom requests" ON "public"."custom_requests" FOR DELETE USING (public.is_admin());

-- 4. Mehndi Bookings
DROP POLICY IF EXISTS "Anyone can delete bookings" ON "public"."mehndi_bookings";
DROP POLICY IF EXISTS "Anyone can create bookings" ON "public"."mehndi_bookings";

DROP POLICY IF EXISTS "Anyone can insert bookings" ON "public"."mehndi_bookings";
CREATE POLICY "Anyone can insert bookings" ON "public"."mehndi_bookings" FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin can view bookings" ON "public"."mehndi_bookings";
CREATE POLICY "Admin can view bookings" ON "public"."mehndi_bookings" FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can update bookings" ON "public"."mehndi_bookings";
CREATE POLICY "Admin can update bookings" ON "public"."mehndi_bookings" FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admin can delete bookings" ON "public"."mehndi_bookings";
CREATE POLICY "Admin can delete bookings" ON "public"."mehndi_bookings" FOR DELETE USING (public.is_admin());

-- 5. Order Status Logs
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."order_status_logs";
DROP POLICY IF EXISTS "Users can read their order logs" ON "public"."order_status_logs";

DROP POLICY IF EXISTS "Users can view own order logs" ON "public"."order_status_logs";
CREATE POLICY "Users can view own order logs" ON "public"."order_status_logs" FOR SELECT USING (
  order_id::text IN (SELECT id::text FROM public.orders WHERE user_id::text = auth.uid()::text)
);
DROP POLICY IF EXISTS "Admin can view all order logs" ON "public"."order_status_logs";
CREATE POLICY "Admin can view all order logs" ON "public"."order_status_logs" FOR SELECT USING (public.is_admin());
