// ExerciseCard: expandable row for a single resolved item
// Now reads from a resolved item shape (with merged overrides + canonical exercise)
import { renderDemoCarousel } from './DemoCarousel.js';

/**
 * Build an exercise card element for a single resolved item.
 *
 * @param {Object} item - { kind: 'single', exercise, reps, sets, repUnits, note, displayName, tags }
 * @param {Object} state - { isCompleted, isExpanded, onToggle, onComplete, index }
 */
export function createExerciseCard(item, state) {
  const card = document.createElement('article');
  card.className = `card overflow-hidden transition-all ${state.isCompleted ? 'opacity-60' : ''}`;
  card.dataset.itemIndex = String(state.index);

  const demos = item.exercise?.demos || [];

  card.innerHTML = `
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          ${tagBadges(item.tags)}
          <h3 class="font-semibold tracking-tight leading-tight ${state.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}">
            ${escapeHtml(item.displayName)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num">
            ${formatStats(item)}
          </p>
        </div>
        <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${state.isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button
        data-action="complete"
        aria-label="${state.isCompleted ? 'Mark incomplete' : 'Mark complete'}"
        class="flex-shrink-0 self-stretch px-4 flex items-center justify-center touch-manipulation active:bg-white/5 transition-colors"
      >
        <span class="w-7 h-7 rounded-full border-2 ${state.isCompleted ? 'bg-brand-500 border-brand-500' : 'border-slate-600'} flex items-center justify-center transition-colors">
          ${
            state.isCompleted
              ? `
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          `
              : ''
          }
        </span>
      </button>
    </div>
    <div data-region="content" class="${state.isExpanded ? '' : 'hidden'}">
      <div class="px-4 pb-4 space-y-4">
        <div data-media-slot></div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(item.reps || '—')}</p>
            <p class="label-meta mt-1.5">${escapeHtml(item.repUnits || 'reps')}</p>
          </div>
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(item.sets || '—')}</p>
            <p class="label-meta mt-1.5">sets</p>
          </div>
        </div>
        ${
          item.note
            ? `
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.note)}</p>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;

  if (state.isExpanded && demos.length > 0) {
    const slot = card.querySelector('[data-media-slot]');
    if (slot) renderDemoCarousel(slot, demos);
  }

  card.querySelector('[data-action="toggle"]')?.addEventListener('click', () => {
    state.onToggle?.(state.index);
  });

  card.querySelector('[data-action="complete"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.onComplete?.(state.index);
  });

  return card;
}

function formatStats(item) {
  const reps = item.reps || '—';
  const sets = item.sets || '—';
  return `${reps} · ${sets} sets`;
}

function tagBadges(tags = []) {
  if (!tags.length) return '';
  return `
    <div class="flex gap-1.5 mb-1.5">
      ${tags
        .map(
          (t) => `
        <span class="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${escapeHtml(t)}</span>
      `
        )
        .join('')}
    </div>
  `;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[c]
  );
}
