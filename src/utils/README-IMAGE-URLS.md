# Image URL Helper Functions

Helper functions for generating Cloudinary URLs with transformations and fallback logic.

## Usage

### In Browser (HTML)

```html
<script type="module">
  import { getExerciseImageUrl, getResponsiveUrl } from './src/utils/image-urls.js';
  
  // Set cloud name globally
  window.CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
  
  // Get exercise image URL
  const exercise = { name: 'Barbell Squat', gif: 'gifs/BarbellSquat.gif' };
  const imageUrl = getExerciseImageUrl(exercise);
  
  // Get responsive URL
  const responsiveUrl = getResponsiveUrl('BarbellSquat', 800);
</script>
```

### In Node.js (Tests/Scripts)

```javascript
import { generateCloudinaryUrl } from './src/utils/image-urls.js';

// Set cloud name via environment variable
process.env.CLOUDINARY_CLOUD_NAME = 'your-cloud-name';

const url = generateCloudinaryUrl('BarbellSquat', {
  width: 800,
  dpr: 'auto',
  format: 'auto'
});
```

## Functions

### `generateCloudinaryUrl(exerciseName, options)`

Generate a Cloudinary URL with optional transformations.

**Parameters:**
- `exerciseName` (string): Exercise name (e.g., "BarbellSquat")
- `options` (object): Transformation options
  - `width` (number): Target width in pixels
  - `dpr` (string|number): Device pixel ratio ('auto' or number)
  - `format` (string): Format ('auto' for automatic)
  - `quality` (number): Quality (1-100)

**Returns:** Cloudinary URL string

**Example:**
```javascript
generateCloudinaryUrl('BarbellSquat', {
  width: 800,
  dpr: 'auto',
  format: 'auto',
  quality: 85
});
// => https://res.cloudinary.com/demo/image/upload/w_800,dpr_auto,f_auto,q_85/v1/exercises/BarbellSquat.gif
```

### `getResponsiveUrl(exerciseName, width)`

Generate a responsive image URL with automatic format and DPR.

**Parameters:**
- `exerciseName` (string): Exercise name
- `width` (number): Target width in pixels (default: 800)

**Returns:** Cloudinary URL with responsive transformations

**Example:**
```javascript
getResponsiveUrl('BarbellSquat', 640);
// => https://res.cloudinary.com/demo/image/upload/w_640,dpr_auto,f_auto/v1/exercises/BarbellSquat.gif
```

### `getFallbackUrl()`

Get placeholder image URL for when exercise image is unavailable.

**Returns:** Placeholder image URL

**Example:**
```javascript
getFallbackUrl();
// => https://via.placeholder.com/800x600?text=Exercise+Image+Unavailable
```

### `getExerciseImageUrl(exercise)`

Get image URL for an exercise object from workouts.json.

**Parameters:**
- `exercise` (object): Exercise object with `name` and `gif` properties

**Returns:** Image URL (Cloudinary or fallback)

**Example:**
```javascript
const exercise = { name: 'Squat', gif: 'gifs/BarbellSquat.gif' };
getExerciseImageUrl(exercise);
// => https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif

// Already migrated to Cloudinary
const migratedExercise = {
  name: 'Squat',
  gif: 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif'
};
getExerciseImageUrl(migratedExercise);
// => https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif (unchanged)
```

### `parseCloudinaryUrl(url)`

Parse a Cloudinary URL into components.

**Parameters:**
- `url` (string): Cloudinary URL

**Returns:** Object with components or null if invalid

**Example:**
```javascript
parseCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/w_800/v1/exercises/BarbellSquat.gif');
// => {
//   cloudName: 'demo',
//   resourceType: 'image',
//   transformations: 'w_800',
//   version: 1,
//   folder: 'exercises',
//   publicId: 'BarbellSquat',
//   extension: 'gif'
// }
```

### `formatCloudinaryUrl(components)`

Format URL components back into a Cloudinary URL.

**Parameters:**
- `components` (object): URL components from `parseCloudinaryUrl`

**Returns:** Formatted Cloudinary URL

**Example:**
```javascript
const components = {
  cloudName: 'demo',
  resourceType: 'image',
  transformations: 'w_800',
  version: 1,
  folder: 'exercises',
  publicId: 'BarbellSquat',
  extension: 'gif'
};
formatCloudinaryUrl(components);
// => https://res.cloudinary.com/demo/image/upload/w_800/v1/exercises/BarbellSquat.gif
```

## Cloudinary Transformations

### Width
```javascript
{ width: 800 }  // => w_800
```

### Device Pixel Ratio
```javascript
{ dpr: 2 }      // => dpr_2
{ dpr: 'auto' } // => dpr_auto (automatic based on device)
```

### Format
```javascript
{ format: 'auto' } // => f_auto (automatic: WebP for Chrome, JPEG for others)
```

### Quality
```javascript
{ quality: 85 } // => q_85 (1-100, default: auto)
```

### Combined
```javascript
{
  width: 800,
  dpr: 'auto',
  format: 'auto',
  quality: 85
}
// => w_800,dpr_auto,f_auto,q_85
```

## Error Handling

All functions handle errors gracefully:

- **Null/undefined exercise name** → Returns fallback URL
- **Invalid GIF path** → Returns fallback URL
- **Already migrated URL** → Returns as-is
- **Invalid Cloudinary URL** → `parseCloudinaryUrl` returns null
- **Missing components** → `formatCloudinaryUrl` throws error

## Testing

Run tests:
```bash
npm test
```

Tests cover:
- URL generation with all transformation options
- Fallback behavior
- URL parsing and formatting
- Round-trip (parse → format → parse)
- Error handling

## Performance

- **URL generation**: O(1) - simple string concatenation
- **URL parsing**: O(1) - single regex match
- **Fallback**: O(1) - returns constant string

No network requests are made by these functions.
