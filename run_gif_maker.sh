#!/bin/bash

# Hardcoded parameters for the Python script
VIDEO_URL="https://www.youtube.com/shorts/kzc1LZbBtkI"  # Replace this with the desired URL
START_TIME=3  # Replace this with the desired start time in seconds
END_TIME=10  # Replace this with the desired end time in seconds
ASPECT_RATIO="3:4"  # Replace this with the desired aspect ratio (e.g., 16:9, 4:3, etc.)
OUTPUT_FOLDER="gifs_staging"  # Replace this with the desired output folder path

# Call the Python script with the hardcoded parameters
python3 youtube_to_gif_v2.py "$VIDEO_URL" "$START_TIME" "$END_TIME" "$ASPECT_RATIO" "$OUTPUT_FOLDER" --user

# Notify the user that the process is complete
echo "GIF creation process complete!"
