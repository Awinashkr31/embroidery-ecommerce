-- Users table policy (Firebase UUIDs stored as string 'firebase_uid')
CREATE POLICY "Users can manage their profile" ON users FOR ALL USING (auth.uid()::text = firebase_uid);

-- Bookings policy (references auth.users directly)
CREATE POLICY "Users can manage bookings" ON bookings FOR ALL USING (auth.uid() = user_id);

-- Cart policy (string user_id)
CREATE POLICY "Users can manage cart" ON cart_items FOR ALL USING (auth.uid()::text = user_id);

-- Addresses policy (string user_id)
CREATE POLICY "Users can manage addresses" ON addresses FOR ALL USING (auth.uid()::text = user_id);

-- Wishlist policy (string user_id) 
CREATE POLICY "Users can manage wishlist" ON wishlist_items FOR ALL USING (auth.uid()::text = user_id);

-- Orders table (uses customer_email AND user_id as strict UUID)
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'email' = customer_email);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'email' = customer_email);
