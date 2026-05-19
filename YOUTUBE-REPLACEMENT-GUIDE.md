# YouTube Video Replacement Guide

Replace large GIF files with optimized MP4 videos from YouTube.

## Prerequisites

Install required tools:
```bash
brew install yt-dlp ffmpeg
```

## Quick Start

### Option 1: Interactive Mode (One at a time)

```bash
npm run replace
```

Then answer the prompts:
- Exercise name: `FireHydrant`
- YouTube URL: `https://www.youtube.com/watch?v=abc123`
- Start time: `5` (seconds)
- End time: `15` (seconds)

### Option 2: Batch Mode (Multiple at once)

1. **Copy the template:**
   ```bash
   cp replacements-template.json replacements.json
   ```

2. **Edit `replacements.json`** with your YouTube URLs:
   ```json
   [
     {
       "exerciseName": "FireHydrant",
       "youtubeUrl": "https://www.youtube.com/watch?v=abc123",
       "startTime": 5,
       "endTime": 15
     }
   ]
   ```

3. **Run the batch replacement:**
   ```bash
   npm run replace -- --config replacements.json
   ```

## What It Does

1. ✅ Downloads video from YouTube
2. ✅ Trims to specified time range
3. ✅ Scales to max 800px width (optimized for web)
4. ✅ Compresses with H.264 codec
5. ✅ Uploads to Cloudinary as video
6. ✅ Cleans up temporary files
7. ✅ Saves results to `replacement-log.json`

## Finding Good YouTube Videos

### Tips:
- Search: `"[exercise name] form tutorial"`
- Look for:
  - ✅ Clear demonstration
  - ✅ Good camera angle
  - ✅ Professional channels (AthleanX, Jeff Nippard, etc.)
  - ✅ Short clips (5-15 seconds ideal)
- Avoid:
  - ❌ Talking heads
  - ❌ Multiple exercises in one video
  - ❌ Poor lighting/angles

### Example Searches:
- "fire hydrant exercise form"
- "barbell walking lunges tutorial"
- "single leg hip thrust demonstration"

## The 7 Files That Need Replacement

| Exercise | Original Size | Search Term |
|----------|---------------|-------------|
| 90DegreeBarbellSquats | 84 MB | "90 degree barbell squat" |
| BarbellWalkingLunges | 59 MB | "barbell walking lunges" |
| BoxDepthDrop | 12 MB | "box depth drop" |
| CurtsyLunges | 33 MB | "curtsy lunges" |
| FireHydrant | 65 MB | "fire hydrant exercise" |
| KneelingHipFlexorStretch | 59 MB | "kneeling hip flexor stretch" |
| SingleLegHipThrusts | 38 MB | "single leg hip thrust" |

## File Size Expectations

- **Original GIFs**: 12-84 MB
- **Optimized MP4s**: 1-5 MB (80-95% reduction!)
- **Cloudinary limit**: 10 MB (free tier)

The script automatically optimizes videos to stay under 10MB.

## Example Workflow

```bash
# 1. Find a good YouTube video
# Search: "fire hydrant exercise form"
# Found: https://www.youtube.com/watch?v=abc123
# Good clip from 0:05 to 0:15

# 2. Run replacement
npm run replace

# 3. Enter details:
Exercise name: FireHydrant
YouTube URL: https://www.youtube.com/watch?v=abc123
Start time: 5
End time: 15

# 4. Script will:
#   - Download video
#   - Extract 5-15 second clip
#   - Optimize to ~2MB MP4
#   - Upload to Cloudinary
#   - Save URL to replacement-log.json

# 5. Repeat for other 6 exercises
```

## Batch Example

Create `replacements.json`:
```json
[
  {
    "exerciseName": "FireHydrant",
    "youtubeUrl": "https://www.youtube.com/watch?v=abc123",
    "startTime": 5,
    "endTime": 15
  },
  {
    "exerciseName": "CurtsyLunges",
    "youtubeUrl": "https://www.youtube.com/watch?v=def456",
    "startTime": 10,
    "endTime": 20
  }
]
```

Run:
```bash
npm run replace -- --config replacements.json
```

## Output

The script creates `replacement-log.json`:
```json
{
  "timestamp": "2025-01-16T12:00:00.000Z",
  "results": [
    {
      "exerciseName": "FireHydrant",
      "success": true,
      "url": "https://res.cloudinary.com/your-cloud/video/upload/v123/exercises/FireHydrant.mp4",
      "sizeMB": 2.3
    }
  ]
}
```

## Troubleshooting

### "yt-dlp not found"
```bash
brew install yt-dlp
```

### "ffmpeg not found"
```bash
brew install ffmpeg
```

### "File size too large"
- Reduce clip duration (try 5-10 seconds instead of 10-15)
- Script automatically optimizes, but longer clips = larger files

### "Failed to download video"
- Check YouTube URL is valid
- Some videos are region-restricted
- Try a different video

### "Video quality is poor"
- Script scales to max 800px width (good for web)
- If you need higher quality, edit the script's `scale` parameter

## Next Steps

After replacing the 7 large files:
1. Re-run `npm run upload` (will skip already uploaded files)
2. Proceed to Task 6: Update workouts.json with new URLs
3. All 80 exercises will be on Cloudinary! 🎉

## Advanced: Custom Settings

Edit `scripts/replace-with-youtube.js` to customize:
- Video resolution (line 95): `scale='min(800,iw)'`
- Compression quality (line 96): `-crf 23` (lower = better quality, larger file)
- Audio bitrate (line 97): `-b:a 128k`

## Cost

- ✅ YouTube downloads: Free
- ✅ yt-dlp: Free
- ✅ ffmpeg: Free
- ✅ Cloudinary uploads: Free tier (25GB storage, 25GB bandwidth/month)

---

**Ready to replace those 7 large GIFs?** Start with one exercise in interactive mode to test the workflow!
