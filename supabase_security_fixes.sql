-- ============================================
-- EXACT SCHEMA SQL FIX (Based on provided schema dump)
-- ============================================
DO $$ 
BEGIN
  -- Drop existing policies first
  DROP POLICY IF EXISTS "Public can read products" ON products;
  DROP POLICY IF EXISTS "Admin can write products" ON products;
  DROP POLICY IF EXISTS "Public can read website_settings" ON website_settings;
  DROP POLICY IF EXISTS "Admin can write website_settings" ON website_settings;
  DROP POLICY IF EXISTS "Public can read gallery" ON gallery;
  DROP POLICY IF EXISTS "Admin can write gallery" ON gallery;
  DROP POLICY IF EXISTS "Public can read coupons" ON coupons;
  DROP POLICY IF EXISTS "Admin can write coupons" ON coupons;
  DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist_items;
  DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
  DROP POLICY IF EXISTS "Users can manage their own addresses" ON addresses;
  DROP POLICY IF EXISTS "Users can manage their notifications" ON notifications;
  DROP POLICY IF EXISTS "Admin can create notifications" ON notifications;
  DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
  DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
  DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
  DROP POLICY IF EXISTS "Anyone can submit messages" ON messages;
  DROP POLICY IF EXISTS "Admin can manage messages" ON messages;
  DROP POLICY IF EXISTS "Anyone can submit custom_requests" ON custom_requests;
  DROP POLICY IF EXISTS "Admin can manage custom_requests" ON custom_requests;
  DROP POLICY IF EXISTS "Anyone can submit mehndi_bookings" ON mehndi_bookings;
  DROP POLICY IF EXISTS "Admin can manage mehndi_bookings" ON mehndi_bookings;
  DROP POLICY IF EXISTS "Users can read their order logs" ON order_status_logs;
  DROP POLICY IF EXISTS "Admin can write order logs" ON order_status_logs;
  DROP POLICY IF EXISTS "Users can read their own profile" ON users;
  DROP POLICY IF EXISTS "Users can update their own profile" ON users;
  DROP POLICY IF EXISTS "Admin can manage users" ON users;
  
  -- Extra tables found in schema
  DROP POLICY IF EXISTS "Users can manage bookings" ON bookings;
  DROP POLICY IF EXISTS "Admin can write bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can write reviews" ON reviews;
  DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
  DROP POLICY IF EXISTS "Admin can manage reviews" ON reviews;
  DROP POLICY IF EXISTS "Admins can login" ON admin_users;
END $$;

-- 2. DISABLE RLS TEMPORARILY
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE mehndi_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 3. RE-ENABLE RLS AND APPLY EXACT POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mehndi_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email') = 'awinashkr31@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. PUBLIC READ, ADMIN WRITE TABLES
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can write products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public can read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Admin can write website_settings" ON website_settings FOR ALL USING (is_admin());

CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin can write gallery" ON gallery FOR ALL USING (is_admin());

CREATE POLICY "Public can read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Admin can write coupons" ON coupons FOR ALL USING (is_admin());

-- 5. USER SPECIFIC TABLES (user_id is verified as `character varying` in schema)
CREATE POLICY "Users can manage their own wishlist" ON wishlist_items FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage their own addresses" ON addresses FOR ALL USING (auth.uid()::text = user_id);

-- Notifications (user_email is character varying)
CREATE POLICY "Users can manage their notifications" ON notifications FOR ALL USING ((auth.jwt()->>'email') = user_email);
CREATE POLICY "Admin can create notifications" ON notifications FOR INSERT WITH CHECK (is_admin());


-- 6. ORDERS & BOOKINGS (user_id is `uuid` in bookings/orders)
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING ((auth.jwt()->>'email') = customer_email OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK ((auth.jwt()->>'email') = customer_email OR auth.uid() = user_id);
CREATE POLICY "Admin can manage all orders" ON orders FOR ALL USING (is_admin());

CREATE POLICY "Users can manage bookings" ON bookings FOR ALL USING (auth.uid() = user_id OR (auth.jwt()->>'email') = email);
CREATE POLICY "Admin can write bookings" ON bookings FOR ALL USING (is_admin());

-- 7. REVIEWS (user_id is `text`)
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can write reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Admin can manage reviews" ON reviews FOR ALL USING (is_admin());

-- 8. OPEN SUBMISSIONS, ADMIN MANAGE
CREATE POLICY "Anyone can submit messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage messages" ON messages FOR ALL USING (is_admin());

CREATE POLICY "Anyone can submit custom_requests" ON custom_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage custom_requests" ON custom_requests FOR ALL USING (is_admin());

CREATE POLICY "Anyone can submit mehndi_bookings" ON mehndi_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage mehndi_bookings" ON mehndi_bookings FOR ALL USING (is_admin());

-- 9. LOGS and USERS (firebase_uid is character varying, id is uuid)
CREATE POLICY "Users can read their order logs" ON order_status_logs FOR SELECT USING (true);
CREATE POLICY "Admin can write order logs" ON order_status_logs FOR ALL USING (is_admin());

CREATE POLICY "Users can read their own profile" ON users FOR SELECT USING (auth.uid()::text = firebase_uid);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = firebase_uid);
CREATE POLICY "Admin can manage users" ON users FOR ALL USING (is_admin());

-- 10. ADMIN USERS TABLE
CREATE POLICY "Admins can login" ON admin_users FOR ALL USING (is_admin());
