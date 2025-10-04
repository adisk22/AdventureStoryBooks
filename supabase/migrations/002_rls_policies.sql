-- Row Level Security (RLS) Policies for Biome Scribe Studio
-- This file sets up security policies to control data access

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE literary_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_interactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teachers can view students in their class" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users teacher 
      WHERE teacher.id = auth.uid() 
      AND teacher.role = 'teacher' 
      AND teacher.class_id = users.class_id
    )
  );

CREATE POLICY "Students can view classmates" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users student 
      WHERE student.id = auth.uid() 
      AND student.class_id = users.class_id
    )
  );

-- Classes table policies
CREATE POLICY "Teachers can view their own classes" ON classes
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their class" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.class_id = classes.id
    )
  );

CREATE POLICY "Teachers can update their own classes" ON classes
  FOR UPDATE USING (teacher_id = auth.uid());

-- Biomes table policies
CREATE POLICY "Everyone can view active biomes" ON biomes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage biomes" ON biomes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Literary goals table policies
CREATE POLICY "Everyone can view active literary goals" ON literary_goals
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage literary goals" ON literary_goals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Stories table policies
CREATE POLICY "Authors can view their own stories" ON stories
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authors can update their own stories" ON stories
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own stories" ON stories
  FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "Classmates can view published stories" ON stories
  FOR SELECT USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM users author, users viewer
      WHERE author.id = stories.author_id
      AND viewer.id = auth.uid()
      AND author.class_id = viewer.class_id
    )
  );

CREATE POLICY "Teachers can view all stories in their class" ON stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users teacher, users author
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
      AND author.id = stories.author_id
      AND teacher.class_id = author.class_id
    )
  );

CREATE POLICY "Users can create stories" ON stories
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Story pages table policies
CREATE POLICY "Users can view pages of stories they can access" ON story_pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE stories.id = story_pages.story_id
      AND (
        stories.author_id = auth.uid() OR
        stories.status = 'published'
      )
    )
  );

CREATE POLICY "Authors can manage pages of their stories" ON story_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE stories.id = story_pages.story_id
      AND stories.author_id = auth.uid()
    )
  );

-- User progress table policies
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Teachers can view student progress in their class" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users teacher, users student
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
      AND student.id = user_progress.user_id
      AND teacher.class_id = student.class_id
    )
  );

-- Story interactions table policies
CREATE POLICY "Users can view interactions on stories they can access" ON story_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE stories.id = story_interactions.story_id
      AND (
        stories.author_id = auth.uid() OR
        stories.status = 'published'
      )
    )
  );

CREATE POLICY "Users can create interactions" ON story_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own interactions" ON story_interactions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own interactions" ON story_interactions
  FOR DELETE USING (user_id = auth.uid());

-- Create functions for common operations

-- Function to get user's unlocked biomes
CREATE OR REPLACE FUNCTION get_user_unlocked_biomes(user_uuid UUID)
RETURNS TABLE(biome_id UUID, biome_name VARCHAR, unlock_points INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.name, b.unlock_points
  FROM biomes b
  WHERE b.is_active = true
  AND (
    b.unlock_points = 0 OR
    EXISTS (
      SELECT 1 FROM user_progress up
      WHERE up.user_id = user_uuid
      AND up.unlocked_biomes::text LIKE '%' || b.id::text || '%'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can unlock a biome
CREATE OR REPLACE FUNCTION can_unlock_biome(user_uuid UUID, biome_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_points INTEGER;
  biome_points INTEGER;
  already_unlocked BOOLEAN;
BEGIN
  -- Get user's total points
  SELECT total_points INTO user_points
  FROM users WHERE id = user_uuid;
  
  -- Get biome unlock points
  SELECT unlock_points INTO biome_points
  FROM biomes WHERE id = biome_uuid;
  
  -- Check if already unlocked
  SELECT EXISTS (
    SELECT 1 FROM user_progress up
    WHERE up.user_id = user_uuid
    AND up.unlocked_biomes::text LIKE '%' || biome_uuid::text || '%'
  ) INTO already_unlocked;
  
  RETURN user_points >= biome_points AND NOT already_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award points for literary goals
CREATE OR REPLACE FUNCTION award_literary_goal_points(
  user_uuid UUID,
  goal_uuid UUID
)
RETURNS INTEGER AS $$
DECLARE
  goal_points INTEGER;
  new_total INTEGER;
BEGIN
  -- Get goal points
  SELECT points INTO goal_points
  FROM literary_goals WHERE id = goal_uuid;
  
  -- Update user's total points
  UPDATE users 
  SET total_points = total_points + goal_points
  WHERE id = user_uuid
  RETURNING total_points INTO new_total;
  
  -- Add to user progress
  INSERT INTO user_progress (user_id, points_earned, literary_goals_completed)
  VALUES (user_uuid, goal_points, jsonb_build_array(goal_uuid::text))
  ON CONFLICT (user_id, biome_id) 
  DO UPDATE SET 
    points_earned = user_progress.points_earned + goal_points,
    literary_goals_completed = user_progress.literary_goals_completed || jsonb_build_array(goal_uuid::text);
  
  RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;