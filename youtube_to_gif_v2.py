import os
import argparse
from pytube import YouTube
from moviepy.editor import VideoFileClip
from PIL import Image

from pytube.innertube import _default_clients
from pytube import cipher
import re
import yt_dlp
import ffmpeg
from chatgpt_api import get_chatgpt_response


_default_clients["ANDROID"]["context"]["client"]["clientVersion"] = "19.08.35"
_default_clients["IOS"]["context"]["client"]["clientVersion"] = "19.08.35"
_default_clients["ANDROID_EMBED"]["context"]["client"]["clientVersion"] = "19.08.35"
_default_clients["IOS_EMBED"]["context"]["client"]["clientVersion"] = "19.08.35"
_default_clients["IOS_MUSIC"]["context"]["client"]["clientVersion"] = "6.41"
_default_clients["ANDROID_MUSIC"] = _default_clients["ANDROID_CREATOR"]

def get_throttling_function_name(js: str) -> str:
    """Extract the name of the function that computes the throttling parameter.

    :param str js:
        The contents of the base.js asset file.
    :rtype: str
    :returns:
        The name of the function used to compute the throttling parameter.
    """
    function_patterns = [
        r'a\.[a-zA-Z]\s*&&\s*\([a-z]\s*=\s*a\.get\("n"\)\)\s*&&\s*'
        r'\([a-z]\s*=\s*([a-zA-Z0-9$]+)(\[\d+\])?\([a-z]\)',
        r'\([a-z]\s*=\s*([a-zA-Z0-9$]+)(\[\d+\])\([a-z]\)',
    ]
    #logger.debug('Finding throttling function name')
    for pattern in function_patterns:
        regex = re.compile(pattern)
        function_match = regex.search(js)
        if function_match:
            #logger.debug("finished regex search, matched: %s", pattern)
            if len(function_match.groups()) == 1:
                return function_match.group(1)
            idx = function_match.group(2)
            if idx:
                idx = idx.strip("[]")
                array = re.search(
                    r'var {nfunc}\s*=\s*(\[.+?\]);'.format(
                        nfunc=re.escape(function_match.group(1))),
                    js
                )
                if array:
                    array = array.group(1).strip("[]").split(",")
                    array = [x.strip() for x in array]
                    return array[int(idx)]

    raise RegexMatchError(
        caller="get_throttling_function_name", pattern="multiple"
    )

cipher.get_throttling_function_name = get_throttling_function_name

def get_throttling_function_name(js: str) -> str:
    """Extract the name of the function that computes the throttling parameter.

    :param str js:
        The contents of the base.js asset file.
    :rtype: str
    :returns:
        The name of the function used to compute the throttling parameter.
    """
    function_patterns = [
        r'a\.[a-zA-Z]\s*&&\s*\([a-z]\s*=\s*a\.get\("n"\)\)\s*&&\s*'
        r'\([a-z]\s*=\s*([a-zA-Z0-9$]+)(\[\d+\])?\([a-z]\)',
        r'\([a-z]\s*=\s*([a-zA-Z0-9$]+)(\[\d+\])\([a-z]\)',
    ]
    #logger.debug('Finding throttling function name')
    for pattern in function_patterns:
        regex = re.compile(pattern)
        function_match = regex.search(js)
        if function_match:
            #logger.debug("finished regex search, matched: %s", pattern)
            if len(function_match.groups()) == 1:
                return function_match.group(1)
            idx = function_match.group(2)
            if idx:
                idx = idx.strip("[]")
                array = re.search(
                    r'var {nfunc}\s*=\s*(\[.+?\]);'.format(
                        nfunc=re.escape(function_match.group(1))),
                    js
                )
                if array:
                    array = array.group(1).strip("[]").split(",")
                    array = [x.strip() for x in array]
                    return array[int(idx)]

    raise RegexMatchError(
        caller="get_throttling_function_name", pattern="multiple"
    )

cipher.get_throttling_function_name = get_throttling_function_name

# Extended list of common aspect ratios
ASPECT_RATIOS = {
    '16:9': 16/9,   # Widescreen
    '4:3': 4/3,     # Traditional TV
    '1:1': 1/1,     # Square, common on Instagram
    '21:9': 21/9,   # Ultra-widescreen
    '9:16': 9/16,   # Portrait, common on mobile videos (Instagram stories, TikTok)
    '3:2': 3/2,     # Photography, DSLR aspect ratio
    '2.39:1': 2.39, # Cinematic widescreen
    '5:4': 5/4 ,    # Near-square, used in older video formats
    '3:4': 3/4,     # Near-square, used in older video formats'
}


def download_video_with_ytdlp(youtube_url, output_folder):
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),
        'merge_output_format': 'mp4',  # Ensure video and audio are merged
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(youtube_url, download=True)
        video_file = ydl.prepare_filename(info_dict)
    return video_file

def get_exercise_name(youtube_url):
    yt = YouTube(youtube_url)
    print('Title:', yt.title)
    print('Author:', yt.author)
    print('Published date:', yt.publish_date.strftime("%Y-%m-%d"))
    print('Number of views:', yt.views)
    print('Length of video:', yt.length, 'seconds')
    print('Description:', yt.description)
    
    
    # Define the prompt to send to ChatGPT
    prompt = "You are going  to help me name my gifs. They are gifs demonstrating an exercise. The format I want is: '[ExerciseName].gif." \
             "I want the name in PascalCAse. I will give you a video title and a description to make your judgement." \
             "For example, if you find out the exercise is Bicep curls, you will respond 'BicepCurls.gif'. The name cannot be longer than 20 characters." \
             "The gif title is: " + yt.title + ". The description is: " + yt.description + ". What should I name the gif file?"
    # Call the function and get the response
    return get_chatgpt_response(prompt)


# python3 youtube_to_gif_v2.py "https://www.youtube.com/shorts/0f-njCiEIFM" 17 42 3:4 "gifs_output"
def download_and_process_youtube_video(youtube_url, start_time, end_time, target_aspect_ratio, output_folder):
    gif_name = get_exercise_name(youtube_url)
    print("Gif name:", gif_name)
    print("Step zero done!")
    
    
    # Step 1: Download YouTube video
    video_path = download_video_with_ytdlp(youtube_url=youtube_url, output_folder=output_folder)
    print("Step one done!")

    def get_video_info_ffmpeg(video_path):
        probe = ffmpeg.probe(video_path)
        video_streams = [stream for stream in probe['streams'] if stream['codec_type'] == 'video']
        if video_streams:
            width = video_streams[0]['width']
            height = video_streams[0]['height']
            pixel_format = video_streams[0].get('pix_fmt', 'unknown')
            return width, height, pixel_format
        return None

    # Step 2: Load video and trim it
    clip = VideoFileClip(video_path, audio=False).subclip(start_time, end_time)
    print("Step two done!")

    # Step 3: Get video dimensions and calculate cropping region for the target aspect ratio
    width, height = clip.size
    print(f"Original video size: {width}x{height}")

    # Calculate the current aspect ratio of the video
    current_aspect_ratio = width / height
    target_ratio = ASPECT_RATIOS.get(target_aspect_ratio, 16/9)  # Default to 16:9 if not found

    # Calculate cropping to fit the target aspect ratio without stretching
    if current_aspect_ratio > target_ratio:
        # Video is too wide, crop the width
        new_width = int(height * target_ratio)
        x1 = (width - new_width) // 2
        y1 = 0
        x2 = x1 + new_width
        y2 = height
    else:
        # Video is too tall, crop the height
        new_height = int(width / target_ratio)
        x1 = 0
        y1 = (height - new_height) // 2
        x2 = width
        y2 = y1 + new_height

    print(f"Cropping to {x2-x1}x{y2-y1} to fit aspect ratio {target_ratio}")

    # Step 4: Crop and resize video
    clip = clip.crop(x1=x1, y1=y1, x2=x2, y2=y2)
    print("Step three done!")

    # Step 5: Convert to GIF and save it
    gif_output_path = os.path.join(output_folder, gif_name)
    clip.write_gif(gif_output_path, fps=15)
    print("Step four done!")
    # Get the size of the GIF file in MB
    gif_size = os.path.getsize(gif_output_path) / (1024 * 1024)  # Convert bytes to MB
    print(f"GIF Size: {gif_size:.2f} MB")
    print("Cleaning up...")

    # Clean up: delete the original video file
    os.remove(video_path)

    print(f"Done! GIF saved to {gif_output_path + gif_name}")

if __name__ == "__main__":
    # Command-line argument parsing
    parser = argparse.ArgumentParser(description='Download a YouTube video, process it, and convert it to GIF with target aspect ratio.')
    parser.add_argument('youtube_url', type=str, help='The URL of the YouTube video')
    parser.add_argument('start_time', type=float, help='Start time in seconds')
    parser.add_argument('end_time', type=float, help='End time in seconds')
    parser.add_argument('target_aspect_ratio', type=str, choices=ASPECT_RATIOS.keys(), help='The target aspect ratio (e.g., 16:9, 4:3, 1:1, etc.)')
    parser.add_argument('output_folder', type=str, help='Folder to save the output GIF')

    args = parser.parse_args()
    # Ensure the output folder exists
    if not os.path.exists(args.output_folder):
        os.makedirs(args.output_folder)

    # Call the main function with parsed arguments
    download_and_process_youtube_video(args.youtube_url, args.start_time, args.end_time, args.target_aspect_ratio, args.output_folder)
