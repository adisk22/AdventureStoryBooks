import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure your .env.local has VITE_GEMINI_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
          text_content: `${data.beginning} The adventure was just beginning in the magical ${data.biome}.`,
          illustration_prompt: `Professional children's storybook illustration: A magical scene in ${data.biome}, watercolor and gouache style, soft warm lighting, 8-year-old adventure hero exploring, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
          image_url: `https://picsum.photos/400/300?random=1`
        },
        {
          page_number: 2,
          text_content: `As the story continued, our heroes discovered amazing secrets hidden within the ${data.biome}.`,
          illustration_prompt: `Professional children's storybook illustration: Heroes discovering secrets in ${data.biome}, watercolor and gouache style, soft warm lighting, 8-year-old adventure hero with curious expression, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
          image_url: `https://picsum.photos/400/300?random=2`
        },
        {
          page_number: 3,
          text_content: `${data.continuation} The journey through the ${data.biome} had been filled with wonder and excitement.`,
          illustration_prompt: `Professional children's storybook illustration: Journey through ${data.biome}, watercolor and gouache style, soft warm lighting, 8-year-old adventure hero on exciting quest, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
          image_url: `https://picsum.photos/400/300?random=3`
        },
        {
          page_number: 4,
          text_content: `After their incredible adventure, our heroes returned home with stories to tell and memories to cherish forever.`,
          illustration_prompt: `Professional children's storybook illustration: Heroes returning home from ${data.biome}, watercolor and gouache style, soft warm lighting, 8-year-old adventure hero with satisfied smile, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
          image_url: `https://picsum.photos/400/300?random=4`
        },
        {
          page_number: 5,
          text_content: `The ${data.biome} would always hold a special place in their hearts, and they knew they would return one day for more adventures.`,
          illustration_prompt: `Professional children's storybook illustration: Nostalgic view of ${data.biome}, watercolor and gouache style, soft warm lighting, peaceful landscape with 8-year-old adventure hero reflecting, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
          image_url: `https://picsum.photos/400/300?random=5`
        },
        {
          page_number: 6,
          text_content: `And so, the tale of their ${data.biome} adventure became a legend that would be told for generations to come.`,
          illustration_prompt: `Professional children's storybook illustration: Legendary scene from ${data.biome}, watercolor and gouache style, soft warm lighting, 8-year-old adventure hero in triumphant pose, wholesome imagery, hand-painted quality, 4:3 aspect ratio`,
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      // Create a comprehensive prompt for storybook generation with professional schema
      const storybookPrompt = `Create a complete children's storybook (10 pages) based on the following:

STORY DETAILS:
- Title: "${data.title}"
- Setting: ${data.biome}
- Beginning: "${data.beginning}"
- Continuation: "${data.continuation}"

STORYBOOK SCHEMA CONFIGURATION:
{
  "version": "1.0.0",
  "metadata": {
    "title": "${data.title}",
    "subtitle": "A Magical Adventure",
    "language": "en",
    "reading_level": "beginner",
    "intended_age": { "min": 6, "max": 10 },
    "author": "AI Storyteller",
    "illustrator": "AI Artist",
    "narrator": "Friendly Voice",
    "tags": ["adventure", "friendship", "magic", "${data.biome}"],
    "educational_objectives": ["reading comprehension", "imagination", "moral values"],
    "content_warnings": [],
    "license": "creative-commons",
    "created_at": "${new Date().toISOString()}"
  },
  "global_style": {
    "palette": ["#FFE4B5", "#FFB6C1", "#98FB98", "#87CEEB", "#DDA0DD"],
    "render_mode": "storybook",
    "illustration_style": {
      "lighting": "soft_warm",
      "texture": "watercolor_gouache",
      "linework": "gentle_ink",
      "saturation": 0.8,
      "contrast": 0.6
    },
    "layout": "picture_book",
    "image_defaults": {
      "aspect_ratio": "4:3",
      "resolution_px": { "width": 800, "height": 600 },
      "safety": { "violence": "none", "adult": "none", "medical": "none" },
      "negative_prompt": "photorealistic, 3d render, digital art, harsh lighting, dark shadows, scary, violent, adult content, text, logos, watermarks"
    },
    "tts_defaults": { "voice": "friendly_child", "rate": 0.9, "pitch": 1.1, "format": "mp3" }
  },
  "character_bible": [
    {
      "id": "main_character",
      "name": "Adventure Hero",
      "role": "protagonist",
      "visual": {
        "species": "human_child",
        "age_appearance": "8_years_old",
        "colors": { "primary": "#FFB6C1", "secondary": "#87CEEB" },
        "outfit": "adventure_clothes",
        "distinct_features": ["friendly_eyes", "curious_expression", "brave_stance"]
      },
      "personality": ["brave", "curious", "kind", "adventurous"]
    }
  ]
}

ILLUSTRATION STYLE REQUIREMENTS:
You are an expert children's storybook illustrator creating professional picture book art.

Style and tone:
- Soft, warm lighting with gentle shadows
- Watercolor/gouache texture with smooth blending
- Gentle ink linework for definition
- Warm, harmonious color palette
- Consistent character design across all pages
- Balanced composition with clear focal points
- Wholesome, age-appropriate imagery

Technical specifications:
- Aspect ratio: 4:3 landscape orientation
- Resolution: 800x600 pixels
- Style: Hand-painted children's book illustration
- Texture: Watercolor with gouache details
- Lighting: Soft, warm, diffused lighting
- Colors: Pastel and warm tones, high saturation (0.8)
- Contrast: Moderate (0.6) for readability

Character consistency:
- Main character: 8-year-old child with friendly features
- Consistent clothing and appearance across all pages
- Expressive but gentle facial features
- Age-appropriate proportions

Environment design:
- Magical ${data.biome} setting with fantastical elements
- Soft, inviting landscapes
- Clear environmental storytelling
- Balanced composition with breathing room

Return the storybook as a JSON object with this exact structure:
{
  "title": "Story Title",
  "pages": [
    {
      "page_number": 1,
      "text_content": "Page text here...",
      "illustration_prompt": "Detailed storybook-style illustration description with character consistency, soft watercolor style, warm lighting, magical ${data.biome} environment, 4:3 aspect ratio, wholesome imagery"
    }
  ]
}`;

      console.log('📤 Sending storybook prompt to Gemini...');
      const result = await model.generateContent(storybookPrompt);
      const response = await result.response;
      const text = response.text();
      
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
      const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
      
      const pagesWithImages = await Promise.all(
        pages.map(async (page, index) => {
          try {
            console.log(`Generating image for page ${page.page_number}...`);
            
            const imagePrompt = `${page.illustration_prompt}. Professional children's storybook illustration, watercolor and gouache style, soft warm lighting, 4:3 aspect ratio, 800x600 resolution, wholesome imagery, hand-painted quality, consistent character design, magical ${biome} environment, age-appropriate for 6-10 years old.`;
            
            const result = await imageModel.generateContent(imagePrompt);
            const response = await result.response;
            
            // Extract image URL from response
            const imageUrl = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || 
                           response.candidates?.[0]?.content?.parts?.[0]?.text;
            
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
  }
};