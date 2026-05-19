#!/bin/bash
# Setup script for AI Video Sourcing Tool

set -e  # Exit on error

echo "=========================================="
echo "🎯 AI Video Sourcing Tool - Setup"
echo "=========================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python3 --version || {
    echo "❌ Error: Python 3 not found"
    echo "Please install Python 3.8 or higher"
    exit 1
}
echo "✅ Python 3 found"
echo ""

# Install dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r scripts/requirements-video-sourcing.txt || {
    echo "❌ Error: Failed to install dependencies"
    echo "Try: pip3 install --user -r scripts/requirements-video-sourcing.txt"
    exit 1
}
echo "✅ Dependencies installed"
echo ""

# Check for API keys
echo "🔑 Checking API keys..."

if [ -z "$YOUTUBE_API_KEY" ]; then
    echo "⚠️  YOUTUBE_API_KEY not set"
    echo ""
    echo "To get a YouTube API key:"
    echo "1. Go to https://console.cloud.google.com/"
    echo "2. Create a new project"
    echo "3. Enable YouTube Data API v3"
    echo "4. Create credentials (API key)"
    echo "5. Run: export YOUTUBE_API_KEY='your-key'"
    echo ""
    read -p "Enter your YouTube API key (or press Enter to skip): " youtube_key
    if [ -n "$youtube_key" ]; then
        export YOUTUBE_API_KEY="$youtube_key"
        echo "✅ YouTube API key set for this session"
        echo "   To persist: Add 'export YOUTUBE_API_KEY=\"$youtube_key\"' to ~/.zshrc"
    fi
else
    echo "✅ YOUTUBE_API_KEY is set"
fi
echo ""

if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not set"
    echo ""
    echo "To get an OpenAI API key:"
    echo "1. Go to https://platform.openai.com/api-keys"
    echo "2. Create a new API key"
    echo "3. Add credits to your account (minimum $5)"
    echo "4. Run: export OPENAI_API_KEY='your-key'"
    echo ""
    read -p "Enter your OpenAI API key (or press Enter to skip): " openai_key
    if [ -n "$openai_key" ]; then
        export OPENAI_API_KEY="$openai_key"
        echo "✅ OpenAI API key set for this session"
        echo "   To persist: Add 'export OPENAI_API_KEY=\"$openai_key\"' to ~/.zshrc"
    fi
else
    echo "✅ OPENAI_API_KEY is set"
fi
echo ""

# Check if both keys are set
if [ -z "$YOUTUBE_API_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: Not all API keys are set"
    echo "The tool will not run without both keys."
    echo ""
    echo "Set them manually:"
    echo "  export YOUTUBE_API_KEY='your-youtube-key'"
    echo "  export OPENAI_API_KEY='your-openai-key'"
    echo ""
    exit 1
fi

echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "To run the tool:"
echo "  python3 scripts/find-exercise-videos.py"
echo ""
echo "Expected runtime: 30-45 minutes"
echo "Expected cost: ~$4 (OpenAI API)"
echo ""
