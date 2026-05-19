# Cloudinary Upload Script

This script uploads all exercise GIF files from the `gifs/` directory to Cloudinary CDN.

## Prerequisites

1. **Cloudinary Account**: Sign up at https://cloudinary.com (free tier available)
2. **API Credentials**: Get from https://console.cloudinary.com/

## Setup

### 1. Set Environment Variables

```bash
export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_API_KEY="your-api-key"
export CLOUDINARY_API_SECRET="your-api-secret"
```

**To persist across sessions**, add to `~/.zshrc` or `~/.bashrc`:

```bash
echo 'export CLOUDINARY_CLOUD_NAME="your-cloud-name"' >> ~/.zshrc
echo 'export CLOUDINARY_API_KEY="your-api-key"' >> ~/.zshrc
echo 'export CLOUDINARY_API_SECRET="your-api-secret"' >> ~/.zshrc
source ~/.zshrc
```

### 2. Verify Setup

```bash
echo $CLOUDINARY_CLOUD_NAME
# Should output: your-cloud-name
```

## Usage

### Upload All GIFs

```bash
npm run upload
```

This will:
1. Find all `.gif` files in `gifs/` directory
2. Upload each to Cloudinary in the `exercises/` folder
3. Generate `migration-log.json` with URL mappings

### Expected Output

```
══════════════════════════════════════════════════════════════════════
CLOUDINARY GIF UPLOAD
══════════════════════════════════════════════════════════════════════
Cloud: your-cloud-name
══════════════════════════════════════════════════════════════════════

Found 82 GIF files to upload

Uploading: BarbellSquat.gif...
✓ Success: https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/BarbellSquat.gif

Uploading: Chinups.gif...
✓ Success: https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/Chinups.gif

...

══════════════════════════════════════════════════════════════════════
UPLOAD SUMMARY
══════════════════════════════════════════════════════════════════════
Total files: 82
✓ Successful: 82
✗ Failed: 0
══════════════════════════════════════════════════════════════════════

✓ Migration log saved to: migration-log.json

✅ All uploads completed successfully!
```

## Output: migration-log.json

The script creates a JSON file mapping each GIF filename to its Cloudinary URL:

```json
{
  "BarbellSquat.gif": "https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/BarbellSquat.gif",
  "Chinups.gif": "https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/Chinups.gif",
  "FailedFile.gif": {
    "error": "Upload failed: Network timeout"
  }
}
```

## Cloudinary Organization

All GIFs are uploaded to the `exercises/` folder in your Cloudinary account:

```
Cloudinary Media Library
└── exercises/
    ├── BarbellSquat.gif
    ├── Chinups.gif
    ├── DBSquatJumps.gif
    └── ... (82 total)
```

## Error Handling

### Missing Environment Variables

```
❌ Error: CLOUDINARY_CLOUD_NAME environment variable not set

Set it with: export CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

**Solution**: Set the missing environment variable

### Upload Failures

If some uploads fail, the script will:
1. Continue uploading remaining files
2. Log errors in `migration-log.json`
3. Print summary showing failed uploads
4. Exit with error code 1

**Common causes**:
- Network timeout
- Invalid API credentials
- File too large (>10MB on free tier)
- Rate limiting

**Solution**: Check `migration-log.json` for specific errors, fix the issue, and re-run the script

### No GIF Files Found

```
❌ Error: No GIF files found in gifs/ directory
```

**Solution**: Ensure you're running from the project root and `gifs/` directory exists

## Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

Your 82 GIFs (~50MB) are well within limits.

## Next Steps

After successful upload:

1. ✅ Verify uploads in Cloudinary console
2. ✅ Check `migration-log.json` for all URLs
3. ⏭️ Update `workouts.json` with Cloudinary URLs
4. ⏭️ Test in browser
5. ⏭️ Remove local GIF files

## Troubleshooting

### "Module not found" error

```bash
npm install
```

### "Permission denied" error

```bash
chmod +x scripts/upload-to-cloudinary.js
```

### API rate limiting

Wait a few minutes and try again. Cloudinary free tier has rate limits.

## Testing

Run tests:

```bash
npm test
```

Tests verify:
- URL format validation
- Error handling
- Migration log structure
