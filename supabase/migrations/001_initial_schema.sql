-- Biome Scribe Studio Database Schema
-- Initial migration for core tables and functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE story_status AS ENUM ('draft', 'in_progress', 'completed', 'published');
CREATE TYPE goal_type AS ENUM ('adjective', 'verb', 'dialogue', 'description', 'plot_element', 'character_development');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE interaction_type AS ENUM ('like', 'view', 'comment');

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  teacher_id UUID,
  school_name VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  class_id UUID REFERENCES classes(id),
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for classes.teacher_id
ALTER TABLE classes ADD CONSTRAINT fk_classes_teacher 
  FOREIGN KEY (teacher_id) REFERENCES users(id);

-- Biomes table
CREATE TABLE biomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  gradient_class VARCHAR(50),
  unlock_points INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Literary Goals table
CREATE TABLE literary_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type goal_type NOT NULL,
  points INTEGER DEFAULT 10,
  difficulty difficulty_level DEFAULT 'beginner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  author_id UUID REFERENCES users(id) NOT NULL,
  biome_id UUID REFERENCES biomes(id) NOT NULL,
  status story_status DEFAULT 'draft',
  content JSONB, -- Story pages with text and generated images
  literary_goals JSONB, -- Goals used in this story
  generated_images JSONB, -- URLs of AI-generated character images
  original_images JSONB, -- URLs of uploaded student photos
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Story Pages table
CREATE TABLE story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  image_url TEXT,
  character_images JSONB, -- Specific character images for this page
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  biome_id UUID REFERENCES biomes(id),
  points_earned INTEGER DEFAULT 0,
  stories_completed INTEGER DEFAULT 0,
  literary_goals_completed JSONB DEFAULT '[]'::jsonb,
  unlocked_biomes JSONB DEFAULT '[]'::jsonb,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, biome_id)
);

-- Story Interactions table
CREATE TABLE story_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) NOT NULL,
  interaction_type interaction_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, user_id, interaction_type)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_class_id ON users(class_id);
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_biome_id ON stories(biome_id);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_story_interactions_story_id ON story_interactions(story_id);
CREATE INDEX idx_story_interactions_user_id ON story_interactions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biomes_updated_at BEFORE UPDATE ON biomes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_literary_goals_updated_at BEFORE UPDATE ON literary_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial biomes data
INSERT INTO biomes (name, description, image_url, gradient_class, unlock_points) VALUES
('Enchanted Forest', 'A magical forest filled with ancient trees, talking animals, and hidden secrets.', '/forest-biome.jpg', 'bg-gradient-forest', 0),
('Golden Desert', 'A vast desert with golden sands, mysterious oases, and ancient ruins.', '/desert-biome.jpg', 'bg-gradient-desert', 0),
('Deep Ocean', 'The mysterious depths of the ocean with colorful coral reefs and sea creatures.', '/ocean-biome.jpg', 'bg-gradient-ocean', 0),
('Frozen Tundra', 'A cold, snowy landscape with ice caves, polar animals, and northern lights.', '/tundra-biome.jpg', 'bg-gradient-tundra', 500),
('Misty Mountains', 'High mountain peaks with clouds, eagles, and hidden mountain villages.', '/mountains-biome.jpg', 'bg-gradient-mountains', 1000);

-- Insert initial literary goals data
INSERT INTO literary_goals (title, description, type, points, difficulty) VALUES
('Colorful Adjectives', 'Use at least 5 descriptive adjectives to make your story more vivid', 'adjective', 10, 'beginner'),
('Action Verbs', 'Include at least 3 strong action verbs to make your story exciting', 'verb', 10, 'beginner'),
('Character Dialogue', 'Add dialogue between characters to bring them to life', 'dialogue', 15, 'beginner'),
('Setting Description', 'Describe the setting in detail using sensory details', 'description', 15, 'beginner'),
('Plot Twist', 'Include an unexpected plot twist that surprises the reader', 'plot_element', 20, 'intermediate'),
('Character Growth', 'Show how your main character changes or learns something', 'character_development', 25, 'intermediate'),
('Advanced Adjectives', 'Use sophisticated adjectives to create atmosphere', 'adjective', 15, 'advanced'),
('Complex Dialogue', 'Write dialogue that reveals character personality and advances the plot', 'dialogue', 20, 'advanced'),
('Rich Descriptions', 'Create detailed, multi-sensory descriptions that immerse the reader', 'description', 25, 'advanced'),
('Multiple Plot Elements', 'Weave together multiple plot elements like conflict, resolution, and theme', 'plot_element', 30, 'advanced');

-- Create a sample class
INSERT INTO classes (name, school_name) VALUES
('Class A', 'Elementary School Demo');

-- Create a sample teacher user (you'll need to update this with real auth data)
INSERT INTO users (email, display_name, role, class_id) VALUES
('teacher@demo.com', 'Ms. Johnson', 'teacher', (SELECT id FROM classes WHERE name = 'Class A' LIMIT 1));

-- Create sample student users
INSERT INTO users (email, display_name, role, class_id, total_points, level) VALUES
('student1@demo.com', 'Emma Johnson', 'student', (SELECT id FROM classes WHERE name = 'Class A' LIMIT 1), 275, 5),
('student2@demo.com', 'Alex Chen', 'student', (SELECT id FROM classes WHERE name = 'Class A' LIMIT 1), 150, 3),
('student3@demo.com', 'Maya Patel', 'student', (SELECT id FROM classes WHERE name = 'Class A' LIMIT 1), 400, 7);

-- Create sample stories
INSERT INTO stories (title, author_id, biome_id, status, content, literary_goals, likes_count, views_count, word_count, published_at) VALUES
('The Lost Key of the Ancient Oak', 
 (SELECT id FROM users WHERE email = 'student1@demo.com'), 
 (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 
 'published',
 '{"pages": [{"text": "Deep in the heart of the enchanted forest, Emma discovered a mysterious key embedded in the bark of the oldest tree.", "page": 1}]}',
 '["Colorful Adjectives", "Action Verbs"]',
 24, 156, 250, NOW()),

('Whispers Among the Leaves', 
 (SELECT id FROM users WHERE email = 'student2@demo.com'), 
 (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 
 'published',
 '{"pages": [{"text": "When the wind blows through the forest, some say you can hear the trees talking. Alex never believed it until last Tuesday.", "page": 1}]}',
 '["Character Dialogue", "Setting Description"]',
 18, 98, 180, NOW()),

('The Firefly Festival', 
 (SELECT id FROM users WHERE email = 'student3@demo.com'), 
 (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 
 'published',
 '{"pages": [{"text": "Once a year, millions of fireflies gather in the clearing. Legend says if you make a wish during the festival, it will come true.", "page": 1}]}',
 '["Rich Descriptions", "Plot Twist"]',
 31, 203, 320, NOW());

-- Create sample story pages
INSERT INTO story_pages (story_id, page_number, text_content) VALUES
((SELECT id FROM stories WHERE title = 'The Lost Key of the Ancient Oak'), 1, 'Deep in the heart of the enchanted forest, Emma discovered a mysterious key embedded in the bark of the oldest tree.'),
((SELECT id FROM stories WHERE title = 'Whispers Among the Leaves'), 1, 'When the wind blows through the forest, some say you can hear the trees talking. Alex never believed it until last Tuesday.'),
((SELECT id FROM stories WHERE title = 'The Firefly Festival'), 1, 'Once a year, millions of fireflies gather in the clearing. Legend says if you make a wish during the festival, it will come true.');

-- Create sample user progress
INSERT INTO user_progress (user_id, biome_id, points_earned, stories_completed, literary_goals_completed, unlocked_biomes) VALUES
((SELECT id FROM users WHERE email = 'student1@demo.com'), (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 275, 3, '["Colorful Adjectives", "Action Verbs", "Character Dialogue"]', '["Enchanted Forest", "Golden Desert", "Deep Ocean"]'),
((SELECT id FROM users WHERE email = 'student2@demo.com'), (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 150, 2, '["Character Dialogue", "Setting Description"]', '["Enchanted Forest", "Golden Desert"]'),
((SELECT id FROM users WHERE email = 'student3@demo.com'), (SELECT id FROM biomes WHERE name = 'Enchanted Forest'), 400, 4, '["Rich Descriptions", "Plot Twist", "Character Growth"]', '["Enchanted Forest", "Golden Desert", "Deep Ocean", "Frozen Tundra"]');

-- Create sample story interactions
INSERT INTO story_interactions (story_id, user_id, interaction_type) VALUES
((SELECT id FROM stories WHERE title = 'The Lost Key of the Ancient Oak'), (SELECT id FROM users WHERE email = 'student2@demo.com'), 'like'),
((SELECT id FROM stories WHERE title = 'The Lost Key of the Ancient Oak'), (SELECT id FROM users WHERE email = 'student3@demo.com'), 'like'),
((SELECT id FROM stories WHERE title = 'Whispers Among the Leaves'), (SELECT id FROM users WHERE email = 'student1@demo.com'), 'like'),
((SELECT id FROM stories WHERE title = 'The Firefly Festival'), (SELECT id FROM users WHERE email = 'student1@demo.com'), 'like'),
((SELECT id FROM stories WHERE title = 'The Firefly Festival'), (SELECT id FROM users WHERE email = 'student2@demo.com'), 'like');

-- Update story likes counts based on interactions
UPDATE stories SET likes_count = (
  SELECT COUNT(*) FROM story_interactions 
  WHERE story_id = stories.id AND interaction_type = 'like'
);

COMMENT ON TABLE users IS 'User accounts for students, teachers, and admins';
COMMENT ON TABLE classes IS 'Class groups managed by teachers';
COMMENT ON TABLE biomes IS 'Story settings/environments that students can unlock';
COMMENT ON TABLE literary_goals IS 'Educational objectives for story writing';
COMMENT ON TABLE stories IS 'Student-created stories with AI-generated content';
COMMENT ON TABLE story_pages IS 'Individual pages within a story';
COMMENT ON TABLE user_progress IS 'Student progress tracking and achievements';
COMMENT ON TABLE story_interactions IS 'User interactions with stories (likes, views, comments)';