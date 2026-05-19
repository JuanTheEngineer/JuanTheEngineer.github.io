# Getting Started: AI Video Sourcing Tool

This guide walks you through using the AI-powered tool to find YouTube sources for all 82 exercises.

## Overview

**What it does**: Automatically searches YouTube and uses GPT-4 Vision to find matching videos for your exercises.

**Time**: 30-45 minutes (mostly automated)
**Cost**: ~$4 (OpenAI API)
**Manual work**: ~2 hours reviewing flagged matches

## Step-by-Step Guide

### Step 1: Install Dependencies (5 minutes)

```bash
# Install Python packages
pip3 install -r scripts/requirements-video-sourcing.txt
```

**What gets installed**:
- `google-api-python-client` - YouTube API
- `openai` - GPT-4 Vision API
- `yt-dlp` - Video downloading
- `Pillow` - Image processing

### Step 2: Get YouTube API Key (10 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a project**:
   - Click "Select a project" → "New Project"
   - Name: "Exercise Video Sourcing"
   - Click "Create"
3. **Enable YouTube Data API v3**:
   - Click "Enable APIs and Services"
   - Search for "YouTube Data API v3"
   - Click on it, then click "Enable"
4. **Create API key**:
   - Click "Create Credentials" → "API Key"
   - Copy the key (looks like: `AIzaSyD...`)
5. **Set environment variable**:
   ```bash
   export YOUTUBE_API_KEY='AIzaSyD...'
   ```

**Free tier**: 10,000 queries/day (way more than you need)

### Step 3: Get OpenAI API Key (5 minutes)

1. **Go to OpenAI**: https://platform.openai.com/api-keys
2. **Create API key**:
   - Click "Create new secret key"
   - Name: "Exercise Video Sourcing"
   - Copy the key (looks like: `sk-proj-...`)
3. **Add credits**:
   - Go to https://platform.openai.com/account/billing
   - Click "Add payment method"
   - Add $5-10 in credits (you'll use ~$4)
4. **Set environment variable**:
   ```bash
   export OPENAI_API_KEY='sk-proj-...'
   ```

**Cost**: ~$0.05 per exercise × 82 = ~$4 total

### Step 4: Test the Setup (2 minutes)

```bash
# Run test on a single exercise
python3 scripts/test-video-sourcing.py
```

**Expected output**:
```
🧪 Testing AI Video Sourcing Tool
✅ API keys found
✅ Video finder initialized
🧪 Testing with: Barbell Squat
🔍 Searching for: Barbell Squat
  📹 Found 3 candidates
  🤖 Analyzing candidate 1/3: How to Barbell Squat...
     Confidence: 0.95 - Exercise name and movement match
  ✅ Best match: How to Barbell Squat (confidence: 0.95)

📊 TEST RESULTS
YouTube URL: https://www.youtube.com/watch?v=...
Confidence: 0.95
Needs Review: false
✅ Test PASSED - Video found!
```

If the test passes, you're ready to run the full tool!

### Step 5: Run the Full Tool (30-45 minutes)

```bash
# Process all 82 exercises
python3 scripts/find-exercise-videos.py
```

**What happens**:
1. Loads `workouts.json`
2. Extracts 82 unique exercises
3. For each exercise:
   - Searches YouTube (3-5 candidates)
   - Downloads video thumbnails
   - Extracts GIF frame
   - Uses GPT-4 Vision to compare
   - Selects best match
4. Saves results to `video-sources.json`

**Progress indicators**:
```
[1/82] Processing: Barbell Squat
🔍 Searching for: Barbell Squat
  📹 Found 3 candidates
  🤖 Analyzing candidate 1/3: How to Barbell Squat...
     Confidence: 0.95 - Exercise name and movement match
  ✅ Best match: How to Barbell Squat (confidence: 0.95)

[2/82] Processing: Chinups
...
```

**Intermediate saves**: Results are saved every 10 exercises to `video-sources-partial.json` in case of crashes.

### Step 6: Review the Results (5 minutes)

After the tool completes, check the summary:

```
📊 SUMMARY
========================================
📈 Confidence Distribution:
  ✅ High confidence (≥90%):  70 / 82 (85.4%)
  ⚠️  Medium confidence (70-89%): 10 / 82 (12.2%)
  ⚠️  Low confidence (50-69%):     2 / 82 (2.4%)
  ❌ No match (<50%):          0 / 82 (0.0%)

🔍 Manual Review Required:
  12 exercises need manual review

📝 Exercises flagged for review:
  - Chinups.gif: 0.87 - Exercise name matches but grip differs
  - KBSwings.gif: 0.82 - Similar movement but equipment differs
  ...
```

### Step 7: Manual Review (1-2 hours)

Open `video-sources.json` and review flagged exercises:

```json
{
  "Chinups.gif": {
    "youtubeUrl": "https://www.youtube.com/watch?v=jkl012",
    "confidence": 0.87,
    "needsReview": true,  // ← Review this one
    "matchReason": "Exercise name matches but grip style differs",
    "videoTitle": "Perfect Chin-Up Form",
    "alternatives": [
      "https://www.youtube.com/watch?v=mno345",
      "https://www.youtube.com/watch?v=pqr678"
    ]
  }
}
```

**For each flagged exercise**:

1. **Watch the suggested video**: Click the `youtubeUrl`
2. **Compare with your GIF**: Open `gifs/Chinups.gif`
3. **Decide**:
   - ✅ **Correct match**: Change `needsReview` to `false`
   - ❌ **Wrong match**: Try an `alternative` URL or search manually
   - 🔍 **Manual search**: Search YouTube for better match

**Manual search tips**:
- Search: `"[exercise name] demonstration"`
- Filter: Duration 5-60s, HD quality, >1000 views
- Look for: Clear demo, proper form, good angle, reputable channel

### Step 8: Verify Completion (2 minutes)

Check that all exercises are ready:

```bash
# Count total exercises
cat video-sources.json | grep "youtubeUrl" | wc -l
# Should output: 82

# Count exercises needing review
cat video-sources.json | grep "needsReview.*true" | wc -l
# Should output: 0 (after manual review)
```

## Troubleshooting

### "YOUTUBE_API_KEY not set"

```bash
# Check if set
echo $YOUTUBE_API_KEY

# If empty, set it
export YOUTUBE_API_KEY='your-key-here'

# To persist across sessions, add to ~/.zshrc:
echo 'export YOUTUBE_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### "OPENAI_API_KEY not set"

Same as above, but with `OPENAI_API_KEY`.

### "Quota exceeded" (YouTube)

You've hit the 10,000 queries/day limit. Options:
1. Wait 24 hours for quota reset
2. Create a new Google Cloud project with a new API key
3. Use the partial results and manually search remaining exercises

### "Insufficient credits" (OpenAI)

Add more credits:
1. Go to https://platform.openai.com/account/billing
2. Click "Add payment method"
3. Add $5-10 in credits
4. Re-run the tool

### Tool crashes mid-run

The tool saves progress every 10 exercises:

```bash
# Check partial results
ls -lh video-sources-partial.json

# Continue from partial results (manual)
# Or just re-run the tool (it will start over)
python3 scripts/find-exercise-videos.py
```

### Low confidence matches

If many exercises have low confidence (<70%):
- Check that GIF files exist in `gifs/` folder
- Verify GIFs are clear and show the exercise
- Consider manual search for low-confidence matches

## Expected Results

**Typical distribution**:
- 70-75 exercises: High confidence (≥90%) - auto-approved
- 8-10 exercises: Medium confidence (70-89%) - quick review
- 2-4 exercises: Low confidence (50-69%) - manual search
- 0-2 exercises: No match (<50%) - manual search

**Total time**:
- Setup: 20 minutes
- Tool runtime: 30-45 minutes
- Manual review: 1-2 hours
- **Total: 2-3 hours**

**Total cost**: ~$4 (OpenAI API)

## Next Steps

After completing video sourcing:

1. ✅ Verify `video-sources.json` has 82 entries
2. ✅ All exercises have `youtubeUrl` set
3. ✅ All `needsReview: false` (or manually verified)
4. ⏭️ **Update spec documents** (requirements.md, design.md, tasks.md)
5. ⏭️ **Execute migration** (download videos, convert to MP4, upload to Cloudinary)

## Support

If you get stuck:

1. **Check error messages** - They usually tell you what's wrong
2. **Verify API keys** - Make sure they're set correctly
3. **Check API quotas** - YouTube (10k/day), OpenAI (check credits)
4. **Review troubleshooting** - See section above
5. **Ask for help** - Provide error message and context

## Quick Reference

```bash
# Setup
pip3 install -r scripts/requirements-video-sourcing.txt
export YOUTUBE_API_KEY='your-key'
export OPENAI_API_KEY='your-key'

# Test
python3 scripts/test-video-sourcing.py

# Run
python3 scripts/find-exercise-videos.py

# Check results
cat video-sources.json | grep "needsReview.*true" | wc -l
```

---

**Ready to start?** Run the setup script:

```bash
./scripts/setup-video-sourcing.sh
```

This will guide you through the setup process interactively.
