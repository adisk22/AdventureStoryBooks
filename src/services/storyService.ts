import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import type { GeneratedStory } from '@/services/gemini';

export interface Story {
  id: string;
  title: string;
  author_id: string;
  biome_id: string;
  status: 'draft' | 'published' | 'archived';
  content: GeneratedStory;
  created_at: string;
  updated_at: string;
  published_at?: string;
  likes_count: number;
  views_count: number;
}

export interface StoryDraft {
  id: string;
  title: string;
  beginning: string;
  continuation: string;
  biome: string;
  status: 'draft';
  created_at: string;
  updated_at: string;
}

export interface StoryStats {
  total_stories: number;
  published_stories: number;
  draft_stories: number;
  total_likes: number;
  total_views: number;
}

class StoryService {
  // Create a new story draft
  async createDraft(data: {
    title: string;
    beginning: string;
    continuation: string;
    biome: string;
    author_id: string;
  }): Promise<StoryDraft> {
    try {
      const { data: draft, error } = await supabase
        .from('story_drafts')
        .insert({
          title: data.title,
          beginning: data.beginning,
          continuation: data.continuation,
          biome: data.biome,
          author_id: data.author_id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Story draft created:', draft);
      return draft;
    } catch (error) {
      console.error('❌ Error creating story draft:', error);
      throw error;
    }
  }

  // Update a story draft
  async updateDraft(draftId: string, data: {
    title?: string;
    beginning?: string;
    continuation?: string;
    biome?: string;
  }): Promise<StoryDraft> {
    try {
      const { data: draft, error } = await supabase
        .from('story_drafts')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', draftId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Story draft updated:', draft);
      return draft;
    } catch (error) {
      console.error('❌ Error updating story draft:', error);
      throw error;
    }
  }

  // Publish a story (convert draft to published story)
  async publishStory(draftId: string, generatedStory: GeneratedStory): Promise<Story> {
    try {
      // First, get the draft
      const { data: draft, error: draftError } = await supabase
        .from('story_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (draftError) throw draftError;

      // Create the published story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert({
          title: draft.title,
          author_id: draft.author_id,
          biome_id: draft.biome,
          status: 'published',
          content: generatedStory,
          published_at: new Date().toISOString(),
          likes_count: 0,
          views_count: 0
        })
        .select()
        .single();

      if (storyError) throw storyError;

      // Delete the draft
      const { error: deleteError } = await supabase
        .from('story_drafts')
        .delete()
        .eq('id', draftId);

      if (deleteError) throw deleteError;

      console.log('✅ Story published successfully:', story);
      return story;
    } catch (error) {
      console.error('❌ Error publishing story:', error);
      throw error;
    }
  }

  // Get all stories for a user
  async getUserStories(userId: string): Promise<Story[]> {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select(`
          *,
          biomes (name),
          users (display_name)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ User stories retrieved:', stories?.length || 0);
      return stories || [];
    } catch (error) {
      console.error('❌ Error getting user stories:', error);
      return [];
    }
  }

  // Get all drafts for a user
  async getUserDrafts(userId: string): Promise<StoryDraft[]> {
    try {
      const { data: drafts, error } = await supabase
        .from('story_drafts')
        .select('*')
        .eq('author_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      console.log('✅ User drafts retrieved:', drafts?.length || 0);
      return drafts || [];
    } catch (error) {
      console.error('❌ Error getting user drafts:', error);
      return [];
    }
  }

  // Get published stories for a specific biome
  async getBiomeStories(biomeId: string): Promise<Story[]> {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select(`
          *,
          biomes (name),
          users (display_name)
        `)
        .eq('biome_id', biomeId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Biome stories retrieved:', stories?.length || 0);
      return stories || [];
    } catch (error) {
      console.error('❌ Error getting biome stories:', error);
      return [];
    }
  }

  // Get a specific story by ID
  async getStory(storyId: string): Promise<Story | null> {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .select(`
          *,
          biomes (name),
          users (display_name)
        `)
        .eq('id', storyId)
        .single();

      if (error) throw error;

      console.log('✅ Story retrieved:', story);
      return story;
    } catch (error) {
      console.error('❌ Error getting story:', error);
      return null;
    }
  }

  // Increment story views
  async incrementViews(storyId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_story_views', {
        story_id: storyId
      });

      if (error) throw error;

      console.log('✅ Story views incremented');
    } catch (error) {
      console.error('❌ Error incrementing story views:', error);
    }
  }

  // Like/unlike a story
  async toggleLike(storyId: string, userId: string): Promise<{ liked: boolean; likes_count: number }> {
    try {
      // Check if user already liked this story
      const { data: existingLike, error: checkError } = await supabase
        .from('story_interactions')
        .select('*')
        .eq('story_id', storyId)
        .eq('user_id', userId)
        .eq('interaction_type', 'like')
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingLike) {
        // Unlike the story
        const { error: deleteError } = await supabase
          .from('story_interactions')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;

        // Decrement likes count
        const { error: decrementError } = await supabase.rpc('decrement_story_likes', {
          story_id: storyId
        });

        if (decrementError) throw decrementError;

        console.log('✅ Story unliked');
        return { liked: false, likes_count: await this.getLikesCount(storyId) };
      } else {
        // Like the story
        const { error: insertError } = await supabase
          .from('story_interactions')
          .insert({
            story_id: storyId,
            user_id: userId,
            interaction_type: 'like'
          });

        if (insertError) throw insertError;

        // Increment likes count
        const { error: incrementError } = await supabase.rpc('increment_story_likes', {
          story_id: storyId
        });

        if (incrementError) throw incrementError;

        console.log('✅ Story liked');
        return { liked: true, likes_count: await this.getLikesCount(storyId) };
      }
    } catch (error) {
      console.error('❌ Error toggling story like:', error);
      throw error;
    }
  }

  // Get likes count for a story
  async getLikesCount(storyId: string): Promise<number> {
    try {
      const { data: story, error } = await supabase
        .from('stories')
        .select('likes_count')
        .eq('id', storyId)
        .single();

      if (error) throw error;

      return story.likes_count || 0;
    } catch (error) {
      console.error('❌ Error getting likes count:', error);
      return 0;
    }
  }

  // Get user story statistics
  async getUserStats(userId: string): Promise<StoryStats> {
    try {
      const { data: stats, error } = await supabase.rpc('get_user_story_stats', {
        user_id: userId
      });

      if (error) throw error;

      console.log('✅ User story stats retrieved:', stats);
      return stats || {
        total_stories: 0,
        published_stories: 0,
        draft_stories: 0,
        total_likes: 0,
        total_views: 0
      };
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      return {
        total_stories: 0,
        published_stories: 0,
        draft_stories: 0,
        total_likes: 0,
        total_views: 0
      };
    }
  }

  // Delete a story
  async deleteStory(storyId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('author_id', userId);

      if (error) throw error;

      console.log('✅ Story deleted');
    } catch (error) {
      console.error('❌ Error deleting story:', error);
      throw error;
    }
  }

  // Delete a draft
  async deleteDraft(draftId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('story_drafts')
        .delete()
        .eq('id', draftId)
        .eq('author_id', userId);

      if (error) throw error;

      console.log('✅ Draft deleted');
    } catch (error) {
      console.error('❌ Error deleting draft:', error);
      throw error;
    }
  }
}

export const storyService = new StoryService();