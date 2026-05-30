# Image URL Utilities

Helper functions for generating and managing Cloudinary image URLs with responsive transformations.

## Overview

This module provides utilities to:
- Generate Cloudinary URLs with transformations
- Parse existing Cloudinary URLs
- Handle fallback images
- Support responsive images with automatic format/DPR optimization

## Functions

### `generateCloudinaryUrl(exerciseName, options)`

Generate a Cloudinary URL for an exercise image.

**Parameters:**
- `exerciseName` (string): Name of the exercise (e.g., "BarbellSquat")
- `options` (object): Transformation options
  - `width` (number): Width in pixels
  - `dpr` (number|string): Device pixel ratio (number or 'auto')
  - `format` (string): Format (e.g., 'auto', 'webp', 'jpg')
  - `quality` (number): Quality (1-100)

**Returns:** Cloudinary URL string

**Example:**
```javascript
import { generateCloudinaryUrl } from './utils/image-urls.js';

// Basic URL
const url = generateCloudinaryUrl('BarbellSquat');
// https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/BarbellSquat.gif

// With transformations
const responsiveUrl = generateCloudinaryUrl('BarbellSquat', {
  width: 800,
  dpr: 'auto',
  format: 'auto',
  quality: 85
});
// https://res.cloudinary.com/your-cloud/image/upload/w_800,dpr_auto,f_auto,q_85/v1/exercises/BarbellSquat.gif
```

---

### `getResponsiveUrl(exerciseName, width)`

Generate a responsive Cloudinary URL with default optimizations (auto DPR and format).

**Parameters:**
- `exerciseName` (string): Name of the exercise
- `width` (number, optional): Width in pixels (default: 800)

**Returns:** Cloudinary URL string with responsive transformations

**Example:**
```javascript
import { getResponsiveUrl } from './utils/image-urls.js';

const url = getResponsiveUrl('BarbellSquat', 640);
// https://res.cloudinary.com/your-cloud/image/upload/w_640,dpr_auto,f_auto/v1/exercises/BarbellSquat.gif
```

---

### `getFallbackUrl()`

Get a placeholder image URL for when the exercise image is unavailable.

**Returns:** Placeholder image URL string

**Example:**
```javascript
import { getFallbackUrl } from './utils/image-urls.js';

const fallback = getFallbackUrl();
// https://via.placeholder.com/800x600?text=Exercise+Image+Unavailable
```

---

### `getExerciseImageUrl(exercise)`

Get the appropriate image URL for an exercise object. Handles both local GIF paths and Cloudinary URLs.

**Parameters:**
- `exercise` (object): Exercise object
  - `name` (string): Exercise name
  - `gif` (string): GIF path or URL

**Returns:** Image URL string

**Example:**
```javascript
import { getExerciseImageUrl } from './utils/image-urls.js';

// Local GIF path (pre-migration)
const exercise1 = {
  name: 'Barbell Squat',
  gif: 'gifs/BarbellSquat.gif'
};
const url1 = getExerciseImageUrl(exercise1);
// https://res.cloudinary.com/your-cloud/image/upload/v1/exercises/BarbellSquat.gif

// Already migrated to Cloudinary
const exercise2 = {
  name: 'Barbell Squat',
  gif: 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif'
};
const url2 = getExerciseImageUrl(exercise2);
// https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif (unchanged)
```

---

### `parseCloudinaryUrl(url)`

Parse a Cloudinary URL into its components.

**Parameters:**
- `url` (string): Cloudinary URL

**Returns:** Object with components or null if invalid
- `cloudName` (string): Cloud name
- `resourceType` (string): Resource type (e.g., 'image')
- `transformations` (string): Transformation string
- `version` (number): Version number
- `folder` (string): Folder path
- `publicId` (string): Public ID
- `extension` (string): File extension

**Example:**
```javascript
import { parseCloudinaryUrl } from './utils/image-urls.js';

const url = 'https://res.cloudinary.com/demo/image/upload/w_800,dpr_auto/v1/exercises/BarbellSquat.gif';
const parsed = parseCloudinaryUrl(url);
/*
{
  cloudName: 'demo',
  resourceType: 'image',
  transformations: 'w_800,dpr_auto',
  version: 1,
  folder: 'exercises',
  publicId: 'BarbellSquat',
  extension: 'gif'
}
*/
```

---

### `formatCloudinaryUrl(components)`

Format Cloudinary URL components back into a URL string.

**Parameters:**
- `components` (object): URL components
  - `cloudName` (string, required): Cloud name
  - `resourceType` (string, optional): Resource type (default: 'image')
  - `transformations` (string, optional): Transformation string
  - `version` (number, optional): Version number (default: 1)
  - `folder` (string, optional): Folder path
  - `publicId` (string, required): Public ID
  - `extension` (string, optional): File extension (default: 'gif')

**Returns:** Formatted Cloudinary URL string

**Throws:** Error if required components are missing

**Example:**
```javascript
import { formatCloudinaryUrl } from './utils/image-urls.js';

const components = {
  cloudName: 'demo',
  resourceType: 'image',
  transformations: 'w_800,dpr_auto',
  version: 1,
  folder: 'exercises',
  publicId: 'BarbellSquat',
  extension: 'gif'
};

const url = formatCloudinaryUrl(components);
// https://res.cloudinary.com/demo/image/upload/w_800,dpr_auto/v1/exercises/BarbellSquat.gif
```

---

## Environment Variables

The module requires the following environment variable:

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name

**Setup:**
```bash
# .env file
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Use Cases

### 1. Responsive Images

Generate URLs that automatically adapt to device capabilities:

```javascript
import { getResponsiveUrl } from './utils/image-urls.js';

// Mobile
const mobileUrl = getResponsiveUrl('BarbellSquat', 400);

// Desktop
const desktopUrl = getResponsiveUrl('BarbellSquat', 800);

// Retina displays automatically get 2x resolution with dpr_auto
```

### 2. Migration Support

Handle both old (local) and new (Cloudinary) URLs:

```javascript
import { getExerciseImageUrl } from './utils/image-urls.js';

// Works with both formats
const exercises = [
  { name: 'Squat', gif: 'gifs/BarbellSquat.gif' },  // Local
  { name: 'Lunge', gif: 'https://res.cloudinary.com/demo/...' }  // Cloudinary
];

exercises.forEach(exercise => {
  const url = getExerciseImageUrl(exercise);
  console.log(url);  // Always returns a valid URL
});
```

### 3. URL Manipulation

Parse and modify existing Cloudinary URLs:

```javascript
import { parseCloudinaryUrl, formatCloudinaryUrl } from './utils/image-urls.js';

const originalUrl = 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif';

// Parse
const components = parseCloudinaryUrl(originalUrl);

// Modify
components.transformations = 'w_400,dpr_2,f_webp';

// Format back
const newUrl = formatCloudinaryUrl(components);
// https://res.cloudinary.com/demo/image/upload/w_400,dpr_2,f_webp/v1/exercises/BarbellSquat.gif
```

### 4. Error Handling

Gracefully handle missing or invalid images:

```javascript
import { getExerciseImageUrl, getFallbackUrl } from './utils/image-urls.js';

function renderExercise(exercise) {
  const imageUrl = getExerciseImageUrl(exercise);
  
  // If exercise is invalid, getExerciseImageUrl returns fallback automatically
  return `<img src="${imageUrl}" alt="${exercise?.name || 'Exercise'}" />`;
}
```

---

## Testing

Run the test suite:

```bash
npm test -- tests/image-urls.test.js
```

The test suite covers:
- URL generation with various transformations
- Responsive URL generation
- Fallback handling
- Exercise URL extraction
- URL parsing and formatting
- Round-trip parsing/formatting
- Error cases

---

## Cloudinary Transformations

Common transformation parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `w_` | Width | `w_800` |
| `h_` | Height | `h_600` |
| `dpr_` | Device Pixel Ratio | `dpr_2` or `dpr_auto` |
| `f_` | Format | `f_auto`, `f_webp`, `f_jpg` |
| `q_` | Quality | `q_80` (1-100) |
| `c_` | Crop mode | `c_fill`, `c_fit`, `c_scale` |

**Learn more:** [Cloudinary Transformation Reference](https://cloudinary.com/documentation/image_transformation_reference)

---

## Migration Strategy

This utility supports a gradual migration from local GIFs to Cloudinary:

1. **Phase 1**: Use `getExerciseImageUrl()` everywhere
   - Works with both local and Cloudinary URLs
   - No code changes needed when migrating

2. **Phase 2**: Upload GIFs to Cloudinary
   - Run upload script
   - Update `workouts.json` with Cloudinary URLs

3. **Phase 3**: Remove local GIFs
   - Delete `/gifs/` directory
   - Commit changes

The utility functions ensure backward compatibility throughout the migration.

---

## Performance Considerations

### Automatic Optimizations

Using `getResponsiveUrl()` enables:
- **Auto format**: Serves WebP to supported browsers, falls back to GIF
- **Auto DPR**: Serves 2x images to retina displays automatically
- **Lazy loading**: Combine with `loading="lazy"` attribute

### Example Implementation

```javascript
import { getResponsiveUrl } from './utils/image-urls.js';

function ExerciseImage({ exercise }) {
  const url = getResponsiveUrl(exercise.name, 800);
  
  return (
    <img
      src={url}
      alt={exercise.name}
      loading="lazy"
      width="800"
      height="600"
    />
  );
}
```

### CDN Benefits

Cloudinary provides:
- Global CDN with edge caching
- Automatic compression
- Format conversion
- Responsive images
- ~50-80% file size reduction vs local GIFs

---

## Troubleshooting

### "Invalid components" Error

Ensure `cloudName` and `publicId` are provided when using `formatCloudinaryUrl()`:

```javascript
// ❌ Missing required fields
formatCloudinaryUrl({ folder: 'exercises' });

// ✅ Correct
formatCloudinaryUrl({
  cloudName: 'demo',
  publicId: 'BarbellSquat'
});
```

### Fallback Images Appearing

If you see placeholder images:
1. Check `CLOUDINARY_CLOUD_NAME` environment variable is set
2. Verify exercise has valid `name` and `gif` properties
3. Ensure Cloudinary URLs are correctly formatted

### URL Parsing Returns Null

`parseCloudinaryUrl()` returns `null` for:
- Non-Cloudinary URLs
- Malformed URLs
- Non-string inputs

Always check the return value:

```javascript
const parsed = parseCloudinaryUrl(url);
if (!parsed) {
  console.error('Invalid Cloudinary URL');
  return;
}
```

---

## Future Enhancements

Potential improvements:
- Video support (MP4 instead of GIF)
- Thumbnail generation
- Lazy loading utilities
- Srcset generation for `<picture>` elements
- Blur-up placeholder technique
- Progressive image loading

---

## Related Documentation

- [CLOUDINARY-SETUP.md](../../CLOUDINARY-SETUP.md) - Setup instructions
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
