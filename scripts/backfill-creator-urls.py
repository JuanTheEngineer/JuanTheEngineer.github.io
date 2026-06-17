#!/usr/bin/env python3
"""
Backfill creatorUrl on YouTube demos by resolving channel names to YouTube channel URLs.
Uses YouTube oEmbed (no API key needed) to get author_url.

Usage: python3 scripts/backfill-creator-urls.py
"""

import json
import urllib.request
import urllib.parse
import ssl
import time
from pathlib import Path

ROOT = Path(__file__).parent.parent
EXERCISES_PATH = ROOT / "exercises.json"

ssl_ctx = ssl.create_default_context()
try:
    import certifi
    ssl_ctx.load_verify_locations(certifi.where())
except ImportError:
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE


def get_creator_url(video_url, retries=2):
    """Use YouTube oEmbed to get the author_url (channel URL)."""
    oembed_url = f"https://www.youtube.com/oembed?url={urllib.parse.quote(video_url, safe='')}&format=json"
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
                data = json.loads(resp.read().decode())
            return data.get("author_url", "")
        except Exception:
            if attempt < retries:
                time.sleep(1)
            else:
                return ""


def main():
    with open(EXERCISES_PATH) as f:
        data = json.load(f)

    exercises = data["exercises"]
    total_demos = 0
    need_url = 0
    updated = 0
    failed = 0

    # Collect all YouTube demos that need creatorUrl
    tasks = []
    for ex in exercises:
        for demo in ex.get("demos", []):
            if demo.get("type") == "youtube":
                total_demos += 1
                meta = demo.get("metadata", {})
                if not meta.get("creatorUrl"):
                    need_url += 1
                    tasks.append((ex, demo))

    print(f"YouTube demos total: {total_demos}")
    print(f"Need creatorUrl: {need_url}")
    print()

    if not tasks:
        print("All YouTube demos already have creatorUrl.")
        return

    # Cache: channel name -> URL (avoid duplicate lookups)
    cache = {}

    for i, (ex, demo) in enumerate(tasks, 1):
        video_url = demo.get("url", "")
        channel = demo.get("metadata", {}).get("channel", "")

        # Check cache first
        if channel and channel in cache:
            creator_url = cache[channel]
        else:
            creator_url = get_creator_url(video_url)
            if channel and creator_url:
                cache[channel] = creator_url

        if creator_url:
            if "metadata" not in demo:
                demo["metadata"] = {}
            demo["metadata"]["creatorUrl"] = creator_url
            updated += 1
        else:
            failed += 1

        if i % 20 == 0:
            print(f"  [{i}/{need_url}] updated={updated} failed={failed}")
            # Save checkpoint
            with open(EXERCISES_PATH, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write("\n")

        # Rate limit: be gentle with YouTube
        time.sleep(0.3)

    # Final save
    with open(EXERCISES_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\nDone. Updated: {updated}, Failed: {failed}, Cached channels: {len(cache)}")


if __name__ == "__main__":
    main()
