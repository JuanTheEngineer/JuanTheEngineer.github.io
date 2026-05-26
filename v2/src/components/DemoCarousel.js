// DemoCarousel: swipe / tap-to-step through alternative demo sources
// Loads only the active source's media (saves bandwidth on YouTube)
import { renderMedia } from './MediaPlayer.js';

/**
 * Render a carousel of demos into the container.
 * @param {HTMLElement} container
 * @param {Array} demos - array of demo source objects
 * @param {Object} options - { startIndex }
 */
export function renderDemoCarousel(container, demos, options = {}) {
  const items = (demos || []).filter(Boolean);
  if (items.length === 0) {
    container.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>`;
    return;
  }

  // Sort: primary first, then by type preference (cloudinary > youtube > local)
  const ordered = sortDemos(items);
  let activeIndex = clampIndex(options.startIndex ?? 0, ordered.length);

  // Render shell
  container.innerHTML = `
    <div class="space-y-2">
      <div data-region="media-stage" class="relative"></div>
      ${ordered.length > 1 ? `
        <div class="flex items-center gap-2">
          <button data-action="prev" class="btn-ghost p-2 disabled:opacity-30" aria-label="Previous demo">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="flex-1 flex items-center justify-center gap-1.5" data-region="dots"></div>
          <button data-action="next" class="btn-ghost p-2 disabled:opacity-30" aria-label="Next demo">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 leading-relaxed min-h-[1rem]"></p>
      ` : ''}
    </div>
  `;

  const stage = container.querySelector('[data-region="media-stage"]');
  const dotsContainer = container.querySelector('[data-region="dots"]');
  const caption = container.querySelector('[data-region="caption"]');
  const prevBtn = container.querySelector('[data-action="prev"]');
  const nextBtn = container.querySelector('[data-action="next"]');

  function renderActive() {
    const demo = ordered[activeIndex];
    renderMedia(stage, demo);

    if (dotsContainer) {
      dotsContainer.innerHTML = ordered.map((d, i) => `
        <button
          data-dot-index="${i}"
          aria-label="Demo ${i + 1} of ${ordered.length}"
          class="h-1.5 rounded-full transition-all touch-manipulation
            ${i === activeIndex ? 'bg-brand-400 w-6' : 'bg-slate-700 w-1.5 hover:bg-slate-600'}"
        ></button>
      `).join('');
      dotsContainer.querySelectorAll('[data-dot-index]').forEach(el => {
        el.addEventListener('click', () => goTo(Number(el.dataset.dotIndex)));
      });
    }

    if (caption) {
      const label = sourceLabel(demo);
      caption.textContent = label;
    }

    if (prevBtn) prevBtn.disabled = activeIndex === 0;
    if (nextBtn) nextBtn.disabled = activeIndex === ordered.length - 1;
  }

  function goTo(idx) {
    activeIndex = clampIndex(idx, ordered.length);
    renderActive();
  }

  prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));

  // Touch swipe
  if (ordered.length > 1) {
    enableSwipe(stage, {
      onSwipeLeft: () => goTo(activeIndex + 1),
      onSwipeRight: () => goTo(activeIndex - 1)
    });
  }

  renderActive();
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
    cloudinary: demo.format === 'mp4' ? 'Original video' : 'Original',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    vimeo: 'Vimeo',
    local: 'Local',
    url: 'External'
  }[demo.type] || demo.type;
  if (demo.notes) return `${typeLabel} · ${demo.notes}`;
  return typeLabel;
}

function enableSwipe(el, { onSwipeLeft, onSwipeRight, threshold = 40 }) {
  let startX = 0, startY = 0, tracking = false;
  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY; tracking = true;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    }
  }, { passive: true });
}
