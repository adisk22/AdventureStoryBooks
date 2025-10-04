-- Create storage bucket for biome images
-- Run this in your Supabase SQL Editor

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('biome-images', 'biome-images', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'biome-images');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'biome-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated Update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'biome-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'biome-images' AND 
  auth.role() = 'authenticated'
);