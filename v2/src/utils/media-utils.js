// Media source utilities: detect type, parse URLs, build thumbnails

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
 */
export function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Build YouTube thumbnail URL (no API call needed)
 * Quality options: default, mqdefault, hqdefault, sddefault, maxresdefault
 */
export function getYouTubeThumbnail(url, quality = 'hqdefault') {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}

/**
 * Build YouTube embed URL with optional start/end time.
 * If both startTime and endTime are > 0 and startTime >= endTime, the range
 * is invalid — ignore both and play the full video.
 * A value of 0 means "no constraint" for that boundary.
 */
export function getYouTubeEmbedUrl(url, options = {}) {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  });

  const start = Math.floor(options.startTime || 0);
  const end = Math.floor(options.endTime || 0);

  // Validate: if both > 0 and start >= end, the range is invalid — skip both
  const isValid = !(start > 0 && end > 0 && start >= end);

  if (isValid && start > 0) params.set('start', String(start));
  if (isValid && end > 0) params.set('end', String(end));

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

/**
 * Apply Cloudinary transformations for responsive images/videos
 * Inserts transformation params after /upload/
 */
export function transformCloudinaryUrl(url, transformation = 'w_800,q_auto,f_auto') {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/${transformation}/`);
}

/**
 * Determine if a source should render as a native video element vs image vs iframe
 */
export function getRenderStrategy(source) {
  if (!source || !source.type) return 'unknown';

  // YouTube/TikTok/Vimeo always use iframe (lazy-loaded)
  if (['youtube', 'tiktok', 'vimeo'].includes(source.type)) {
    return 'embed';
  }

  // Cloudinary or local: decide by mediaType/format
  const isVideo = source.mediaType === 'video' || ['mp4', 'webm', 'mov'].includes(source.format);
  // Note: GIFs render as <img> even though we mark them as video mediaType
  if (source.format === 'gif') return 'image';
  return isVideo ? 'video' : 'image';
}

/**
 * Pick the primary source from an array of sources.
 * Falls back to first item if no isPrimary flag is set.
 */
export function pickPrimarySource(sources) {
  if (!sources || sources.length === 0) return null;
  return sources.find((s) => s.isPrimary) || sources[0];
}
