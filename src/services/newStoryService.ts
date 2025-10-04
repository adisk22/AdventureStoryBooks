import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import type { GeneratedStory } from '@/services/gemini';

// TYPES
type Biome = Database["public"]["Tables"]["biomes"]["Row"];

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

// SERVICES
class newStoryService {

    // STORIES
    async saveStoryToStudent () {

    }

    async saveStoryImages () {

    }
    
    async getStoryToStudent () {

    }

    async getStoryImages () {

    }

    async getBiomes(): Promise<Biome[]> {
        try {
            const { data, error } = await supabase
            .from("biomes")  // ← explicit generic with both type arguments
            .select("*");

            if (error) {
                console.error("Error fetching biomes:", error.message);
                return [];
            }

            return data ?? [];
        } catch (err) {
            console.error("Unexpected error:", err);
            return [];
        }
    }


    async getLiteraryGoals () {

    }
    
}

export const storyService = new newStoryService();