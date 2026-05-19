#!/usr/bin/env python3
"""
AI-Powered Exercise Video Sourcing Tool

This tool automatically finds YouTube sources for exercises by:
1. Searching YouTube API by exercise name
2. Filtering by duration, views, and quality
3. Using GPT-4 Vision to compare with existing GIFs
4. Outputting confidence scores and flagging uncertain matches

Usage:
    python3 scripts/find-exercise-videos.py

Requirements:
    - YouTube Data API key (free, 10,000 queries/day)
    - OpenAI API key (GPT-4 Vision)
    - Environment variables: YOUTUBE_API_KEY, OPENAI_API_KEY
"""

import json
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import base64
from io import BytesIO

# Third-party imports
try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("Error: google-api-python-client not installed")
    print("Install with: pip install google-api-python-client")
    sys.exit(1)

try:
    import openai
except ImportError:
    print("Error: openai not installed")
    print("Install with: pip install openai")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not installed")
    print("Install with: pip install Pillow")
    sys.exit(1)

try:
    import yt_dlp
except ImportError:
    print("Error: yt-dlp not installed")
    print("Install with: pip install yt-dlp")
    sys.exit(1)


class ExerciseVideoFinder:
    """Finds YouTube videos for exercises using AI-powered matching."""
    
    def __init__(self, youtube_api_key: str, openai_api_key: str):
        """Initialize the video finder with API keys."""
        self.youtube = build('youtube', 'v3', developerKey=youtube_api_key)
        self.openai_client = openai.OpenAI(api_key=openai_api_key)
        self.temp_dir = Path('temp_videos')
        self.temp_dir.mkdir(exist_ok=True)
        
    def load_workouts(self, workouts_path: str = 'workouts.json') -> Dict:
        """Load workouts.json file."""
        with open(workouts_path, 'r') as f:
            return json.load(f)
    
    def extract_exercise_names(self, workouts: Dict) -> List[Dict]:
        """Extract unique exercise names and GIF paths from workouts.json."""
        exercises = {}
        
        for program in workouts.get('programs', []):
            for exercise in program.get('exercises', []):
                name = exercise.get('name', '')
                gif = exercise.get('gif', '')
                
                if gif and gif not in exercises:
                    # Extract clean exercise name (remove prefixes like "Warm Up 1:")
                    clean_name = name.split(':', 1)[-1].strip() if ':' in name else name
                    
                    exercises[gif] = {
                        'name': clean_name,
                        'original_name': name,
                        'gif': gif
                    }
                
                # Check for sub-exercises
                if 'subExercise' in exercise:
                    sub_gif = exercise['subExercise'].get('gif', '')
                    if sub_gif and sub_gif not in exercises:
                        sub_name = name  # Use parent name for context
                        clean_name = sub_name.split(':', 1)[-1].strip() if ':' in sub_name else sub_name
                        exercises[sub_gif] = {
                            'name': clean_name,
                            'original_name': sub_name,
                            'gif': sub_gif
                        }
                
                # Check for compound exercises
                if 'compoundExercises' in exercise:
                    for compound in exercise['compoundExercises']:
                        comp_gif = compound.get('gif', '')
                        if comp_gif and comp_gif not in exercises:
                            comp_name = name
                            clean_name = comp_name.split(':', 1)[-1].strip() if ':' in comp_name else comp_name
                            exercises[comp_gif] = {
                                'name': clean_name,
                                'original_name': comp_name,
                                'gif': comp_gif
                            }
        
        return list(exercises.values())
    
    def search_youtube(self, query: str, max_results: int = 5) -> List[Dict]:
        """Search YouTube for exercise videos."""
        try:
            # Search for videos
            search_response = self.youtube.search().list(
                q=f"{query} exercise demonstration",
                part='id,snippet',
                maxResults=max_results,
                type='video',
                videoDuration='short',  # 0-4 minutes
                videoDefinition='high',
                relevanceLanguage='en',
                safeSearch='strict'
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
            
            if not video_ids:
                return []
            
            # Get video details (duration, views, etc.)
            videos_response = self.youtube.videos().list(
                part='snippet,contentDetails,statistics',
                id=','.join(video_ids)
            ).execute()
            
            results = []
            for video in videos_response.get('items', []):
                # Parse duration (PT1M30S -> 90 seconds)
                duration_str = video['contentDetails']['duration']
                duration_seconds = self._parse_duration(duration_str)
                
                # Filter by duration (5-60 seconds ideal for exercise demos)
                if not (5 <= duration_seconds <= 120):
                    continue
                
                # Get view count
                views = int(video['statistics'].get('viewCount', 0))
                
                # Filter by minimum views (quality indicator)
                if views < 100:  # Lowered threshold for niche exercises
                    continue
                
                results.append({
                    'videoId': video['id'],
                    'url': f"https://www.youtube.com/watch?v={video['id']}",
                    'title': video['snippet']['title'],
                    'channel': video['snippet']['channelTitle'],
                    'duration': duration_seconds,
                    'views': views,
                    'thumbnail': video['snippet']['thumbnails']['high']['url']
                })
            
            # Sort by views (quality indicator)
            results.sort(key=lambda x: x['views'], reverse=True)
            
            return results[:3]  # Return top 3
            
        except HttpError as e:
            print(f"YouTube API error: {e}")
            return []
    
    def _parse_duration(self, duration_str: str) -> int:
        """Parse ISO 8601 duration to seconds (PT1M30S -> 90)."""
        import re
        
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration_str)
        
        if not match:
            return 0
        
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        return hours * 3600 + minutes * 60 + seconds
    
    def extract_gif_frame(self, gif_path: str) -> Optional[str]:
        """Extract a representative frame from GIF and encode as base64."""
        try:
            # Open GIF and get middle frame
            with Image.open(gif_path) as img:
                # Get middle frame
                frame_count = getattr(img, 'n_frames', 1)
                middle_frame = frame_count // 2
                
                if frame_count > 1:
                    img.seek(middle_frame)
                
                # Convert to RGB (remove alpha channel if present)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize to reasonable size (save API costs)
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                
                # Encode as base64
                buffered = BytesIO()
                img.save(buffered, format="JPEG", quality=85)
                img_str = base64.b64encode(buffered.getvalue()).decode()
                
                return f"data:image/jpeg;base64,{img_str}"
                
        except Exception as e:
            print(f"Error extracting GIF frame: {e}")
            return None
    
    def download_video_thumbnail(self, video_url: str) -> Optional[str]:
        """Download video and extract a frame for comparison."""
        try:
            ydl_opts = {
                'format': 'worst',  # Download lowest quality for speed
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
                'skip_download': False,
                'outtmpl': str(self.temp_dir / '%(id)s.%(ext)s'),
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                video_path = ydl.prepare_filename(info)
                
                # Extract frame using PIL (if video is short enough)
                # For now, just use the thumbnail from YouTube
                return info.get('thumbnail')
                
        except Exception as e:
            print(f"Error downloading video: {e}")
            return None
    
    def compare_with_gpt4_vision(
        self, 
        exercise_name: str,
        gif_frame: str,
        video_info: Dict
    ) -> Dict:
        """Use GPT-4 Vision to compare GIF with video and determine match quality."""
        
        prompt = f"""You are an exercise video matching expert. Compare the provided GIF frame with the YouTube video information.

Exercise Name: {exercise_name}
Video Title: {video_info['title']}
Video Channel: {video_info['channel']}
Video Duration: {video_info['duration']} seconds

Analyze:
1. Does the exercise name match? (e.g., "Barbell Squat" vs "Squat")
2. Does the video title suggest it's a demonstration of this exercise?
3. Is the video duration appropriate for an exercise demo (5-60 seconds)?
4. Is the channel reputable for fitness content?

Based on the GIF frame provided, assess if this video is likely the correct exercise demonstration.

Respond with JSON only (no markdown, no code blocks):
{{
  "confidence": 0.0-1.0,
  "match": true/false,
  "reason": "Brief explanation of match/mismatch",
  "concerns": ["List any concerns or red flags"]
}}

Confidence scale:
- 0.95-1.0: Exact match (very confident)
- 0.85-0.94: High confidence (likely correct)
- 0.70-0.84: Medium confidence (probably correct but verify)
- 0.50-0.69: Low confidence (uncertain)
- 0.00-0.49: No match (likely wrong)"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",  # GPT-4 with vision
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": gif_frame,
                                    "detail": "low"  # Save costs
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300,
                temperature=0.3  # Lower temperature for more consistent results
            )
            
            # Parse JSON response
            content = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if content.startswith('```'):
                lines = content.split('\n')
                # Remove first line (```json or ```)
                lines = lines[1:]
                # Remove last line (```)
                if lines and lines[-1].strip() == '```':
                    lines = lines[:-1]
                content = '\n'.join(lines).strip()
            
            # Try to find JSON object in the content
            if not content.startswith('{'):
                # Look for first { and last }
                start = content.find('{')
                end = content.rfind('}')
                if start != -1 and end != -1:
                    content = content[start:end+1]
            
            # If still empty or invalid, return error
            if not content or not content.strip():
                return {
                    "confidence": 0.0,
                    "match": False,
                    "reason": "Empty response from GPT-4 Vision",
                    "concerns": ["API returned empty response"]
                }
            
            result = json.loads(content)
            return result
            
        except json.JSONDecodeError as e:
            print(f"  ⚠️  JSON parse error: {e}")
            print(f"  Raw content: {content[:200]}...")
            return {
                "confidence": 0.0,
                "match": False,
                "reason": f"JSON parse error: {str(e)}",
                "concerns": ["Failed to parse API response"]
            }
        except Exception as e:
            print(f"  ⚠️  Error calling GPT-4 Vision: {e}")
            return {
                "confidence": 0.0,
                "match": False,
                "reason": f"API error: {str(e)}",
                "concerns": ["Failed to analyze"]
            }
    
    def find_video_for_exercise(self, exercise: Dict) -> Dict:
        """Find the best YouTube video for a single exercise."""
        print(f"\n🔍 Searching for: {exercise['name']}")
        
        # Search YouTube
        candidates = self.search_youtube(exercise['name'])
        
        if not candidates:
            print(f"  ❌ No YouTube results found")
            return {
                'youtubeUrl': None,
                'confidence': 0.0,
                'needsReview': True,
                'matchReason': 'No YouTube results found',
                'alternatives': []
            }
        
        print(f"  📹 Found {len(candidates)} candidates")
        
        # Extract GIF frame for comparison
        gif_frame = self.extract_gif_frame(exercise['gif'])
        
        if not gif_frame:
            print(f"  ⚠️  Could not extract GIF frame, using title matching only")
            # Fallback to title matching
            best_match = candidates[0]
            return {
                'youtubeUrl': best_match['url'],
                'confidence': 0.70,  # Medium confidence without visual verification
                'needsReview': True,
                'matchReason': f"Title match only (no GIF frame): {best_match['title']}",
                'alternatives': [c['url'] for c in candidates[1:]]
            }
        
        # Compare each candidate with GPT-4 Vision
        best_match = None
        best_confidence = 0.0
        
        for i, candidate in enumerate(candidates):
            print(f"  🤖 Analyzing candidate {i+1}/{len(candidates)}: {candidate['title'][:50]}...")
            
            comparison = self.compare_with_gpt4_vision(
                exercise['name'],
                gif_frame,
                candidate
            )
            
            print(f"     Confidence: {comparison['confidence']:.2f} - {comparison['reason']}")
            
            if comparison['confidence'] > best_confidence:
                best_confidence = comparison['confidence']
                best_match = {
                    'youtubeUrl': candidate['url'],
                    'confidence': comparison['confidence'],
                    'needsReview': comparison['confidence'] < 0.90,
                    'matchReason': comparison['reason'],
                    'concerns': comparison.get('concerns', []),
                    'videoTitle': candidate['title'],
                    'videoChannel': candidate['channel'],
                    'videoDuration': candidate['duration'],
                    'videoViews': candidate['views'],
                    'alternatives': [c['url'] for c in candidates if c['url'] != candidate['url']]
                }
            
            # Rate limiting (be nice to APIs)
            time.sleep(1)
        
        if best_match:
            status = "✅" if best_match['confidence'] >= 0.90 else "⚠️"
            print(f"  {status} Best match: {best_match['videoTitle'][:50]}... (confidence: {best_match['confidence']:.2f})")
        
        return best_match or {
            'youtubeUrl': None,
            'confidence': 0.0,
            'needsReview': True,
            'matchReason': 'No confident matches found',
            'alternatives': [c['url'] for c in candidates]
        }
    
    def process_all_exercises(self, workouts_path: str = 'workouts.json') -> Dict:
        """Process all exercises and find YouTube videos."""
        print("=" * 70)
        print("🎯 AI-Powered Exercise Video Sourcing Tool")
        print("=" * 70)
        
        # Load workouts
        print("\n📂 Loading workouts.json...")
        workouts = self.load_workouts(workouts_path)
        
        # Extract exercises
        exercises = self.extract_exercise_names(workouts)
        print(f"✅ Found {len(exercises)} unique exercises")
        
        # Process each exercise
        results = {}
        for i, exercise in enumerate(exercises, 1):
            print(f"\n[{i}/{len(exercises)}] Processing: {exercise['name']}")
            
            result = self.find_video_for_exercise(exercise)
            
            # Use GIF filename as key (e.g., "BarbellSquat.gif")
            gif_filename = Path(exercise['gif']).name
            results[gif_filename] = result
            
            # Save intermediate results (in case of crash)
            if i % 10 == 0:
                self._save_results(results, 'video-sources-partial.json')
                print(f"\n💾 Saved intermediate results ({i}/{len(exercises)})")
        
        return results
    
    def _save_results(self, results: Dict, output_path: str):
        """Save results to JSON file."""
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
    
    def print_summary(self, results: Dict):
        """Print summary statistics."""
        print("\n" + "=" * 70)
        print("📊 SUMMARY")
        print("=" * 70)
        
        total = len(results)
        high_confidence = sum(1 for r in results.values() if r['confidence'] >= 0.90)
        medium_confidence = sum(1 for r in results.values() if 0.70 <= r['confidence'] < 0.90)
        low_confidence = sum(1 for r in results.values() if 0.50 <= r['confidence'] < 0.70)
        no_match = sum(1 for r in results.values() if r['confidence'] < 0.50)
        needs_review = sum(1 for r in results.values() if r['needsReview'])
        
        print(f"\n📈 Confidence Distribution:")
        print(f"  ✅ High confidence (≥90%):  {high_confidence:3d} / {total} ({high_confidence/total*100:.1f}%)")
        print(f"  ⚠️  Medium confidence (70-89%): {medium_confidence:3d} / {total} ({medium_confidence/total*100:.1f}%)")
        print(f"  ⚠️  Low confidence (50-69%):    {low_confidence:3d} / {total} ({low_confidence/total*100:.1f}%)")
        print(f"  ❌ No match (<50%):         {no_match:3d} / {total} ({no_match/total*100:.1f}%)")
        
        print(f"\n🔍 Manual Review Required:")
        print(f"  {needs_review} exercises need manual review")
        
        if needs_review > 0:
            print(f"\n📝 Exercises flagged for review:")
            for gif, result in results.items():
                if result['needsReview']:
                    print(f"  - {gif}: {result['confidence']:.2f} - {result['matchReason'][:60]}")
        
        print(f"\n💰 Estimated API Costs:")
        print(f"  YouTube API: $0 (free tier)")
        print(f"  GPT-4 Vision: ~${total * 0.05:.2f} (${0.05} per exercise)")
        
        print("\n✅ Results saved to: video-sources.json")
        print("⚠️  Please review flagged exercises manually!")


def main():
    """Main entry point."""
    # Check for API keys
    youtube_api_key = os.getenv('YOUTUBE_API_KEY')
    openai_api_key = os.getenv('OPENAI_API_KEY')
    
    if not youtube_api_key:
        print("❌ Error: YOUTUBE_API_KEY environment variable not set")
        print("\nTo get a YouTube API key:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a new project")
        print("3. Enable YouTube Data API v3")
        print("4. Create credentials (API key)")
        print("5. Set environment variable: export YOUTUBE_API_KEY='your-key'")
        sys.exit(1)
    
    if not openai_api_key:
        print("❌ Error: OPENAI_API_KEY environment variable not set")
        print("\nTo get an OpenAI API key:")
        print("1. Go to https://platform.openai.com/api-keys")
        print("2. Create a new API key")
        print("3. Set environment variable: export OPENAI_API_KEY='your-key'")
        sys.exit(1)
    
    # Initialize finder
    finder = ExerciseVideoFinder(youtube_api_key, openai_api_key)
    
    # Process all exercises
    results = finder.process_all_exercises()
    
    # Save results
    finder._save_results(results, 'video-sources.json')
    
    # Print summary
    finder.print_summary(results)
    
    print("\n🎉 Done! Check video-sources.json for results.")


if __name__ == '__main__':
    main()
