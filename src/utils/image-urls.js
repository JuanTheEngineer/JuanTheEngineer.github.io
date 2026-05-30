/**
 * Image URL Helper Functions for Cloudinary Integration
 * 
 * These utilities help generate, parse, and format Cloudinary URLs
 * for exercise images/GIFs with responsive transformations.
 */

/**
 * Get the Cloudinary cloud name from environment
 * @returns {string} Cloud name
 */
function getCloudName() {
  return process.env.CLOUDINARY_CLOUD_NAME || '';
}

/**
 * Generate a Cloudinary URL for an exercise image
 * 
 * @param {string} exerciseName - Name of the exercise (e.g., "BarbellSquat")
 * @param {Object} options - Transformation options
 * @param {number} [options.width] - Width in pixels
 * @param {number|string} [options.dpr] - Device pixel ratio (number or 'auto')
 * @param {string} [options.format] - Format (e.g., 'auto', 'webp', 'jpg')
 * @param {number} [options.quality] - Quality (1-100)
 * @returns {string} Cloudinary URL
 */
export function generateCloudinaryUrl(exerciseName, options = {}) {
  // Return fallback for invalid input
  if (!exerciseName || typeof exerciseName !== 'string' || exerciseName.trim() === '') {
    return getFallbackUrl();
  }

  const cloudName = getCloudName();
  if (!cloudName) {
    return getFallbackUrl();
  }

  // Build transformation string
  const transformations = [];
  
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  }
  
  if (options.format) {
    transformations.push(`f_${options.format}`);
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }

  // Build URL parts
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transformationStr = transformations.length > 0 ? `${transformations.join(',')}/` : '';
  const resourcePath = `v1/exercises/${exerciseName}.gif`;

  return `${baseUrl}/${transformationStr}${resourcePath}`;
}

/**
 * Generate a responsive Cloudinary URL with default optimizations
 * 
 * @param {string} exerciseName - Name of the exercise
 * @param {number} [width=800] - Width in pixels
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
 * Get fallback URL for when image is unavailable
 * 
 * @returns {string} Placeholder image URL
 */
export function getFallbackUrl() {
  return 'https://via.placeholder.com/800x600?text=Exercise+Image+Unavailable';
}

/**
 * Get the appropriate image URL for an exercise object
 * Handles both local GIF paths and Cloudinary URLs
 * 
 * @param {Object} exercise - Exercise object with name and gif properties
 * @param {string} exercise.name - Exercise name
 * @param {string} exercise.gif - GIF path or URL
 * @returns {string} Image URL
 */
export function getExerciseImageUrl(exercise) {
  // Validate input
  if (!exercise || typeof exercise !== 'object') {
    return getFallbackUrl();
  }

  if (!exercise.name || !exercise.gif) {
    return getFallbackUrl();
  }

  const gifPath = exercise.gif;

  // If already a Cloudinary URL, return as-is
  if (gifPath.includes('cloudinary.com')) {
    return gifPath;
  }

  // Extract filename from local path (e.g., "gifs/BarbellSquat.gif" -> "BarbellSquat")
  const filename = gifPath.split('/').pop(); // Get last part
  const exerciseName = filename.replace('.gif', ''); // Remove extension

  // Generate Cloudinary URL
  return generateCloudinaryUrl(exerciseName);
}

/**
 * Parse a Cloudinary URL into its components
 * 
 * @param {string} url - Cloudinary URL
 * @returns {Object|null} Parsed components or null if invalid
 */
export function parseCloudinaryUrl(url) {
  // Validate input
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return null;
  }

  try {
    // Regex to parse Cloudinary URL structure
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/v{version}/{folder}/{publicId}.{extension}
    const regex = /https:\/\/res\.cloudinary\.com\/([^/]+)\/([^/]+)\/upload\/(?:([^/]+)\/)?v(\d+)\/(?:([^/]+)\/)?([^/.]+)\.([^?]+)/;
    const match = url.match(regex);

    if (!match) {
      return null;
    }

    const [, cloudName, resourceType, transformations, version, folder, publicId, extension] = match;

    return {
      cloudName,
      resourceType,
      transformations: transformations || '',
      version: parseInt(version, 10),
      folder: folder || '',
      publicId,
      extension
    };
  } catch (error) {
    return null;
  }
}

/**
 * Format Cloudinary URL components back into a URL string
 * 
 * @param {Object} components - URL components
 * @param {string} components.cloudName - Cloud name
 * @param {string} [components.resourceType='image'] - Resource type
 * @param {string} [components.transformations=''] - Transformation string
 * @param {number} [components.version=1] - Version number
 * @param {string} [components.folder=''] - Folder path
 * @param {string} components.publicId - Public ID
 * @param {string} [components.extension='gif'] - File extension
 * @returns {string} Formatted Cloudinary URL
 * @throws {Error} If required components are missing
 */
export function formatCloudinaryUrl(components) {
  // Validate required components
  if (!components || !components.cloudName || !components.publicId) {
    throw new Error('Invalid components: cloudName and publicId are required');
  }

  const {
    cloudName,
    resourceType = 'image',
    transformations = '',
    version = 1,
    folder = '',
    publicId,
    extension = 'gif'
  } = components;

  // Build URL parts
  const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;
  const transformationPart = transformations ? `${transformations}/` : '';
  const versionPart = `v${version}`;
  const folderPart = folder ? `${folder}/` : '';
  const filePart = `${publicId}.${extension}`;

  return `${baseUrl}/${transformationPart}${versionPart}/${folderPart}${filePart}`;
}
