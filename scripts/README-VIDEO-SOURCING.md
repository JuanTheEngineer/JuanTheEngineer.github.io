# AI-Powered Exercise Video Sourcing Tool

This tool automatically finds YouTube sources for your 82 exercises using AI-powered matching.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r scripts/requirements-video-sourcing.txt
```

### 2. Get API Keys

#### YouTube Data API (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Click "Enable APIs and Services"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. Set environment variable:
   ```bash
   export YOUTUBE_API_KEY='your-youtube-api-key-here'
   ```

**Free Tier**: 10,000 queries/day (more than enough for 82 exercises)

#### OpenAI API (Paid - ~$4 total)

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add credits to your account (minimum $5)
4. Set environment variable:
   ```bash
   export OPENAI_API_KEY='your-openai-api-key-here'
   ```

**Cost Estimate**: ~$0.05 per exercise × 82 = ~$4 total

### 3. Run the Tool

```bash
cd /Users/juanrodriguez/dev/personal/JuanTheEngineer.github.io
python3 scripts/find-exercise-videos.py
```

The tool will:
1. Load `workouts.json`
2. Extract 82 unique exercises
3. Search YouTube for each exercise
4. Use GPT-4 Vision to verify matches
5. Output results to `video-sources.json`

**Expected Runtime**: 30-45 minutes (with API rate limiting)

## Output Format

The tool creates `video-sources.json`:

```json
{
  "BarbellSquat.gif": {
    "youtubeUrl": "https://www.youtube.com/watch?v=abc123",
    "confidence": 0.95,
    "needsReview": false,
    "matchReason": "Exercise name and movement pattern match perfectly",
    "videoTitle": "How to Barbell Squat | Proper Form",
    "videoChannel": "AthleanX",
    "videoDuration": 45,
    "videoViews": 1500000,
    "alternatives": [
      "https://www.youtube.com/watch?v=def456",
      "https://www.youtube.com/watch?v=ghi789"
    ]
  },
  "Chinups.gif": {
    "youtubeUrl": "https://www.youtube.com/watch?v=jkl012",
    "confidence": 0.87,
    "needsReview": true,
    "matchReason": "Exercise name matches but grip style differs slightly",
    "videoTitle": "Perfect Chin-Up Form",
    "videoChannel": "Jeff Nippard",
    "videoDuration": 38,
    "videoViews": 850000,
    "alternatives": [
      "https://www.youtube.com/watch?v=mno345"
    ]
  }
}
```

## Confidence Levels

- **≥90% (High)**: Auto-approved, likely correct
- **70-89% (Medium)**: Needs review, probably correct
- **50-69% (Low)**: Needs review, uncertain
- **<50% (No match)**: Needs manual search

## Manual Review Process

After the tool completes, review exercises flagged with `needsReview: true`:

1. Open `video-sources.json`
2. Find exercises with `needsReview: true`
3. For each flagged exercise:
   - Watch the suggested YouTube video
   - Compare with the GIF in `gifs/` folder
   - If correct: Change `needsReview` to `false`
   - If incorrect: Replace `youtubeUrl` with correct URL from `alternatives` or search manually
   - Update `confidence` if needed

### Manual Search Tips

If no good match is found:

1. Search YouTube: `"[exercise name] demonstration"`
2. Filter by:
   - Duration: 5-60 seconds
   - Quality: HD
   - Views: >1,000
3. Look for:
   - Clear demonstration
   - Proper form
   - Good camera angle
   - Reputable fitness channel

## Troubleshooting

### "YOUTUBE_API_KEY not set"

```bash
export YOUTUBE_API_KEY='your-key-here'
```

Make sure to replace `your-key-here` with your actual API key.

### "OPENAI_API_KEY not set"

```bash
export OPENAI_API_KEY='your-key-here'
```

### "Quota exceeded" (YouTube API)

You've hit the 10,000 queries/day limit. Wait 24 hours or:
- Create a new Google Cloud project
- Get a new API key
- Continue from where you left off (tool saves intermediate results)

### "Insufficient credits" (OpenAI)

Add more credits to your OpenAI account:
1. Go to [OpenAI Billing](https://platform.openai.com/account/billing)
2. Add $5-10 in credits
3. Re-run the tool

### Tool crashes mid-run

The tool saves intermediate results every 10 exercises to `video-sources-partial.json`. You can:
1. Rename `video-sources-partial.json` to `video-sources.json`
2. Manually process remaining exercises
3. Or re-run the tool (it will overwrite)

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| YouTube Data API | $0 | Free tier: 10,000 queries/day |
| GPT-4 Vision API | ~$4 | ~$0.05 per exercise × 82 |
| yt-dlp downloads | $0 | Free |
| **Total** | **~$4** | One-time cost |

## Next Steps

After running the tool and completing manual review:

1. ✅ Verify `video-sources.json` has 82 entries
2. ✅ All `needsReview: false` or manually verified
3. ✅ All `youtubeUrl` fields are valid
4. ⏭️ Proceed to migration phase (download videos, convert to MP4, upload to Cloudinary)

## Support

If you encounter issues:

1. Check the error message
2. Verify API keys are set correctly
3. Check API quotas/credits
4. Review the troubleshooting section above

For API-specific issues:
- YouTube API: [Google Cloud Support](https://cloud.google.com/support)
- OpenAI API: [OpenAI Help Center](https://help.openai.com/)
