import { GoogleGenerativeAI } from '@google/generative-ai';
import { UnprocessedStory } from '@/models/models';

// Ensure your .env.local has VITE_GEMINI_API_KEY
const GEMINI_API_KEY = 'AIzaSyDGIyVMpCIhgzRPV8zkgh99uqeGGeTPf6I'

if (!GEMINI_API_KEY) {
  console.warn('⚠️ VITE_GEMINI_API_KEY is not set. Using mock Gemini Storybook service.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface StoryPage {
  page_number: number;
  text_content: string;
  illustration_prompt: string;
  image_url?: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  narration_url?: string;
  pdf_url?: string;
}


// Mock responses for development without an API key
const mockGeminiResponses = {
  generateStorybook: (data: {
    title: string;
    beginning: string;
    continuation: string;
    biome: string;
    photos?: File[];
  }) => {
    console.log('MOCK: Generating Gemini Storybook...');
    
    return Promise.resolve({
      title: data.title || `Adventure in ${data.biome}`,
      pages: [
        {
          page_number: 1,
          text_content: data.beginning,
          illustration_prompt: `Children's storybook illustration: ${data.beginning.substring(0, 100)}..., watercolor style, soft lighting, ${data.biome} setting`,
          image_url: `https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=`
        },
        {
          page_number: 2,
          text_content: data.beginning + " The adventure continued...",
          illustration_prompt: `Children's storybook illustration: Adventure scene in ${data.biome}, watercolor style, soft lighting`,
          image_url: `https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=`
        },
        {
          page_number: 3,
          text_content: data.continuation,
          illustration_prompt: `Children's storybook illustration: ${data.continuation.substring(0, 100)}..., watercolor style, soft lighting, ${data.biome} setting`,
          image_url: `https://picsum.photos/400/300?random=3`
        },
        {
          page_number: 4,
          text_content: data.continuation + " The story reached its exciting conclusion...",
          illustration_prompt: `Children's storybook illustration: Exciting conclusion in ${data.biome}, watercolor style, soft lighting`,
          image_url: `https://picsum.photos/400/300?random=4`
        },
        {
          page_number: 5,
          text_content: "And so the adventure came to an end, but the memories would last forever.",
          illustration_prompt: `Children's storybook illustration: Peaceful ending scene in ${data.biome}, watercolor style, soft lighting`,
          image_url: `https://picsum.photos/400/300?random=5`
        },
        {
          page_number: 6,
          text_content: "The end.",
          illustration_prompt: `Children's storybook illustration: Final scene in ${data.biome}, watercolor style, soft lighting`,
          image_url: `https://picsum.photos/400/300?random=6`
        }
      ],
      narration_url: 'https://example.com/narration.mp3',
      pdf_url: 'https://example.com/storybook.pdf'
    });
  },

  analyzePhotos: (photos: File[]) => {
    console.log('MOCK: Analyzing photos for character extraction...');
    return Promise.resolve(photos.map((_, i) => `Character ${i + 1}`));
  }
};

export const geminiService = {
  async generateStorybook(data: {
    title: string;
    beginning: string;
    continuation: string;
    biome: string;
    photos?: File[];
  }): Promise<GeneratedStory> {
    if (!GEMINI_API_KEY || !genAI) {
      console.log('Using mock Gemini Storybook service (no API key provided)');
      return mockGeminiResponses.generateStorybook(data);
    }

    try {
      console.log('📚 Generating storybook with Gemini Storybook API...');
      
      // Use Gemini 2.0 Flash for storybook generation
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Create a simple prompt that uses the user's exact content with storybook styling
      const storybookPrompt = `Transform the following user story into a professional children's storybook with 5 pages 
      and detailed illustration and animations for kids aged 6 to 10 years old. make sure the 
      images are relavant to the story and engaging.:

USER STORY:
Title: "${data.title}"
Beginning: "${data.beginning}"
Continuation: "${data.continuation}"
Setting: ${data.biome}

STORYBOOK STYLE REQUIREMENTS:
- Create exactly 10 pages
- Use the user's exact story content as the foundation
- Apply professional children's book illustration style
- Each page should have engaging text and detailed illustration prompts
- Maintain the user's original narrative and characters
- Style: Watercolor/gouache with soft warm lighting
- Age-appropriate for children 6-10 years old
- Wholesome, positive imagery

ILLUSTRATION SPECIFICATIONS:
- Aspect ratio: 4:3 landscape
- Resolution: 800x600 pixels
- Style: Hand-painted children's book illustration
- Texture: Watercolor with gouache details
- Lighting: Soft, warm, diffused lighting
- Colors: Pastel and warm tones
- Character consistency across all pages
- Magical ${data.biome} environment

Return as JSON:
{
  "title": "User's exact title",
  "pages": [
    {
      "page_number": 1,
      "text_content": "User's story content formatted for children's book",
      "illustration_prompt": "Detailed storybook-style illustration description"
    }
  ]
}`;

      console.log('📤 Sending storybook prompt to Gemini...');
      const result = await model.generateContent(storybookPrompt);
      const response = await result.response;
      const text = response.text();
      responseMimeType: "image/png";
      
      console.log('📥 Received storybook response from Gemini:', text);

      // Parse the JSON response
      let storybookJson;
      try {
        // Try to parse directly first
        storybookJson = JSON.parse(text);
      } catch (parseError) {
        console.log('Direct JSON parse failed, trying to extract from markdown...');
        // Try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          storybookJson = JSON.parse(jsonMatch[1]);
        } else {
          // If all else fails, try to find JSON-like content
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}') + 1;
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            const jsonString = text.substring(jsonStart, jsonEnd);
            storybookJson = JSON.parse(jsonString);
          } else {
            throw new Error('Could not extract JSON from Gemini response');
          }
        }
      }

      console.log('✅ Successfully parsed storybook from Gemini:', storybookJson);

      // Generate illustrations for each page using Imagen
      const storybookWithImages = await this.generateStorybookImages(storybookJson.pages, data.biome);

      // Add narration and PDF URLs (these would be generated by the actual Storybook API)
      const completeStorybook = {
        ...storybookJson,
        pages: storybookWithImages,
        narration_url: 'https://example.com/narration.mp3', // Would be real URL from Storybook API
        pdf_url: 'https://example.com/storybook.pdf' // Would be real URL from Storybook API
      };

      return completeStorybook;

    } catch (error) {
      console.error('❌ Gemini Storybook API Error:', error);
      console.log('🔄 Falling back to mock response...');
      return mockGeminiResponses.generateStorybook(data);
    }
  },

  async generateStorybookImages(pages: StoryPage[], biome: string = 'magical world'): Promise<StoryPage[]> {
    if (!GEMINI_API_KEY || !genAI) {
      console.log('Using mock image generation');
      return pages.map(page => ({
        ...page,
        image_url: `https://picsum.photos/400/300?random=${page.page_number}`
      }));
    }

    
    try {
      console.log('🎨 Generating illustrations for storybook pages...');
      
      // Use Imagen for image generation
      const imageModel = genAI.getGenerativeModel({ model: "veo-2.0-generate-001" });
      
      const pagesWithImages = await Promise.all(
        pages.map(async (page, index) => {
          try {
            console.log(`Generating image for page ${page.page_number}...`);
            
                  const imagePrompt = `${page.illustration_prompt}. Children's storybook illustration, watercolor style, soft lighting, 4:3 aspect ratio, wholesome imagery, ${biome} environment.`;
        
            // Extract image URL from response
            const imageUrl =  `https://pollinations.ai/api/v1/generate?prompt=${encodeURIComponent(imagePrompt)}&width=1024&height=1024`;
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error('Failed to fetch image');

            return {
              ...page,
              image_url: imageUrl || `https://picsum.photos/400/300?random=${page.page_number}`
            };
          } catch (imageError) {
            console.error(`Error generating image for page ${page.page_number}:`, imageError);
            return {
              ...page,
              image_url: `https://picsum.photos/400/300?random=${page.page_number}`
            };
          }
        })
      );

      console.log('✅ All storybook illustrations generated successfully');
      return pagesWithImages;

    } catch (error) {
      console.error('❌ Error generating storybook images:', error);
      // Return pages with placeholder images
      return pages.map(page => ({
        ...page,
        image_url: `https://picsum.photos/400/300?random=${page.page_number}`
      }));
    }
  },

  async analyzePhotos(photos: File[]): Promise<string[]> {
    if (!GEMINI_API_KEY || !genAI) {
      return mockGeminiResponses.analyzePhotos(photos);
    }
    
    try {
      console.log('🔍 Analyzing photos for character extraction...');
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Convert files to base64 for API
      const imageParts = await Promise.all(
        photos.map(async (photo) => {
          const arrayBuffer = await photo.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          return {
            inlineData: {
              data: base64,
              mimeType: photo.type
            }
          };
        })
      );

      const prompt = `Analyze these photos and extract character information for a children's story. 
      For each photo, provide a simple character name and brief description suitable for a children's story.
      Return as a JSON array of character objects with "name" and "description" fields.`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      // Parse character data
      try {
        const characters = JSON.parse(text);
        return characters.map((char: any) => char.name || char.description || 'Character');
      } catch (parseError) {
        console.error('Error parsing character data:', parseError);
        return photos.map((_, i) => `Character ${i + 1}`);
      }

    } catch (error) {
      console.error('❌ Error analyzing photos:', error);
      return mockGeminiResponses.analyzePhotos(photos);
    }
  },


  async generatePartOfStory(data: {
    title: string;
    beginning: string;
    continuation: string;
    biome: string;
  }): Promise<UnprocessedStory> {
    if (!GEMINI_API_KEY || !genAI) {
      console.log('Using mock Gemini Storybook service (no API key provided)');
      return {
        "page_number": 1,
        "text_content": "User's story content formatted for children's book"
      };
    }

    try {
      console.log('📚 Generating storybook with Gemini Storybook API...');
      
      // Use Gemini 2.0 Flash for storybook generation
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Create a simple prompt that uses the user's exact content with storybook styling
      const storybookPrompt = `Transform the following prompt into a single page of a professional children's storybook

USER STORY:
Title: "${data.title}"
Beginning: "${data.beginning}"
Continuation: "${data.continuation}"
Setting: ${data.biome}

STORYBOOK STYLE REQUIREMENTS:
- Create around 2 to 3 sentences using the user story
- Use the user's exact story content as the foundation
- Each page should have engaging text
- Maintain the user's original narrative and characters as shown in ${data.beginning}
- Ensure that each plot point connects logically to the next
- Age-appropriate for children 6-10 years old
- Wholesome, positive imagery only
- Ensure the story matches the ${data.biome} environment setting

RETURN REQUIREMENTS:
- Keep text_content as only the new generated piece. It should not contain text from ${data.beginning} and ${data.continuation}
- ${data.beginning} and ${data.continuation} should be used to help generate the new text, but not be part of it

Return as JSON:
{
  "page_number": 1,
  "text_content": "User's story content formatted for children's book",
}`;

      console.log('📤 Sending storybook prompt to Gemini...');
      const result = await model.generateContent(storybookPrompt);
      const response = await result.response;
      
      var text = response.text();
      text = text.replace(/```(json)?/g, "").trim();
      
      console.log('📥 Received storybook response from Gemini:', text);

      // Parse the JSON response
      let storybookJson: UnprocessedStory;
      try {
        storybookJson = JSON.parse(text) as UnprocessedStory;
        console.log("✅ Parsed storybook:", storybookJson);
      } catch (err) {
        console.error("❌ Failed to parse Gemini response:", err);
        throw err;
      }
      // Generate illustrations fo this page using Imagen
      // const storybookWithImages = await this.generateStorybookImages(storybookJson.pages, data.biome);

      return storybookJson;

    } catch (error) {
      return {
        "page_number": 1,
        "text_content": "User's story content formatted for children's book"
      };
    }
  }
};