-- Migration: Story Management System
-- This migration adds tables for story drafts, stories, and story interactions

-- Create story_drafts table for saving work-in-progress stories
CREATE TABLE IF NOT EXISTS story_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    beginning TEXT NOT NULL,
    continuation TEXT NOT NULL,
    biome VARCHAR(100) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table for published stories
CREATE TABLE IF NOT EXISTS stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    biome_id VARCHAR(100) NOT NULL REFERENCES biomes(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    content JSONB NOT NULL, -- Stores the complete GeneratedStory object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0
);

-- Create story_interactions table for likes, views, etc.
CREATE TABLE IF NOT EXISTS story_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'view', 'share', 'bookmark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, user_id, interaction_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_story_drafts_author_id ON story_drafts(author_id);
CREATE INDEX IF NOT EXISTS idx_story_drafts_updated_at ON story_drafts(updated_at);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_biome_id ON stories(biome_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at);
CREATE INDEX IF NOT EXISTS idx_story_interactions_story_id ON story_interactions(story_id);
CREATE INDEX IF NOT EXISTS idx_story_interactions_user_id ON story_interactions(user_id);

-- Create functions for incrementing/decrementing counters
CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stories 
    SET views_count = views_count + 1 
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_story_likes(story_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stories 
    SET likes_count = likes_count + 1 
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_story_likes(story_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stories 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user story statistics
CREATE OR REPLACE FUNCTION get_user_story_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_stories', COALESCE(COUNT(*), 0),
        'published_stories', COALESCE(COUNT(*) FILTER (WHERE status = 'published'), 0),
        'draft_stories', COALESCE(COUNT(*) FILTER (WHERE status = 'draft'), 0),
        'total_likes', COALESCE(SUM(likes_count), 0),
        'total_views', COALESCE(SUM(views_count), 0)
    ) INTO result
    FROM stories
    WHERE author_id = user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_story_drafts_updated_at
    BEFORE UPDATE ON story_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE story_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for story_drafts
CREATE POLICY "Users can view their own drafts" ON story_drafts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create their own drafts" ON story_drafts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own drafts" ON story_drafts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own drafts" ON story_drafts
    FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for stories
CREATE POLICY "Anyone can view published stories" ON stories
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own stories" ON stories
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create their own stories" ON stories
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own stories" ON stories
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own stories" ON stories
    FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for story_interactions
CREATE POLICY "Users can view story interactions" ON story_interactions
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own interactions" ON story_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON story_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample data for testing
INSERT INTO story_drafts (title, beginning, continuation, biome, author_id) VALUES
('The Magic Forest Adventure', 'Once upon a time, a brave little rabbit named Luna discovered a mysterious glowing door in the ancient oak tree.', 'Luna stepped through the door and found herself in a world where trees could talk and flowers sang beautiful melodies.', 'forest', 'demo-user-123'),
('Desert Treasure Hunt', 'In the golden sands of the Sahara, young explorer Alex found an ancient map that shimmered in the moonlight.', 'Following the map led Alex to a hidden oasis where friendly camels shared stories of their desert adventures.', 'desert', 'demo-user-123');

INSERT INTO stories (title, author_id, biome_id, content, likes_count, views_count) VALUES
('The Enchanted Forest Adventure', 'demo-user-123', 'forest', '{"title": "The Enchanted Forest Adventure", "pages": [{"page_number": 1, "text_content": "Once upon a time in the enchanted forest...", "illustration_prompt": "A magical forest scene", "image_url": "https://picsum.photos/400/300?random=1"}]}', 12, 45),
('Ocean\'s Deep Secret', 'demo-user-123', 'ocean', '{"title": "Ocean\'s Deep Secret", "pages": [{"page_number": 1, "text_content": "Deep beneath the ocean waves...", "illustration_prompt": "An underwater scene", "image_url": "https://picsum.photos/400/300?random=2"}]}', 15, 67);

COMMENT ON TABLE story_drafts IS 'Stores work-in-progress stories that users are still writing';
COMMENT ON TABLE stories IS 'Stores published stories with complete content and metadata';
COMMENT ON TABLE story_interactions IS 'Tracks user interactions with stories (likes, views, etc.)';
COMMENT ON COLUMN stories.content IS 'JSON object containing the complete GeneratedStory with pages and illustrations';
COMMENT ON COLUMN story_drafts.biome IS 'Biome identifier for the story setting';
COMMENT ON COLUMN stories.biome_id IS 'Foreign key reference to biomes table';