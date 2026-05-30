// MediaPlayer: smooth multi-source media renderer
// Handles cloudinary (gif/mp4), youtube (click-to-play), local files
import {
  getYouTubeThumbnail,
  getYouTubeEmbedUrl,
  transformCloudinaryUrl,
  getRenderStrategy
} from '../utils/media-utils.js';

/**
 * Render a single media source into the given container.
 * Caller controls when/how to swap sources.
 *
 * @param {HTMLElement} container - The element to render into
 * @param {Object} source - Source object from exercises.json
 * @param {Object} options - { autoplay, className }
 */
export function renderMedia(container, source, options = {}) {
  if (!source) {
    container.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No media</div>`;
    return;
  }

  const strategy = getRenderStrategy(source);
  // Show full media without cropping. max-h prevents tall portrait videos
  // from overflowing the viewport on mobile.
  const className = options.className || 'w-full max-h-[60vh] object-contain rounded-2xl bg-slate-800';

  // Fade in once loaded
  container.classList.add('animate-fade-in');

  switch (strategy) {
    case 'image':
      renderImage(container, source, className, options.onError);
      break;
    case 'video':
      renderVideo(container, source, className, options.autoplay, options.onError);
      break;
    case 'embed':
      renderEmbed(container, source, className, options.onEmbedPlay);
      break;
    default:
      container.innerHTML = `<div class="${className} flex items-center justify-center text-slate-500 text-sm">Unsupported media type</div>`;
  }
}

function renderImage(container, source, className, onError) {
  const url = source.type === 'cloudinary' ? transformCloudinaryUrl(source.url, 'w_800,q_auto,f_auto') : source.url;

  container.innerHTML = `
    <img
      src="${url}"
      alt="Exercise demonstration"
      class="${className}"
      loading="lazy"
      decoding="async"
    />
  `;
  if (onError) {
    const img = container.querySelector('img');
    img?.addEventListener('error', () => onError(), { once: true });
  }
}

function renderVideo(container, source, className, autoplay = true, onError) {
  const url = source.type === 'cloudinary' ? transformCloudinaryUrl(source.url, 'w_800,q_auto,f_auto') : source.url;

  const startAttr = source.startTime ? `#t=${source.startTime}` : '';

  container.innerHTML = `
    <video
      src="${url}${startAttr}"
      class="${className}"
      ${autoplay ? 'autoplay' : ''}
      loop
      muted
      playsinline
      preload="metadata"
    ></video>
  `;
  if (onError) {
    const video = container.querySelector('video');
    video?.addEventListener('error', () => onError(), { once: true });
  }
}

function renderEmbed(container, source, className, onEmbedPlay) {
  // Embeds (iframes) must have an explicit aspect ratio.
  // Default to portrait 9:16 for "shorts" URLs, otherwise 16:9.
  const isShorts = (source.url || '').includes('/shorts/');
  const aspectClass = isShorts ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video';
  const wrappedClassName = `${aspectClass} w-full rounded-2xl overflow-hidden bg-slate-900`;

  // Click-to-play pattern: show thumbnail, load iframe only on tap
  const thumb = source.type === 'youtube' ? getYouTubeThumbnail(source.url, 'hqdefault') : null;

  container.innerHTML = `
    <div class="${wrappedClassName} relative">
      <button
        class="group absolute inset-0 flex items-center justify-center overflow-hidden touch-manipulation"
        data-action="play-embed"
        aria-label="Play video"
      >
        ${thumb ? `<img src="${thumb}" alt="Video thumbnail" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />` : ''}
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
        <div class="relative z-10 w-16 h-16 rounded-full bg-brand-500 group-active:scale-95 transition-transform flex items-center justify-center shadow-2xl">
          <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span class="absolute bottom-3 right-3 text-xs text-white/80 bg-black/60 px-2 py-1 rounded-full z-10">
          ${source.type === 'youtube' ? 'YouTube' : source.type}
        </span>
      </button>
    </div>
  `;

  // Wire up click-to-play
  const button = container.querySelector('[data-action="play-embed"]');
  if (button) {
    button.addEventListener(
      'click',
      () => {
        const embedUrl =
          source.type === 'youtube'
            ? getYouTubeEmbedUrl(source.url, { startTime: source.startTime, endTime: source.endTime })
            : source.url;

        container.innerHTML = `
        <div class="${wrappedClassName} relative">
          <iframe
            src="${embedUrl}"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;
        onEmbedPlay?.();
      },
      { once: true }
    );
  }
}
