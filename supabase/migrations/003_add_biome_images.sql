-- Update biomes table to include image URLs
-- Run this in your Supabase SQL Editor

-- First, let's check what columns we currently have
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'biomes' AND table_schema = 'public';

-- Add image_url column if it doesn't exist
ALTER TABLE biomes 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing biomes with image URLs
UPDATE biomes 
SET image_url = '/forest-biome.jpg' 
WHERE id = 'forest';

UPDATE biomes 
SET image_url = '/desert-biome.jpg' 
WHERE id = 'desert';

UPDATE biomes 
SET image_url = '/ocean-biome.jpg' 
WHERE id = 'ocean';

UPDATE biomes 
SET image_url = '/tundra-biome.jpg' 
WHERE id = 'tundra';

UPDATE biomes 
SET image_url = '/mountains-biome.jpg' 
WHERE id = 'mountains';

-- Verify the updates
SELECT id, name, image_url FROM biomes ORDER BY id;