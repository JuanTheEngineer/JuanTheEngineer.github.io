# Video Sources Format

This document describes the structure of `video-sources.json` for tracking exercise video sources.

## Structure

```json
{
  "ExerciseName": {
    "primary": {
      "cloudinaryUrl": "https://res.cloudinary.com/...",
      "source": {
        "type": "youtube|tiktok|instagram|original-gif|custom",
        "url": "https://...",
        "startTime": 0,
        "endTime": 10,
        "uploadedAt": "2025-01-16T12:00:00Z",
        "notes": "Optional notes"
      },
      "fileSize": "2.3 MB",
      "duration": 10
    },
    "alternatives": [
      {
        "url": "https://...",
        "type": "youtube|tiktok|instagram|vimeo|other",
        "startTime": 0,
        "endTime": 0,
        "quality": "excellent|good|acceptable",
        "notes": "Why this is a good alternative",
        "addedAt": "2025-01-16T12:30:00Z"
      }
    ],
    "metadata": {
      "lastUpdated": "2025-01-16T13:00:00Z",
      "tags": ["glutes", "hip-mobility"]
    }
  }
}
```

## Fields

### Primary (Required)
The main video used in the app, uploaded to Cloudinary.

- **cloudinaryUrl** (string, required): Cloudinary CDN URL
- **source** (object, required): Original source information
  - **type** (string): `youtube`, `tiktok`, `instagram`, `original-gif`, `custom`
  - **url** (string): Original URL (if applicable)
  - **startTime** (number): Start time in seconds (0 for beginning)
  - **endTime** (number): End time in seconds (0 for full length)
  - **originalFile** (string): Original filename (for GIFs)
  - **uploadedAt** (string): ISO timestamp
  - **notes** (string): Additional notes
- **fileSize** (string): File size (e.g., "2.3 MB")
- **duration** (number): Video duration in seconds

### Alternatives (Optional)
Array of alternative video sources you found but didn't upload. **Same structure as primary source** for easy swapping.

- **type** (string, required): `youtube`, `tiktok`, `instagram`, `vimeo`, `other`
- **url** (string, required): Video URL
- **startTime** (number, required): Start time in seconds (0 for beginning)
- **endTime** (number, required): End time in seconds (0 for full length)
- **notes** (string, optional): Why this is a good alternative
- **addedAt** (string, optional): ISO timestamp (auto-added by script)

### Metadata (Optional)
Additional tracking information.

- **lastUpdated** (string): ISO timestamp
- **updatedBy** (string): Who made the update
- **tags** (array): Tags for categorization

## Example

```json
{
  "FireHydrant": {
    "primary": {
      "cloudinaryUrl": "https://res.cloudinary.com/demo/video/upload/v123/exercises/FireHydrant.mp4",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=abc123",
        "startTime": 5,
        "endTime": 15,
        "uploadedAt": "2025-01-16T12:00:00Z",
        "notes": "Clear demonstration, good angle"
      },
      "fileSize": "2.3 MB",
      "duration": 10
    },
    "alternatives": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=def456",
        "startTime": 10,
        "endTime": 20,
        "notes": "Alternative angle, slightly longer",
        "addedAt": "2025-01-16T12:30:00Z"
      },
      {
        "type": "tiktok",
        "url": "https://www.tiktok.com/@trainer/video/789",
        "startTime": 0,
        "endTime": 0,
        "notes": "Short, perfect form demo - full video",
        "addedAt": "2025-01-16T13:00:00Z"
      }
    ],
    "metadata": {
      "lastUpdated": "2025-01-16T13:00:00Z",
      "tags": ["glutes", "hip-mobility"]
    }
  },
  "BarbellSquat": {
    "primary": {
      "cloudinaryUrl": "https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif",
      "source": {
        "type": "original-gif",
        "originalFile": "BarbellSquat.gif",
        "uploadedAt": "2025-01-16T10:00:00Z"
      }
    }
  }
}
```

## Use Cases

### 1. Track Primary Source
Know where each video came from for attribution and future updates.

### 2. Store Alternatives
Keep a list of other good videos you found but didn't use. Useful for:
- Future replacements
- A/B testing
- User preferences (let users choose their preferred demo)

### 3. Easy Switching
If you want to replace a video, you already have alternatives ready.

### 4. Embedding Support
Store YouTube URLs for direct embedding instead of downloading.

## Workflow

### Adding a New Video from YouTube

1. Find multiple good videos
2. Pick the best one as primary
3. Upload to Cloudinary (or embed directly)
4. Add entry to `video-sources.json`:

```json
{
  "NewExercise": {
    "primary": {
      "cloudinaryUrl": "https://...",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=primary123",
        "startTime": 5,
        "endTime": 15,
        "uploadedAt": "2025-01-16T14:00:00Z"
      },
      "fileSize": "2.1 MB",
      "duration": 10
    },
    "alternatives": [
      {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=alt456",
        "startTime": 0,
        "endTime": 0,
        "notes": "Backup option, different angle - full video"
      }
    ]
  }
}
```

### Switching to an Alternative

1. Pick an alternative from the list
2. Upload it to Cloudinary
3. Move current primary to alternatives
4. Update primary with new video

## Future: Direct Embedding

Instead of uploading to Cloudinary, you could embed videos directly:

```json
{
  "FireHydrant": {
    "primary": {
      "embedUrl": "https://www.youtube.com/embed/abc123?start=5&end=15",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=abc123",
        "startTime": 5,
        "endTime": 15
      }
    }
  }
}
```

This saves Cloudinary storage and bandwidth!
