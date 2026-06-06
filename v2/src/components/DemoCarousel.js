// DemoCarousel: progressive reveal — demos appear as they load
// Only loaded demos get a spot. Maintains original order. Auto-focuses to first demo.
import { renderMedia } from './MediaPlayer.js';

/**
 * Render a carousel of demos into the container.
 * Demos load in parallel. Only ready ones appear. Order preserved.
 * If user hasn't swiped, auto-scrolls to the highest-priority (first) demo.
 */
export function renderDemoCarousel(container, demos) {
  const allItems = sortDemos((demos || []).filter(Boolean));
  if (allItems.length === 0) {
    container.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>`;
    return;
  }

  // Track which items are ready, preserving original order
  const readySet = new Set();
  let userHasSwiped = false;

  // Instant types (embeds with thumbnails) are ready immediately
  const instantTypes = new Set(['youtube', 'tiktok', 'vimeo']);
  allItems.forEach((item, i) => {
    if (instantTypes.has(item.type)) readySet.add(i);
  });

  // If any are ready now, build carousel immediately
  if (readySet.size > 0) {
    buildFromReady();
  } else {
    // Show pixel lifter until something loads
    container.innerHTML = `
      <div data-region="loader" class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
        <div class="demo-loader" aria-label="Loading demo"></div>
      </div>
    `;
  }

  // Probe-load all non-instant items in parallel
  allItems.forEach((item, i) => {
    if (instantTypes.has(item.type)) return; // already ready
    probeLoad(item, (success) => {
      if (success) {
        readySet.add(i);
        buildFromReady();
      }
      // If failed, just don't add it — it never gets a spot
    });
  });

  // Fallback: after 6s, if nothing loaded, just render everything and let browser handle errors
  setTimeout(() => {
    if (readySet.size === 0) {
      allItems.forEach((_, i) => readySet.add(i));
      buildFromReady();
    }
  }, 6000);

  // --- Core: rebuild carousel from ready items in original order ---
  function buildFromReady() {
    const readyItems = allItems.filter((_, i) => readySet.has(i));
    if (readyItems.length === 0) return;

    // Find what index to focus on: first item in original order
    const firstReadyOriginalIdx = allItems.findIndex((_, i) => readySet.has(i));
    const focusIdx = userHasSwiped ? -1 : readyItems.indexOf(allItems[firstReadyOriginalIdx]);

    renderCarousel(container, readyItems, focusIdx >= 0 ? focusIdx : 0, (swiped) => {
      userHasSwiped = userHasSwiped || swiped;
    });
  }
}

/**
 * Probe if a media item can load. Calls onDone(true) on success, onDone(false) on error.
 */
function probeLoad(item, onDone) {
  const url = item.url;
  if (!url) { onDone(false); return; }

  const isVideo = item.mediaType === 'video' || ['mp4', 'webm', 'mov'].includes(item.format);

  if (isVideo) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.addEventListener('loadeddata', () => onDone(true), { once: true });
    video.addEventListener('error', () => onDone(false), { once: true });
  } else {
    const img = new Image();
    img.src = url;
    if (img.complete && img.naturalWidth > 0) { onDone(true); return; }
    img.addEventListener('load', () => onDone(true), { once: true });
    img.addEventListener('error', () => onDone(false), { once: true });
  }
}

/**
 * Build the scroll-snap carousel with given ready items.
 */
function renderCarousel(container, items, focusIndex, onSwipe) {
  let activeIndex = clampIndex(focusIndex, items.length);

  container.innerHTML = `
    <div class="relative">
      <div
        data-region="track"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3 pb-1"
        style="scroll-snap-stop: always;"
      ></div>
      ${items.length > 1 ? `
        <div class="flex items-center justify-center gap-1.5 mt-3" data-region="dots"></div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 mt-2 leading-relaxed min-h-4"></p>
      ` : ''}
    </div>
  `;

  const track = container.querySelector('[data-region="track"]');
  const dotsContainer = container.querySelector('[data-region="dots"]');
  const caption = container.querySelector('[data-region="caption"]');
  track.style.scrollbarWidth = 'none';

  const playingEmbedSlides = new Set();

  // Render all ready slides
  items.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'shrink-0 w-full snap-center';
    renderMedia(slide, item, {
      onError: () => {
        slide.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">Couldn't load</div>`;
      },
      onEmbedPlay: () => playingEmbedSlides.add(i)
    });
    track.appendChild(slide);
  });

  const updateDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = items
      .map((_, i) => `
        <button data-dot-index="${i}" aria-label="Demo ${i + 1}" class="p-1.5 -m-1.5 group touch-manipulation">
          <span class="block w-1 h-1 rounded-full transition-colors ${i === activeIndex ? 'bg-brand-400' : 'bg-slate-600 group-hover:bg-slate-500'}"></span>
        </button>`)
      .join('');
    dotsContainer.querySelectorAll('[data-dot-index]').forEach((el) => {
      el.addEventListener('click', () => {
        onSwipe(true);
        const idx = Number(el.dataset.dotIndex);
        const slide = track.children[idx];
        if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      });
    });
  };

  const updateCaption = () => {
    if (!caption) return;
    const demo = items[activeIndex];
    const label = sourceLabel(demo);
    const url = demo.url;
    if (url && (demo.type === 'youtube' || demo.type === 'tiktok' || demo.type === 'vimeo')) {
      caption.innerHTML = `<a href="${url}" target="_blank" rel="noopener" class="hover:text-brand-400 transition-colors">${escapeHtml(label)} ↗</a>`;
    } else {
      caption.textContent = label;
    }
  };

  // Scroll tracking
  let rafPending = false;
  track.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const slideWidth = track.children[0]?.offsetWidth || 1;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        onSwipe(true);
        // Reset playing embed
        if (playingEmbedSlides.has(activeIndex)) {
          const slide = track.children[activeIndex];
          if (slide) {
            playingEmbedSlides.delete(activeIndex);
            renderMedia(slide, items[activeIndex], {
              onError: () => {},
              onEmbedPlay: () => playingEmbedSlides.add(activeIndex)
            });
          }
        }
        activeIndex = newIndex;
        updateDots();
        updateCaption();
      }
    });
  }, { passive: true });

  // Set initial position
  requestAnimationFrame(() => {
    const slide = track.children[activeIndex];
    if (slide) track.scrollLeft = slide.offsetLeft - track.offsetLeft;
  });

  updateDots();
  updateCaption();
}

function clampIndex(i, len) {
  return Math.max(0, Math.min(len - 1, i));
}

function sortDemos(demos) {
  const typeRank = { cloudinary: 0, youtube: 1, vimeo: 2, tiktok: 2, url: 3, local: 4 };
  return [...demos].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (b.isPrimary && !a.isPrimary) return 1;
    return (typeRank[a.type] ?? 99) - (typeRank[b.type] ?? 99);
  });
}

function sourceLabel(demo) {
  const typeLabel = {
    cloudinary: demo.format === 'mp4' ? 'Video' : 'Demo',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    vimeo: 'Vimeo',
    local: 'Demo',
    url: 'External'
  }[demo.type] || demo.type;
  const channel = demo.metadata?.channel;
  if (channel) return `${typeLabel} · ${channel}`;
  if (demo.notes) return `${typeLabel} · ${demo.notes}`;
  return typeLabel;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
