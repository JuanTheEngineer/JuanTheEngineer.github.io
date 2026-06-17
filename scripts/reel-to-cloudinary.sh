#!/bin/bash
# reel-to-cloudinary.sh
# Download an Instagram Reel, optionally trim it, and upload to Cloudinary.
#
# Prerequisites:
#   - yt-dlp: brew install yt-dlp
#   - ffmpeg: brew install ffmpeg
#   - cloudinary CLI: pip3 install cloudinary-cli
#     Then configure: cld config -url cloudinary://API_KEY:API_SECRET@CLOUD_NAME
#
# Usage:
#   ./scripts/reel-to-cloudinary.sh <instagram_url> [start_seconds] [end_seconds] [filename]
#
# Examples:
#   ./scripts/reel-to-cloudinary.sh https://www.instagram.com/reel/ABC123/
#   ./scripts/reel-to-cloudinary.sh https://www.instagram.com/reel/ABC123/ 5 20
#   ./scripts/reel-to-cloudinary.sh https://www.instagram.com/reel/ABC123/ 5 20 barbell-row-demo

set -e

URL="$1"
START="$2"
END="$3"
FILENAME="$4"

if [ -z "$URL" ]; then
  echo "Usage: $0 <instagram_url> [start_sec] [end_sec] [filename]"
  exit 1
fi

TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

echo "Downloading reel..."
yt-dlp -o "$TMPDIR/reel.mp4" --format mp4 "$URL"

INPUT="$TMPDIR/reel.mp4"
OUTPUT="$TMPDIR/output.mp4"

# Trim if start/end provided
if [ -n "$START" ] && [ -n "$END" ]; then
  echo "Trimming from ${START}s to ${END}s..."
  ffmpeg -y -i "$INPUT" -ss "$START" -to "$END" -c copy "$OUTPUT" 2>/dev/null
elif [ -n "$START" ]; then
  echo "Trimming from ${START}s to end..."
  ffmpeg -y -i "$INPUT" -ss "$START" -c copy "$OUTPUT" 2>/dev/null
else
  OUTPUT="$INPUT"
fi

# Determine upload filename
if [ -z "$FILENAME" ]; then
  FILENAME="reel-$(date +%s)"
fi

echo "Uploading to Cloudinary (exercises/$FILENAME)..."
RESULT=$(cld uploader upload "$OUTPUT" folder=exercises public_id="$FILENAME" resource_type=video 2>&1)

# Extract the secure URL
SECURE_URL=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('secure_url',''))" 2>/dev/null || echo "")

if [ -n "$SECURE_URL" ]; then
  echo ""
  echo "Success! Cloudinary URL:"
  echo "$SECURE_URL"
  echo ""
  echo "Add to exercises.json as:"
  echo "  {"
  echo "    \"type\": \"cloudinary\","
  echo "    \"mediaType\": \"video\","
  echo "    \"format\": \"mp4\","
  echo "    \"url\": \"$SECURE_URL\","
  echo "    \"startTime\": 0,"
  echo "    \"endTime\": 0,"
  echo "    \"isPrimary\": false,"
  echo "    \"notes\": \"\""
  echo "  }"
else
  echo "Upload output:"
  echo "$RESULT"
  echo ""
  echo "Could not parse secure_url. Check Cloudinary CLI configuration."
fi
