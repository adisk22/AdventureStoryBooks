-- Update biomes table with Supabase Storage URLs
-- Replace 'your-project-id' with your actual Supabase project ID
-- Run this in your Supabase SQL Editor

-- Update existing biomes with Supabase Storage URLs
UPDATE biomes 
SET image_url = 'https://your-project-id.supabase.co/storage/v1/object/public/biome-images/forest-biome.jpg' 
WHERE id = 'forest';

UPDATE biomes 
SET image_url = 'https://your-project-id.supabase.co/storage/v1/object/public/biome-images/desert-biome.jpg' 
WHERE id = 'desert';

UPDATE biomes 
SET image_url = 'https://your-project-id.supabase.co/storage/v1/object/public/biome-images/ocean-biome.jpg' 
WHERE id = 'ocean';

UPDATE biomes 
SET image_url = 'https://your-project-id.supabase.co/storage/v1/object/public/biome-images/tundra-biome.jpg' 
WHERE id = 'tundra';

UPDATE biomes 
SET image_url = 'https://your-project-id.supabase.co/storage/v1/object/public/biome-images/mountains-biome.jpg' 
WHERE id = 'mountains';

-- Verify the updates
SELECT id, name, image_url FROM biomes ORDER BY id;