# Cloudinary Setup Guide

Quick guide to get your Cloudinary credentials and upload GIFs.

## Step 1: Create Cloudinary Account (5 minutes)

1. Go to https://cloudinary.com/users/register_free
2. Sign up (free tier includes 25GB storage + 25GB bandwidth)
3. Verify your email

## Step 2: Get API Credentials (2 minutes)

1. Go to https://console.cloudinary.com/
2. On the dashboard, you'll see:
   - **Cloud name**: (e.g., `dxyz123abc`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: Click "Reveal" to see it

## Step 3: Set Environment Variables (1 minute)

```bash
export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_API_KEY="your-api-key"
export CLOUDINARY_API_SECRET="your-api-secret"
```

**To persist across sessions**, add to `~/.zshrc`:

```bash
echo 'export CLOUDINARY_CLOUD_NAME="your-cloud-name"' >> ~/.zshrc
echo 'export CLOUDINARY_API_KEY="your-api-key"' >> ~/.zshrc
echo 'export CLOUDINARY_API_SECRET="your-api-secret"' >> ~/.zshrc
source ~/.zshrc
```

## Step 4: Verify Setup

```bash
echo $CLOUDINARY_CLOUD_NAME
# Should output: your-cloud-name
```

## Step 5: Upload GIFs

```bash
npm run upload
```

This will:
- Upload all 82 GIFs from `gifs/` directory
- Create `migration-log.json` with URL mappings
- Take ~5-10 minutes

## Expected Output

```
══════════════════════════════════════════════════════════════════════
CLOUDINARY GIF UPLOAD
══════════════════════════════════════════════════════════════════════
Cloud: your-cloud-name
══════════════════════════════════════════════════════════════════════

Found 82 GIF files to upload

Uploading: BarbellSquat.gif...
✓ Success: https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/BarbellSquat.gif

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

## Step 6: Verify in Cloudinary Console

1. Go to https://console.cloudinary.com/console/media_library
2. Navigate to `exercises/` folder
3. You should see all 82 GIFs

## Troubleshooting

### "Environment variable not set"
Make sure you exported the variables in the current terminal session.

### "No GIF files found"
Make sure you're running from the project root directory.

### Upload failures
Check `migration-log.json` for specific error messages. Common issues:
- Network timeout (retry)
- File too large (>10MB on free tier)
- Invalid credentials

## Next Steps

After successful upload:
1. ✅ Check `migration-log.json` - all 82 entries should have URLs
2. ✅ Verify in Cloudinary console
3. ⏭️ Continue to Task 5: Update workouts.json with Cloudinary URLs
