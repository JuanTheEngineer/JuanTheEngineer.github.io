// DemoCarousel: native scroll-snap carousel that tracks the finger
// Hardware-accelerated, follows finger movement, snaps on release
import { renderMedia } from './MediaPlayer.js';

/**
 * Render a carousel of demos into the container.
 * @param {HTMLElement} container
 * @param {Array} demos - array of demo source objects
 * @param {Object} options - { startIndex }
 */
export function renderDemoCarousel(container, demos, options = {}) {
  let items = (demos || []).filter(Boolean);
  if (items.length === 0) {
    container.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>`;
    return;
  }

  // Sort: primary first, then by type preference (cloudinary > youtube > local)
  items = sortDemos(items);
  let activeIndex = clampIndex(options.startIndex ?? 0, items.length);

  // Render shell — horizontal scroll container with scroll-snap
  container.innerHTML = `
    <div class="relative">
      <div
        data-region="track"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3 pb-1"
        style="scroll-snap-stop: always;"
      ></div>
      ${
        items.length > 1
          ? `
        <div class="flex items-center justify-center gap-1.5 mt-3" data-region="dots"></div>
        <p data-region="caption" class="text-xs text-slate-400 text-center px-2 mt-2 leading-relaxed min-h-[1rem]"></p>
      `
          : ''
      }
    </div>
  `;

  const track = container.querySelector('[data-region="track"]');
  const dotsContainer = container.querySelector('[data-region="dots"]');
  const caption = container.querySelector('[data-region="caption"]');

  // Hide native scrollbar
  track.style.scrollbarWidth = 'none';

  // Build slides — each takes full width and snaps to center
  items.forEach((demo, i) => {
    const slide = document.createElement('div');
    slide.className = 'flex-shrink-0 w-full snap-center';
    slide.dataset.slideIndex = String(i);
    track.appendChild(slide);
  });

  // Render media into each slide once it scrolls near (defer YouTube embeds)
  const renderedSlides = new Set();
  const playingEmbedSlides = new Set(); // Track slides that have a playing iframe
  const renderSlide = (idx) => {
    if (renderedSlides.has(idx)) return;
    const slide = track.children[idx];
    if (!slide) return;
    const demo = items[idx];
    renderMedia(slide, demo, {
      onError: () => removeSlide(idx),
      onEmbedPlay: () => playingEmbedSlides.add(idx)
    });
    renderedSlides.add(idx);
  };

  // When a slide is no longer active, reset any playing iframe back to thumbnail
  // so it stops capturing touch events and lets the user keep swiping.
  const resetEmbedSlide = (idx) => {
    if (!playingEmbedSlides.has(idx)) return;
    const slide = track.children[idx];
    if (!slide) return;
    playingEmbedSlides.delete(idx);
    renderedSlides.delete(idx);
    renderSlide(idx);
  };

  // Defensive: if a media source fails to load, remove it from the carousel
  const removeSlide = (idx) => {
    items.splice(idx, 1);
    rebuild();
  };

  const rebuild = () => {
    if (items.length === 0) {
      container.innerHTML = `<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>`;
      return;
    }
    activeIndex = clampIndex(activeIndex, items.length);
    renderDemoCarousel(container, items, { startIndex: activeIndex });
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    // Uniform 4px circles. Active = full brand color, inactive = dim slate.
    // Touch target is larger via padding so they're still tappable.
    dotsContainer.innerHTML = items
      .map(
        (_, i) => `
      <button
        data-dot-index="${i}"
        aria-label="Go to demo ${i + 1}"
        class="p-1.5 -m-1.5 group touch-manipulation"
      >
        <span class="block w-1 h-1 rounded-full transition-colors
          ${i === activeIndex ? 'bg-brand-400' : 'bg-slate-600 group-hover:bg-slate-500'}"
        ></span>
      </button>
    `
      )
      .join('');
    dotsContainer.querySelectorAll('[data-dot-index]').forEach((el) => {
      el.addEventListener('click', () => goTo(Number(el.dataset.dotIndex)));
    });
  };

  const updateCaption = () => {
    if (!caption) return;
    caption.textContent = sourceLabel(items[activeIndex]);
  };

  function goTo(idx) {
    const slide = track.children[idx];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }

  // Track active slide via scroll position. Use rAF to throttle.
  let rafPending = false;
  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const slideWidth = track.children[0]?.offsetWidth || 1;
      const newIndex = Math.round(track.scrollLeft / slideWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        const previousIndex = activeIndex;
        activeIndex = newIndex;
        // Reset any playing iframe on the slide we just left so the user
        // can keep swiping (iframes swallow touch events).
        resetEmbedSlide(previousIndex);
        updateDots();
        updateCaption();
        // Render the active slide and its neighbors lazily
        renderSlide(activeIndex);
        if (activeIndex + 1 < items.length) renderSlide(activeIndex + 1);
        if (activeIndex - 1 >= 0) renderSlide(activeIndex - 1);
      }
    });
  };
  track.addEventListener('scroll', onScroll, { passive: true });

  // Initial: render first slide and its neighbors, jump to startIndex without animation
  renderSlide(activeIndex);
  if (activeIndex + 1 < items.length) renderSlide(activeIndex + 1);
  if (activeIndex - 1 >= 0) renderSlide(activeIndex - 1);

  // Position track at startIndex (without smooth, since it's the initial render)
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
  const typeLabel =
    {
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
