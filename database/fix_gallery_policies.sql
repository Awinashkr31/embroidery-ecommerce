
-- Enable Gallery Write Access
CREATE POLICY "Anyone can insert gallery images" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery images" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery images" ON gallery FOR DELETE USING (true);

-- Ensure 'images' bucket exists (idempotent)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable Storage Access for 'images' bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'images' );

CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public Update" 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'images' );
