import { supabase } from '@/integrations/supabase/client';

// Service functions for biomes
export const biomeService = {
  // Get all active biomes
  async getAllBiomes() {
    try {
      const { data: biomes, error } = await supabase
        .from('biomes')
        .select('*')
        .eq('is_active', true)
        .order('unlock_points', { ascending: true });
      
      if (error) throw error;
      
      // Map biome IDs to local asset images
      const getLocalImagePath = (biomeId: string): string => {
        const imageMap: Record<string, string> = {
          'forest': '/forest-biome.jpg',
          'desert': '/desert-biome.jpg',
          'ocean': '/ocean-biome.jpg',
          'tundra': '/tundra-biome.jpg',
          'mountains': '/mountains-biome.jpg',
        };
        return imageMap[biomeId] || '/placeholder.svg';
      };
      
      // Transform to match your BiomeMap component format
      return biomes?.map(biome => ({
        id: biome.id,
        name: biome.name,
        unlocked: biome.unlock_points === 0, // For now, assume unlocked if 0 points
        gradient: biome.gradient_class || 'bg-gradient-primary',
        image: getLocalImagePath(biome.id), // Use local assets instead of database
        storyCount: 0 // We'll populate this later
      })) || [];
      
    } catch (error) {
      console.error('Error fetching biomes:', error);
      return [];
    }
  },

  // Get stories for a specific biome
  async getStoriesForBiome(biomeId: string) {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          content,
          likes_count,
          views_count,
          published_at,
          users!stories_author_id_fkey (
            display_name
          )
        `)
        .eq('biome_id', biomeId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match your StoryCard component format
      return stories?.map(story => ({
        id: story.id,
        title: story.title,
        author: story.users?.display_name || 'Unknown',
        biome: 'Biome', // We'll get this from biome name
        preview: story.content ? JSON.parse(story.content as string)?.pages?.[0]?.text || 'No preview available' : 'No content',
        likes: story.likes_count || 0
      })) || [];
      
    } catch (error) {
      console.error('Error fetching stories for biome:', error);
      return [];
    }
  }
};

// Service functions for users
export const userService = {
  // Get user progress
  async getUserProgress(userId: string) {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      return progress || {
        points_earned: 0,
        stories_completed: 0,
        literary_goals_completed: [],
        unlocked_biomes: []
      };
      
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return {
        points_earned: 0,
        stories_completed: 0,
        literary_goals_completed: [],
        unlocked_biomes: []
      };
    }
  },

  // Get user's stories
  async getUserStories(userId: string) {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          status,
          created_at,
          updated_at,
          biomes!stories_biome_id_fkey (
            name
          )
        `)
        .eq('author_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return stories?.map(story => ({
        id: story.id,
        title: story.title,
        biome: story.biomes?.name || 'Unknown',
        status: story.status,
        lastEdited: new Date(story.updated_at).toLocaleDateString()
      })) || [];
      
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return [];
    }
  }
};

// Service functions for stories
export const storyService = {
  // Create a new story
  async createStory(storyData: {
    title: string;
    author_id: string;
    biome_id: string;
    literary_goals?: string[];
  }) {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .insert({
          title: storyData.title,
          author_id: storyData.author_id,
          biome_id: storyData.biome_id,
          literary_goals: storyData.literary_goals || [],
          status: 'draft'
        })
        .select()
        .single();
      
      if (error) throw error;
      return story;
      
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  // Update story
  async updateStory(storyId: string, updates: any) {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .update(updates)
        .eq('id', storyId)
        .select()
        .single();
      
      if (error) throw error;
      return story;
      
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  },

  // Publish story
  async publishStory(storyId: string) {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', storyId)
        .select()
        .single();
      
      if (error) throw error;
      return story;
      
    } catch (error) {
      console.error('Error publishing story:', error);
      throw error;
    }
  }
};