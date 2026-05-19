/**
 * Image URL Helper Functions
 * 
 * Generates Cloudinary URLs with transformations and fallback logic.
 * Used by the UI to display exercise images from Cloudinary CDN.
 */

/**
 * Get Cloudinary cloud name from environment or default
 * @returns {string} Cloud name
 */
function getCloudName() {
  // In browser, this would be set as a global variable
  // In Node.js tests, use environment variable
  if (typeof window !== 'undefined' && window.CLOUDINARY_CLOUD_NAME) {
    return window.CLOUDINARY_CLOUD_NAME;
  }
  return process.env.CLOUDINARY_CLOUD_NAME || 'demo';
}

/**
 * Generate Cloudinary URL for an exercise
 * @param {string} exerciseName - Exercise name (e.g., "BarbellSquat")
 * @param {Object} options - Transformation options
 * @param {number} options.width - Target width in pixels
 * @param {string|number} options.dpr - Device pixel ratio ('auto' or number)
 * @param {string} options.format - Format ('auto' for automatic)
 * @returns {string} Cloudinary URL
 */
export function generateCloudinaryUrl(exerciseName, options = {}) {
  if (!exerciseName) {
    return getFallbackUrl();
  }
  
  const cloudName = getCloudName();
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  // Build transformation string
  const transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.dpr) transformations.push(`dpr_${options.dpr}`);
  if (options.format === 'auto') transformations.push('f_auto');
  if (options.quality) transformations.push(`q_${options.quality}`);
  
  const transformStr = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';
  
  return `${baseUrl}/${transformStr}v1/exercises/${exerciseName}.gif`;
}

/**
 * Generate responsive image URL
 * @param {string} exerciseName - Exercise name
 * @param {number} width - Target width in pixels (default: 800)
 * @returns {string} Cloudinary URL with responsive transformations
 */
export function getResponsiveUrl(exerciseName, width = 800) {
  return generateCloudinaryUrl(exerciseName, {
    width,
    dpr: 'auto',
    format: 'auto'
  });
}

/**
 * Get fallback image URL
 * @returns {string} Placeholder image URL
 */
export function getFallbackUrl() {
  return 'https://via.placeholder.com/800x600?text=Exercise+Image+Unavailable';
}

/**
 * Get exercise image URL with fallback
 * @param {Object} exercise - Exercise object from workouts.json
 * @returns {string} Image URL
 */
export function getExerciseImageUrl(exercise) {
  if (!exercise || !exercise.name) {
    return getFallbackUrl();
  }
  
  // Extract exercise name from GIF path
  const gifPath = exercise.gif || '';
  
  // Handle Cloudinary URLs (already migrated)
  if (gifPath.includes('cloudinary.com')) {
    return gifPath;
  }
  
  // Handle local GIF paths (not yet migrated)
  const match = gifPath.match(/\/([^\/]+)\.gif$/);
  const exerciseName = match ? match[1] : null;
  
  if (!exerciseName) {
    return getFallbackUrl();
  }
  
  return generateCloudinaryUrl(exerciseName);
}

/**
 * Parse Cloudinary URL into components
 * @param {string} url - Cloudinary URL
 * @returns {Object|null} Parsed URL components or null if invalid
 */
export function parseCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // Pattern: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/v{version}/{folder}/{publicId}.{ext}
  const pattern = /^https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/(?:([^\/]+)\/)?v(\d+)\/(.+)$/;
  const match = url.match(pattern);
  
  if (!match) {
    return null;
  }
  
  const [, cloudName, transformations, version, pathWithExt] = match;
  const lastSlash = pathWithExt.lastIndexOf('/');
  const folder = lastSlash > -1 ? pathWithExt.substring(0, lastSlash) : '';
  const fileWithExt = lastSlash > -1 ? pathWithExt.substring(lastSlash + 1) : pathWithExt;
  const lastDot = fileWithExt.lastIndexOf('.');
  const publicId = lastDot > -1 ? fileWithExt.substring(0, lastDot) : fileWithExt;
  const extension = lastDot > -1 ? fileWithExt.substring(lastDot + 1) : '';
  
  return {
    cloudName,
    resourceType: 'image',
    transformations: transformations || '',
    version: parseInt(version, 10),
    folder,
    publicId,
    extension
  };
}

/**
 * Format Cloudinary URL components back into URL string
 * @param {Object} components - URL components from parseCloudinaryUrl
 * @returns {string} Formatted Cloudinary URL
 */
export function formatCloudinaryUrl(components) {
  if (!components || !components.cloudName || !components.publicId) {
    throw new Error('Invalid components: cloudName and publicId are required');
  }
  
  const { cloudName, resourceType, transformations, version, folder, publicId, extension } = components;
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType || 'image'}/upload`;
  const transformStr = transformations ? `${transformations}/` : '';
  const versionStr = `v${version || 1}`;
  const folderStr = folder ? `${folder}/` : '';
  const ext = extension || 'gif';
  
  return `${baseUrl}/${transformStr}${versionStr}/${folderStr}${publicId}.${ext}`;
}
