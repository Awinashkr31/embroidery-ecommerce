-- Enable viewing of bookings
CREATE POLICY "Anyone can view bookings" ON mehndi_bookings FOR SELECT USING (true);

-- Enable updating of bookings (e.g., status changes)
CREATE POLICY "Anyone can update bookings" ON mehndi_bookings FOR UPDATE USING (true);

-- Enable deletion of bookings
CREATE POLICY "Anyone can delete bookings" ON mehndi_bookings FOR DELETE USING (true);
