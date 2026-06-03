// GroupCard: renders a superset / compound / circuit group of exercises
// Each member looks identical to a normal ExerciseCard, just pressed together
// with a small label connecting them
import { renderDemoCarousel } from './DemoCarousel.js';

const KIND_LABELS = {
  superset: 'Super Set',
  compound: 'Compound',
  circuit: 'Circuit'
};

/**
 * Build a group card for a resolved group item.
 * Members look like normal exercise cards, pressed together with no gap,
 * connected by a small label between them.
 *
 * @param {Object} item - { kind, exercises[], note?, tags? }
 * @param {Object} state - { isExpanded, isCompleted, onToggle, onComplete, index }
 */
export function createGroupCard(item, state) {
  const wrapper = document.createElement('article');
  wrapper.className = `transition-all ${state.isCompleted ? 'opacity-60' : ''}`;
  wrapper.dataset.itemIndex = String(state.index);

  const kindLabel = KIND_LABELS[item.kind] || item.kind;
  const num = state.index + 1;

  // Build member cards that look like normal ExerciseCards
  const membersHtml = item.exercises.map((member, i) => {
    const subLetter = String.fromCharCode(97 + i);
    const title = `${num}${subLetter}. ${escapeHtml(member.name)}`;
    const isFirst = i === 0;
    const isLast = i === item.exercises.length - 1;
    const roundTop = isFirst ? 'rounded-t-2xl' : '';
    const roundBottom = isLast ? 'rounded-b-2xl' : '';
    const borderTop = !isFirst ? 'border-t border-slate-800' : '';

    return `
      ${!isFirst ? `<div class="flex items-center justify-center -my-px relative z-10"><span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700">${kindLabel}</span></div>` : ''}
      <div class="card ${roundTop} ${roundBottom} ${!isFirst ? 'rounded-t-none' : ''} ${!isLast ? 'rounded-b-none' : ''} ${borderTop} overflow-hidden">
        <div class="flex items-stretch">
          <button
            data-action="toggle-member"
            data-member-idx="${i}"
            class="flex-1 min-w-0 px-4 py-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
          >
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold tracking-tight leading-tight ${state.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}">
                ${title}
              </h3>
              <p class="text-sm text-slate-400 mt-1 num">
                ${member.reps || '—'} · ${member.sets || '—'} sets
              </p>
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
              ${state.isCompleted ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>` : ''}
            </span>
          </button>
        </div>
        <div data-region="member-content-${i}" class="${state.isExpanded ? '' : 'hidden'}">
          <div class="px-4 pb-4 space-y-4">
            <div data-member-media="${i}"></div>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-slate-800/50 rounded-xl p-3 text-center">
                <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.reps || '—')}</p>
                <p class="label-meta mt-1.5">${escapeHtml(member.repUnits || 'reps')}</p>
              </div>
              <div class="bg-slate-800/50 rounded-xl p-3 text-center">
                <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.sets || '—')}</p>
                <p class="label-meta mt-1.5">sets</p>
              </div>
            </div>
            ${member.note ? `
            <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
              <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(member.note)}</p>
            </div>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  wrapper.innerHTML = membersHtml;

  // Wire expand toggles
  wrapper.querySelectorAll('[data-action="toggle-member"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.onToggle?.(state.index);
    });
  });

  // Wire completion (all complete buttons in the group do the same thing)
  wrapper.querySelectorAll('[data-action="complete"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.onComplete?.(state.index);
    });
  });

  // Render demo carousels for expanded state
  if (state.isExpanded) {
    item.exercises.forEach((member, i) => {
      const slot = wrapper.querySelector(`[data-member-media="${i}"]`);
      const demos = member.exercise?.demos || [];
      if (slot && demos.length > 0) renderDemoCarousel(slot, demos);
    });
  }

  return wrapper;
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
