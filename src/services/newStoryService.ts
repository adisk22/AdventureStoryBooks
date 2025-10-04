import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import type { GeneratedStory } from '@/services/gemini';
import type { UnprocessedStory } from '@/models/models';

// TYPES
type Biome = Database["public"]["Tables"]["biomes"]["Row"];
type savedStories = Database["public"]["Tables"]["savedStories"]["Row"];
type storyPagesToStoryInsert = Database["public"]["Tables"]["storyPagesToStory"]["Insert"];


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
    async saveStory (StoryData: Partial<savedStories>) {
        try {
            const { data, error } = await supabase
                .from("savedStories") // your table name
                .insert([StoryData])
                .select(); // optional: returns inserted row

            if (error) {
                console.error("Error saving story:", error.message);
                return null;
            }

            return data?.[0]; // returns the inserted story
        } catch (err) {
            console.error("Unexpected error saving story:", err);
            return null;
        }
    }

    async getStoryBiome (storyID: number) {
        try 
        {
            const { data, error } = await supabase
                .from("savedStories")   // your table
                .select("biome")        // only fetch biome column
                .eq("id", storyID)      // filter by id
                .single();              // expect exactly one row

            if (error) {
                console.error("Error fetching story biome:", error.message);
                return null;
            }

                return data?.biome ?? null; // return just the biome value
        } 
        catch (err) 
        {
                console.error("Unexpected error in getStoryBiome:", err);
                return null;
        }
    }

    async saveStoryPage (PageData: Partial<UnprocessedStory>, storyID: number) {
        var biome = await this.getStoryBiome(storyID);

        try {
            const completePageData: storyPagesToStoryInsert = {
                storyID: storyID,
                pageNum: PageData.page_number,
                text: PageData.text_content,
                imageUrl: "", 
                nextPrompt: "",
                continuation_option_1: PageData.continuation_option_1 ?? null,
                continuation_option_2: PageData.continuation_option_2 ?? null,
                continuation_option_3: PageData.continuation_option_3 ?? null,
                biome: biome ?? "",
                // no `id` needed — it's optional in Insert
            };
                        
            
            const { data, error } = await supabase
                .from("storyPagesToStory") // your table name
                .insert([completePageData])
                .select(); // optional: returns inserted row

            if (error) {
                console.error("Error saving story:", error.message);
                return null;
            }

            return data?.[0]; // returns the inserted story
        } catch (err) {
            console.error("Unexpected error saving story:", err);
            return null;
        }
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