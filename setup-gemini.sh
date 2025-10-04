#!/bin/bash

echo "🔑 Gemini API Setup Helper"
echo "=========================="
echo ""

echo "Step 1: Get your Gemini API Key"
echo "1. Go to: https://aistudio.google.com/"
echo "2. Sign in with your Google account"
echo "3. Click 'Get API Key' in the left sidebar"
echo "4. Click 'Create API Key'"
echo "5. Copy the generated API key"
echo ""

read -p "Enter your Gemini API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided. Exiting."
    exit 1
fi

echo ""
echo "Creating .env.local file..."

cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Gemini API Configuration
VITE_GEMINI_API_KEY=$api_key
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "Next steps:"
echo "1. Restart your development server (Ctrl+C then npm run dev)"
echo "2. Test story generation - you should now see real AI content!"
echo ""
echo "🎉 Setup complete!"