// GroupCard: renders a superset / compound / circuit group of exercises
// All members are equal first-class exercises, displayed together with a label
import { renderDemoCarousel } from './DemoCarousel.js';

const KIND_LABELS = {
  superset: 'Super Set',
  compound: 'Compound',
  circuit: 'Circuit'
};

const KIND_DESCRIPTIONS = {
  superset: 'Alternate between exercises with no rest',
  compound: 'Perform back-to-back as one set',
  circuit: 'Rotate through all exercises'
};

/**
 * Build a group card for a resolved group item.
 *
 * @param {Object} item - { kind, exercises[], note?, tags? }
 * @param {Object} state - { isExpanded, isCompleted, onToggle, onComplete, index }
 */
export function createGroupCard(item, state) {
  const card = document.createElement('article');
  card.className = `card overflow-hidden transition-all ${state.isCompleted ? 'opacity-60' : ''}`;
  card.dataset.itemIndex = String(state.index);

  const kindLabel = KIND_LABELS[item.kind] || item.kind;
  const kindDesc = KIND_DESCRIPTIONS[item.kind] || '';
  const memberCount = item.exercises.length;
  const num = state.index + 1;
  const memberNames = item.exercises.map((m) => m.name).join(' + ');
  const title = `${num}. ${memberNames}`;

  card.innerHTML = `
    <div class="flex items-stretch">
      <button
        data-action="toggle"
        class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${kindLabel}</span>
            ${(item.tags || [])
              .map(
                (t) => `
              <span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${escapeHtml(t)}</span>
            `
              )
              .join('')}
          </div>
          <h3 class="font-semibold tracking-tight leading-tight ${state.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}">
            ${escapeHtml(title)}
          </h3>
          <p class="text-sm text-slate-400 mt-1 num">${memberCount} exercises</p>
        </div>
        <svg class="w-4 h-4 text-slate-500 shrink-0 transition-transform ${state.isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <button
        data-action="complete"
        aria-label="${state.isCompleted ? 'Mark incomplete' : 'Mark complete'}"
        class="shrink-0 self-stretch px-4 flex items-center justify-center touch-manipulation active:bg-white/5 transition-colors"
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
      <div class="px-4 pb-4 space-y-3">
        ${kindDesc ? `<p class="text-xs text-slate-500 italic">${kindDesc}</p>` : ''}
        ${
          item.note
            ? `
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.note)}</p>
          </div>
        `
            : ''
        }
        <div class="space-y-2">
          ${item.exercises.map((member, i) => memberBlock(member, i, num)).join('')}
        </div>
      </div>
    </div>
  `;

  if (state.isExpanded) {
    item.exercises.forEach((member, i) => {
      const slot = card.querySelector(`[data-member-media="${i}"]`);
      const demos = member.exercise?.demos || [];
      if (slot && demos.length > 0) renderDemoCarousel(slot, demos);
    });
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

function memberBlock(member, idx, parentNum) {
  const subLetter = String.fromCharCode(97 + idx); // a, b, c...
  return `
    <div class="bg-slate-800/40 rounded-xl p-3 space-y-3">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 num">${parentNum}${subLetter}</span>
        <h4 class="font-medium text-slate-100 text-sm flex-1 leading-tight tracking-tight">${escapeHtml(member.name)}</h4>
      </div>
      <div data-member-media="${idx}"></div>
      <div class="flex gap-2">
        <div class="flex-1 bg-slate-900/60 rounded-lg p-2 text-center">
          <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.reps || '—')}</p>
          <p class="label-meta mt-1">${escapeHtml(member.repUnits || 'reps')}</p>
        </div>
        <div class="flex-1 bg-slate-900/60 rounded-lg p-2 text-center">
          <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.sets || '—')}</p>
          <p class="label-meta mt-1">sets</p>
        </div>
      </div>
      ${
        member.note
          ? `
        <p class="text-xs text-slate-400 leading-relaxed px-1">${escapeHtml(member.note)}</p>
      `
          : ''
      }
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
