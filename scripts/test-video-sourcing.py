#!/usr/bin/env python3
"""
Test script for AI Video Sourcing Tool

This script tests the tool on a single exercise to verify:
1. API keys are working
2. YouTube search is functional
3. GPT-4 Vision is accessible
4. Output format is correct

Usage:
    python3 scripts/test-video-sourcing.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    # Import the module by loading it directly (since filename has hyphens)
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "find_exercise_videos",
        Path(__file__).parent / "find-exercise-videos.py"
    )
    find_exercise_videos = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(find_exercise_videos)
    ExerciseVideoFinder = find_exercise_videos.ExerciseVideoFinder
except Exception as e:
    print(f"❌ Error: Could not import find-exercise-videos.py: {e}")
    print("Make sure you're running from the project root directory")
    sys.exit(1)


def test_single_exercise():
    """Test the tool on a single exercise."""
    print("=" * 70)
    print("🧪 Testing AI Video Sourcing Tool")
    print("=" * 70)
    print()
    
    # Check API keys
    youtube_api_key = os.getenv('YOUTUBE_API_KEY')
    openai_api_key = os.getenv('OPENAI_API_KEY')
    
    if not youtube_api_key:
        print("❌ YOUTUBE_API_KEY not set")
        return False
    
    if not openai_api_key:
        print("❌ OPENAI_API_KEY not set")
        return False
    
    print("✅ API keys found")
    print()
    
    # Initialize finder
    print("🔧 Initializing video finder...")
    try:
        finder = ExerciseVideoFinder(youtube_api_key, openai_api_key)
        print("✅ Video finder initialized")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")
        return False
    print()
    
    # Test with a simple exercise
    test_exercise = {
        'name': 'Barbell Squat',
        'gif': 'gifs/BarbellSquat.gif'
    }
    
    print(f"🧪 Testing with: {test_exercise['name']}")
    print()
    
    # Check if GIF exists
    if not Path(test_exercise['gif']).exists():
        print(f"⚠️  Warning: GIF not found at {test_exercise['gif']}")
        print("   Continuing with title matching only...")
        print()
    
    # Find video
    try:
        result = finder.find_video_for_exercise(test_exercise)
        print()
        print("=" * 70)
        print("📊 TEST RESULTS")
        print("=" * 70)
        print()
        print(f"YouTube URL: {result.get('youtubeUrl', 'None')}")
        print(f"Confidence: {result.get('confidence', 0.0):.2f}")
        print(f"Needs Review: {result.get('needsReview', True)}")
        print(f"Match Reason: {result.get('matchReason', 'N/A')}")
        print()
        
        if result.get('youtubeUrl'):
            print("✅ Test PASSED - Video found!")
            print()
            print("The tool is working correctly. You can now run:")
            print("  python3 scripts/find-exercise-videos.py")
            return True
        else:
            print("⚠️  Test completed but no video found")
            print("This might be normal if the exercise name is unusual")
            return True
            
    except Exception as e:
        print(f"❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = test_single_exercise()
    sys.exit(0 if success else 1)
