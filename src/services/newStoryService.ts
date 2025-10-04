import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import type { GeneratedStory } from '@/services/gemini';
import type { UnprocessedStory } from '@/models/models';

// TYPES
type Biome = Database["public"]["Tables"]["biomes"]["Row"];
type savedStories = Database["public"]["Tables"]["savedStories"]["Row"];
type storyPagesToStoryInsert = Database["public"]["Tables"]["storyPagesToStory"]["Insert"];
type storyPagesToStory = Database["public"]["Tables"]["storyPagesToStory"]["Row"];


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
        console.log(StoryData);

        try {
            const { data, error } = await supabase
                .from("savedStories") // your table name
                .insert([StoryData])
                .select("id"); // optional: returns inserted row

            console.log(data);
            
            
            if (error) {
                console.error("Error saving story:", error.message);
                return null;
            }

            return data?.[0].id; // returns the inserted story
        } catch (err) {
            console.error("Unexpected error saving story:", err);
            return null;
        }
    }

    async getStoryBiome (storyID: number): Promise<string | null> {
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
                biome: biome ?? "",
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
    
    async getStoryPages(storyID: number): Promise<storyPagesToStory[] | null> {
        
        console.log("STORY ID IN SERVICE:", storyID);
        
        try {
            const { data, error } = await supabase
                .from("storyPagesToStory")                      
                .select("*")                                     
                .eq("storyID", storyID)                          
                .order("pageNum", { ascending: true });          

            console.log(data);
            return data ?? [];
        } catch (err) {
            console.error("Unexpected error fetching story pages:", err);
            return null;
        }
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

    async getStoryTitle(storyID: number): Promise<string | null> {
        try {
            const { data, error } = await supabase
                .from("savedStories")   // your table
                .select("title")        // only fetch title column
                .eq("id", storyID)      // filter by id
                .single();              // expect exactly one row   

            return data.title ?? null;
        } catch (err) {
            console.error("Unexpected error in getStoryTitle:", err);
            return null;
        }
    }
    
}

export const storyService = new newStoryService();