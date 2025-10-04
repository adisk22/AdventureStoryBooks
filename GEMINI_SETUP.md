# Gemini API Setup Guide

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key"
5. Copy the generated API key

## Step 2: Add API Key to Your Project

1. Open your `.env.local` file in the project root
2. Add this line:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with the actual API key you copied

## Step 3: Restart Your Development Server

1. Stop your current dev server (Ctrl+C)
2. Run `npm run dev` again
3. The app will now use the real Gemini API!

## Step 4: Test It Out

1. Click on any biome
2. Click "Create Story"
3. Enter your story prompts
4. Click "Generate Picture Book!"
5. You should see real AI-generated content!

## Troubleshooting

- **Still seeing mock responses?** Check that your `.env.local` file has the correct variable name: `VITE_GEMINI_API_KEY`
- **API errors?** Make sure your API key is valid and you have credits in your Google AI Studio account
- **No response?** Check the browser console for error messages

## Free Tier Limits

- Gemini API has generous free tier limits
- You can generate many stories without hitting limits
- Check your usage at [Google AI Studio](https://aistudio.google.com/)