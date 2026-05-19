# Video Sourcing Decision: How to Get YouTube URLs

## Problem Statement

**Issue**: `workouts.json` has no `youtubeUrl` or `sourceUrl` field. We only have local GIF paths like `"gif": "gifs/BarbellSquat.gif"`. To migrate to high-quality MP4 videos (Path B), we need the original YouTube sources.

**Root Cause**: The original `youtube_to_gif_v2.py` script didn't store source URLs when creating GIFs. This was a missed opportunity for future-proofing.

---

## Options Analysis

### Option 1: Manual Re-sourcing
**Approach**: Manually search YouTube for each of 82 exercises

**Effort**: 10-15 hours
- ~8 minutes per exercise × 82 exercises
- Search YouTube by exercise name
- Watch videos to verify match
- Copy URL to spreadsheet

**Quality**: ⭐⭐⭐⭐⭐ (5/5)
- Human verification ensures perfect matches
- Can find best quality sources
- Can choose preferred instructors

**Cost**: $0

**Pros**:
- ✅ Highest quality results
- ✅ No technical dependencies
- ✅ Full control over source selection
- ✅ Can add notes/context per exercise

**Cons**:
- ❌ Time-consuming and tedious
- ❌ Prone to human error (typos, wrong URLs)
- ❌ Not scalable for future exercises
- ❌ Boring, repetitive work

---

### Option 2: Convert Existing GIFs to MP4
**Approach**: Use ffmpeg to convert GIFs → MP4 (no re-sourcing)

**Effort**: 2-3 hours
- Write conversion script
- Batch convert all 82 GIFs
- Upload to Cloudinary

**Quality**: ⭐⭐ (2/5)
- **Low quality**: 9 fps (vs 30 fps from YouTube)
- **Large files**: GIF → MP4 doesn't reduce size much
- **No improvement**: Same quality as current GIFs
- **Pixelation**: Compression artifacts from GIF format

**Cost**: $0

**Pros**:
- ✅ Fast implementation
- ✅ No sourcing needed
- ✅ Guaranteed to work (we have the files)

**Cons**:
- ❌ **Defeats the purpose of Path B** (no quality improvement)
- ❌ Still 9 fps (not 30 fps)
- ❌ No playback controls benefit (same visual quality)
- ❌ Doesn't align with customer value goals
- ❌ Would need to re-source later anyway

**Verdict**: ❌ **Not recommended** - Defeats the purpose of Path B

---

### Option 3: Hybrid Approach
**Approach**: Convert GIFs → MP4 now, re-source later

**Effort**: 5-8 hours total
- Phase 1: Convert GIFs → MP4 (2-3h)
- Phase 2: Manual re-sourcing (10-15h, done later)

**Quality**: ⭐⭐ → ⭐⭐⭐⭐⭐ (2/5 initially, 5/5 eventually)

**Cost**: $0

**Pros**:
- ✅ Get video player UI benefits immediately
- ✅ Defer sourcing work to later
- ✅ Incremental improvement

**Cons**:
- ❌ Touch data twice (inefficient)
- ❌ Low quality initially (doesn't meet customer value goals)
- ❌ Still need to do manual work eventually
- ❌ Total effort: 15-18 hours (more than Option 5C)

**Verdict**: ⚠️ **Acceptable fallback** if AI approach fails

---

### Option 4: Stick with GIFs
**Approach**: Abandon Path B, just migrate GIFs to Cloudinary

**Effort**: 8-12 hours (original spec)

**Quality**: ⭐⭐ (2/5)
- Same as current state
- No improvement

**Cost**: $0

**Pros**:
- ✅ Simplest path
- ✅ No sourcing needed
- ✅ Achieves repo size reduction goal

**Cons**:
- ❌ **Abandons customer value improvements**
- ❌ No playback controls
- ❌ No quality improvement
- ❌ Doesn't align with HCI research findings
- ❌ Misses opportunity for competitive advantage

**Verdict**: ❌ **Not recommended** - Abandons Path B benefits

---

### Option 5A: Reverse Image Search
**Approach**: Use Google Reverse Image Search API to find YouTube sources

**How it works**:
1. Extract frame from GIF
2. Upload to Google Reverse Image Search
3. Filter results for YouTube videos
4. Use GPT-4 Vision to verify match

**Effort**: 7-9 hours
- Build reverse image search integration
- Process 82 GIFs
- Manual review of uncertain matches (~30%)

**Quality**: ⭐⭐⭐ (3/5)
- ~70% automation (30% manual review)
- Reverse image search often finds re-uploads, not originals
- May find wrong videos (similar exercises)

**Cost**: ~$50+
- Google Cloud Vision API: $1.50 per 1000 images
- GPT-4 Vision API: $0.01 per image
- Total: ~$50 for 82 exercises

**Feasibility**: ⭐⭐⭐⭐⭐⭐ (6/10)
- Requires Google Cloud setup
- Reverse image search is hit-or-miss
- GIF frames may not match YouTube thumbnails

**Pros**:
- ✅ Partially automated
- ✅ Can find exact source videos

**Cons**:
- ❌ Expensive ($50+)
- ❌ Lower success rate (~70%)
- ❌ Requires Google Cloud account
- ❌ May find re-uploads instead of originals
- ❌ Still requires manual review

**Verdict**: ⚠️ **Possible but not ideal** - Expensive and unreliable

---

### Option 5B: YouTube Search + GPT-4 Vision Verification
**Approach**: Search YouTube API by exercise name, verify with GPT-4 Vision

**How it works**:
1. Search YouTube API for exercise name (e.g., "Barbell Squat")
2. Filter by duration (5-60 seconds), views (>1000), quality (HD)
3. Download top 3 results
4. Use GPT-4 Vision to compare with existing GIF
5. Select best match or flag for manual review

**Effort**: 4-5 hours
- Build YouTube search tool
- Integrate GPT-4 Vision API
- Process 82 exercises
- Manual review of flagged exercises (~15%)

**Quality**: ⭐⭐⭐⭐ (4/5)
- ~85% automation (15% manual review)
- High confidence matches
- Can find better quality sources than originals

**Cost**: ~$4
- YouTube Data API: Free (10,000 queries/day)
- GPT-4 Vision API: $0.01 per image × 3 candidates × 82 exercises = ~$2.50
- yt-dlp downloads: Free
- Total: ~$4

**Feasibility**: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)
- YouTube API is reliable
- GPT-4 Vision is excellent at visual matching
- Exercise names are descriptive enough for search
- Can handle edge cases (manual review)

**Pros**:
- ✅ High automation rate (85%)
- ✅ Low cost ($4)
- ✅ Finds high-quality sources
- ✅ Can discover better videos than originals
- ✅ Reusable tool for future exercises

**Cons**:
- ❌ Requires YouTube API key (free)
- ❌ Requires OpenAI API key (paid)
- ❌ ~15% manual review needed
- ❌ May not find exact original sources

**Verdict**: ✅ **Strong candidate** - Good balance of automation and quality

---

### Option 5C: AI-Powered + Manual Review (RECOMMENDED)
**Approach**: Combine Option 5B with structured manual review workflow

**How it works**:
1. **Automated Phase** (4-5h):
   - Run YouTube search + GPT-4 Vision tool
   - Auto-match high-confidence results (>90% similarity)
   - Flag uncertain matches for review

2. **Manual Review Phase** (2h):
   - Review ~12 flagged exercises
   - Search YouTube manually for flagged items
   - Verify all auto-matched results (spot check)

3. **Output**:
   - `video-sources.json` with YouTube URLs
   - Confidence scores per exercise
   - Notes for manual overrides

**Total Effort**: 6-7 hours
- 4-5h automated sourcing
- 2h manual review
- Plus 8h migration (from original spec)
- **Total: 14-15 hours** (vs 30h for Path B with manual sourcing)

**Quality**: ⭐⭐⭐⭐⭐ (5/5)
- Human verification ensures accuracy
- AI handles bulk of work
- Best of both worlds

**Cost**: ~$4 (same as Option 5B)

**Feasibility**: ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (9/10)
- Proven AI capabilities
- Manageable manual review
- Clear success criteria

**Pros**:
- ✅ **Best balance of automation and quality**
- ✅ Low cost ($4)
- ✅ Reusable tool for future exercises
- ✅ Human verification ensures accuracy
- ✅ Faster than pure manual (6-7h vs 10-15h)
- ✅ Builds valuable tooling for future

**Cons**:
- ❌ Requires API keys (YouTube + OpenAI)
- ❌ More complex than pure manual
- ❌ Still requires some manual work

**Verdict**: ✅ **RECOMMENDED** - Best overall approach

---

## Comparison Matrix

| Option | Effort | Quality | Cost | Automation | Feasibility | Recommended |
|--------|--------|---------|------|------------|-------------|-------------|
| 1. Manual Re-sourcing | 10-15h | ⭐⭐⭐⭐⭐ | $0 | 0% | ⭐⭐⭐⭐⭐ | ⚠️ Fallback |
| 2. GIF → MP4 | 2-3h | ⭐⭐ | $0 | 100% | ⭐⭐⭐⭐⭐ | ❌ No |
| 3. Hybrid | 5-8h | ⭐⭐→⭐⭐⭐⭐⭐ | $0 | 50% | ⭐⭐⭐⭐⭐ | ⚠️ Fallback |
| 4. Stick with GIFs | 8-12h | ⭐⭐ | $0 | N/A | ⭐⭐⭐⭐⭐ | ❌ No |
| 5A. Reverse Image | 7-9h | ⭐⭐⭐ | $50+ | 70% | ⭐⭐⭐⭐⭐⭐ | ❌ No |
| 5B. YouTube Search | 4-5h | ⭐⭐⭐⭐ | $4 | 85% | ⭐⭐⭐⭐⭐⭐⭐⭐ | ✅ Good |
| **5C. AI + Manual** | **6-7h** | **⭐⭐⭐⭐⭐** | **$4** | **85%** | **⭐⭐⭐⭐⭐⭐⭐⭐⭐** | **✅ BEST** |

---

## Recommendation: Option 5C (AI-Powered + Manual Review)

### Why This Is The Best Choice

1. **Aligns with Path B Goals**
   - ✅ High-quality 30 fps videos
   - ✅ Meets customer value requirements
   - ✅ Supports HCI research findings (58.3% prefer video)

2. **Efficient Use of Time**
   - 6-7h sourcing + 8h migration = **14-15h total**
   - vs 10-15h manual + 8h migration = 18-23h total
   - **Saves 4-8 hours** compared to pure manual

3. **Builds Reusable Tooling**
   - Tool can be used for future exercises
   - Reduces future onboarding time
   - Aligns with long-term goals (exercise content onboarding)

4. **Low Cost, High Value**
   - $4 cost is negligible
   - Saves 4-8 hours of manual work
   - ROI: ~$100-200 in time savings (at $25/hour)

5. **Quality Assurance**
   - Human review ensures accuracy
   - AI handles tedious bulk work
   - Best of both worlds

### Implementation Plan

**Phase 1: Build AI Sourcing Tool** (4-5h)
```bash
# Tool: find-exercise-videos.py
# Inputs: workouts.json, gifs/ folder
# Outputs: video-sources.json

# Features:
# - Search YouTube API by exercise name
# - Filter by duration, views, quality
# - Download top 3 candidates
# - Use GPT-4 Vision to compare with GIF
# - Output confidence scores
# - Flag uncertain matches
```

**Phase 2: Manual Review** (2h)
- Review ~12 flagged exercises
- Spot-check high-confidence matches
- Override incorrect matches
- Document decisions

**Phase 3: Update Spec** (1h)
- Update requirements.md
- Update design.md
- Update tasks.md
- Add new commit for video sourcing

**Phase 4: Execute Migration** (8h)
- Follow updated spec
- Use video-sources.json for URLs
- Upload MP4s to Cloudinary
- Update workouts.json

**Total: 15-16 hours** (vs 30h for Path B with manual sourcing)

---

## Tool Design: `find-exercise-videos.py`

### Architecture

```python
# find-exercise-videos.py

import json
from youtube_search import search_youtube
from gpt4_vision import compare_videos
from yt_dlp import download_video

def main():
    # 1. Load workouts.json
    workouts = load_workouts()
    
    # 2. Extract unique exercise names
    exercises = extract_exercise_names(workouts)
    
    # 3. For each exercise:
    results = {}
    for exercise in exercises:
        # 3a. Search YouTube
        candidates = search_youtube(
            query=exercise['name'],
            duration_range=(5, 60),
            min_views=1000,
            quality='hd'
        )
        
        # 3b. Download top 3 candidates
        videos = [download_video(c['url']) for c in candidates[:3]]
        
        # 3c. Compare with existing GIF using GPT-4 Vision
        gif_path = exercise['gif']
        match = compare_videos(gif_path, videos)
        
        # 3d. Store result
        results[exercise['name']] = {
            'youtubeUrl': match['url'],
            'confidence': match['confidence'],
            'needsReview': match['confidence'] < 0.9
        }
    
    # 4. Save results
    save_results('video-sources.json', results)
    
    # 5. Print summary
    print_summary(results)
```

### Output Format: `video-sources.json`

```json
{
  "BarbellSquat": {
    "youtubeUrl": "https://www.youtube.com/watch?v=abc123",
    "confidence": 0.95,
    "needsReview": false,
    "matchReason": "Exercise name, movement pattern, and equipment match",
    "alternatives": [
      "https://www.youtube.com/watch?v=def456",
      "https://www.youtube.com/watch?v=ghi789"
    ]
  },
  "Chinups": {
    "youtubeUrl": "https://www.youtube.com/watch?v=jkl012",
    "confidence": 0.87,
    "needsReview": true,
    "matchReason": "Exercise name matches but grip style differs",
    "alternatives": [
      "https://www.youtube.com/watch?v=mno345"
    ]
  }
}
```

### GPT-4 Vision Prompt

```
You are an exercise video matching expert. Compare the provided GIF with the candidate YouTube video.

GIF: [image of GIF frame]
Video: [image of video frame]

Analyze:
1. Exercise name match (e.g., "Barbell Squat")
2. Movement pattern (squat depth, bar position, stance)
3. Equipment (barbell, dumbbells, bodyweight)
4. Camera angle and framing
5. Overall visual similarity

Respond with JSON:
{
  "confidence": 0.0-1.0,
  "match": true/false,
  "reason": "Explanation of match/mismatch",
  "concerns": ["List any concerns"]
}

Confidence scale:
- 0.95-1.0: Exact match (same video or very similar)
- 0.85-0.94: High confidence (same exercise, minor differences)
- 0.70-0.84: Medium confidence (same exercise, notable differences)
- 0.50-0.69: Low confidence (similar but uncertain)
- 0.00-0.49: No match (different exercise or major differences)
```

---

## Next Steps

1. **Decide**: Confirm Option 5C is the chosen approach
2. **Update Spec**: Modify requirements.md, design.md, tasks.md
3. **Build Tool**: Implement `find-exercise-videos.py`
4. **Run Tool**: Process all 82 exercises
5. **Manual Review**: Review flagged exercises
6. **Execute Migration**: Follow updated spec with video URLs

---

## Risks & Mitigations

### Risk 1: AI Matching Accuracy
**Risk**: GPT-4 Vision might incorrectly match videos
**Mitigation**: 
- Human review of all flagged matches
- Spot-check high-confidence matches
- Conservative confidence thresholds

### Risk 2: YouTube API Rate Limits
**Risk**: Exceed free tier quota (10,000 queries/day)
**Mitigation**:
- Batch processing with delays
- Cache search results
- 82 exercises × 3 candidates = 246 queries (well under limit)

### Risk 3: No Matching Videos Found
**Risk**: Some exercises might not have good YouTube matches
**Mitigation**:
- Manual search for those exercises
- Use alternative video sources (Vimeo, Instagram)
- Fall back to GIF → MP4 for those specific exercises

### Risk 4: API Costs Higher Than Expected
**Risk**: GPT-4 Vision costs exceed $4 estimate
**Mitigation**:
- Set budget alerts
- Use GPT-4 Vision only for final verification
- Batch API calls to reduce overhead

---

## Success Criteria

✅ **Tool successfully matches 85%+ of exercises** (70+ out of 82)
✅ **Manual review completes in <2 hours** (12 exercises @ 10 min each)
✅ **Total cost stays under $10**
✅ **All 82 exercises have YouTube URLs** (100% coverage)
✅ **Video quality is 30 fps, HD** (meets Path B goals)
✅ **Tool is reusable** for future exercises

---

## Conclusion

**Option 5C (AI-Powered + Manual Review)** is the clear winner:
- ✅ Best balance of automation and quality
- ✅ Saves 4-8 hours compared to pure manual
- ✅ Low cost ($4)
- ✅ Builds reusable tooling
- ✅ Aligns with Path B customer value goals
- ✅ Human verification ensures accuracy

**Total effort**: 14-15 hours (6-7h sourcing + 8h migration)
**Total cost**: $4
**Quality**: ⭐⭐⭐⭐⭐ (5/5)

**Recommendation**: Proceed with Option 5C. Build the AI sourcing tool, run it on all 82 exercises, manually review flagged items, then execute the migration with high-quality video sources.
