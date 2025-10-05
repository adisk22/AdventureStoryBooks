import { GoogleGenerativeAI } from '@google/generative-ai';
import { UnprocessedStory, containsProfanity, storyPagesToStory } from '@/models/models';


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

  async checkProfanity(text: string): Promise<containsProfanity> {
      if (!GEMINI_API_KEY || !genAI) {
        return { profanity: true};
      }

      try {
        console.log('📚 Generating storybook with Gemini Storybook API...');
        
        // Use Gemini 2.0 Flash for storybook generation
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Create a simple prompt that chekks for profanity
        const profanityPrompt = `Check the following user story for profanity and content deemed inappropriate for children ages 3 to 10. If any is found, return true, otherwise return false.  
        The user's story should not contain any
        - Sexual content or references
        - Violent or graphic descriptions
        - Strong language or profanity
        - Drug or alcohol references
        - Scary or disturbing themes
        - Any other content not suitable for young children

        Check for profanity in both text content, wordings, themes, and any implied meanings.

        Here is the user's story to check for profanity: ${text}

  Return as JSON:
  {
    "profanity": true
  }`;
    
      const result = await model.generateContent(profanityPrompt);
      const response = await result.response;
      
      var text = response.text();
      text = text.replace(/```(json)?/g, "").trim();
      
      console.log('📥 Received storybook response from Gemini:', text);

      // Parse the JSON response
      let profanityJson: containsProfanity;
      try {
        profanityJson = JSON.parse(text) as containsProfanity;
        
      } catch (err) {
        console.error("❌ Failed to parse Gemini response:", err);
        throw err;
      }
      // Generate illustrations fo this page using Imagen
      // const storybookWithImages = await this.generateStorybookImages(storybookJson.pages, data.biome);

      return profanityJson;
     } 
     catch (error) 
     {    
      return { profanity: true};
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
        "text_content": "User's story content formatted for children's book",
        "image_url": "https://picsum.photos/400/300?random=7"
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
- Maintain the user's original narrative and characters as shown in ${data.beginning} and ${data.title}
- Ensure that each plot point connects logically to the next. For example, a character doesn't need to travel to the location they are already at. Another example is, a character should interact with new characters introduced in the prompt
- Ensure that the next generated part of the story contains no profanity, such as sexual content or references, violent or graphic descriptions, strong language or profanity, drug or alcohol references, or scary or disturbing themes. In other words, ensure the story is age-appropriate for children 6-10 years old
- Wholesome, positive imagery only
- Ensure the story matches the ${data.biome} environment setting

IMPORTANT: Place MUCH greater emphasis on what she is doing now ${data.continuation} rather than what has already happened ${data.beginning} when generating the next part of the story. The new text should be a continuation of the story, not a repetition of what has already occurred. The next action should be about 
what happens next in the story based on what is most likely to happen next considering where the character is now.

RETURN REQUIREMENTS:
- Keep text_content as only the new generated piece. It should not contain text or ideas from ${data.beginning} and ${data.continuation}
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
        "text_content": "User's story content formatted for children's book",
        "image_url": "https://picsum.photos/400/300?random=7"
      };
    }
  },

  async generatePageImage(data: {
    title: string;
    beginning: string;
    continuation: string;
    biome: string;
  }): Promise<string> {
    
    try {
      console.log('🎨 Generating illustration for storybook page...');

      var currentPart = data.continuation == "" ? data.beginning : data.continuation;

      const imagePrompt = `. 
          Scene: Depict a scene that reflects this part of the story: "${currentPart} using plot points from ${data.title}". 
          Focus on depicting the story accurately:
            - Characters: include all main characters mentioned in this scene
            - Actions: show what each character is doing
            - Objects & background: include important objects, setting, or elements from the story
            - The possible environment they are in based on the story so far: ${data.biome}. If the text has said they met with someone or have entered a building or structure, then ${data.biome} can be less prominent.
          Art style: soft watercolor with delicate hand-drawn linework, gentle pastel colors
          Composition: 4:3 aspect ratio, clear focal point on main characters and story action, age-appropriate for children 6-10. 
          Mood: wholesome, wonder-filled, and inviting, capturing the story’s emotion, action, and key events. 
          Ensure the illustration directly represents the story content
          Also ensure that generated image contains no profanity, such as sexual content or references, violent or graphic descriptions, strong language or profanity, drug or alcohol references, or scary or disturbing themes. In other words, ensure the story is age-appropriate for children 6-10 years old
          In other words, have the generated image contain only wholesome, positive imagery only
          `;

      // Pollinations API URL
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=768&model=turbo`;

      return imageUrl;

    } catch (error) {
      return `https://picsum.photos/400/300?random=3`
    }
  },
};