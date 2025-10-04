#!/bin/bash
# Setup script for Biome Scribe Studio environment variables

echo "🔧 Biome Scribe Studio Environment Setup"
echo "========================================"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    echo "Do you want to overwrite it? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

echo "📋 Please provide your Supabase credentials:"
echo ""

# Get Supabase URL
echo "1. Go to your Supabase dashboard: https://supabase.com"
echo "2. Click on your project"
echo "3. Go to Settings → API"
echo "4. Copy the Project URL"
echo ""
echo "Enter your Supabase Project URL:"
read -r SUPABASE_URL

# Get Supabase Key
echo ""
echo "5. Copy the anon/public key from the same page"
echo ""
echo "Enter your Supabase anon/public key:"
read -r SUPABASE_KEY

# Validate inputs
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_KEY" ]]; then
    echo "❌ Error: Both URL and key are required"
    exit 1
fi

if [[ ! "$SUPABASE_URL" =~ ^https://.*\.supabase\.co$ ]]; then
    echo "⚠️  Warning: URL doesn't look like a valid Supabase URL"
fi

if [[ ! "$SUPABASE_KEY" =~ ^eyJ ]]; then
    echo "⚠️  Warning: Key doesn't look like a valid JWT token"
fi

# Create .env.local file
cat > .env.local << EOF
# Biome Scribe Studio Environment Variables
# Generated on $(date)

# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=$SUPABASE_KEY

# Gemini API Configuration (for future AI features)
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Check the browser console for connection details"
echo "3. Look for '✅ Supabase connection successful' messages"
echo ""
echo "🔍 If you see connection errors:"
echo "- Double-check your Supabase URL and key"
echo "- Make sure your Supabase project is active"
echo "- Verify you're using the anon/public key (not the service role key)"