// GroupCard: renders a superset / compound / circuit group of exercises
// Each member gets its own card-like row inside a shared outer container
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
  const wrapper = document.createElement('article');
  wrapper.className = `transition-all ${state.isCompleted ? 'opacity-60' : ''}`;
  wrapper.dataset.itemIndex = String(state.index);

  const kindLabel = KIND_LABELS[item.kind] || item.kind;
  const kindDesc = KIND_DESCRIPTIONS[item.kind] || '';
  const num = state.index + 1;

  // Outer container: brand-colored border + label header
  wrapper.innerHTML = `
    <div class="border border-brand-500/30 rounded-2xl overflow-hidden bg-brand-500/5">
      <!-- Group header -->
      <div class="flex items-center justify-between px-4 py-2 border-b border-brand-500/20">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300">${kindLabel}</span>
          <span class="text-[10px] text-slate-500">${kindDesc}</span>
        </div>
        <button
          data-action="complete"
          aria-label="${state.isCompleted ? 'Mark incomplete' : 'Mark complete'}"
          class="p-1 touch-manipulation"
        >
          <span class="w-6 h-6 rounded-full border-2 ${state.isCompleted ? 'bg-brand-500 border-brand-500' : 'border-slate-600'} flex items-center justify-center transition-colors">
            ${state.isCompleted ? `<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>` : ''}
          </span>
        </button>
      </div>

      ${item.note ? `
      <div class="px-4 pt-2">
        <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg">
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(item.note)}</p>
        </div>
      </div>` : ''}

      <!-- Individual exercise cards inside the group -->
      <div class="divide-y divide-slate-800/50">
        ${item.exercises.map((member, i) => memberCard(member, i, num, state.isExpanded)).join('')}
      </div>
    </div>
  `;

  // Wire expand toggles for each member
  wrapper.querySelectorAll('[data-action="toggle-member"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.onToggle?.(state.index);
    });
  });

  // Wire group completion
  wrapper.querySelector('[data-action="complete"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.onComplete?.(state.index);
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

function memberCard(member, idx, parentNum, isExpanded) {
  const subLetter = String.fromCharCode(97 + idx); // a, b, c...
  const label = `${parentNum}${subLetter}`;

  return `
    <div class="px-4 py-3">
      <button data-action="toggle-member" class="w-full text-left flex items-center gap-3 active:bg-white/5 transition-colors touch-manipulation rounded-lg -mx-2 px-2 py-1">
        <span class="w-7 h-7 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center shrink-0 num">${label}</span>
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm text-slate-100 tracking-tight leading-tight">${escapeHtml(member.name)}</h4>
          <p class="text-xs text-slate-400 mt-0.5 num">${member.reps || '—'} ${member.repUnits || 'reps'} · ${member.sets || '—'} sets</p>
        </div>
        <svg class="w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      ${isExpanded ? `
      <div class="mt-3 space-y-3 pl-10">
        <div data-member-media="${idx}"></div>
        <div class="flex gap-2">
          <div class="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
            <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.reps || '—')}</p>
            <p class="label-meta mt-1">${escapeHtml(member.repUnits || 'reps')}</p>
          </div>
          <div class="flex-1 bg-slate-800/50 rounded-lg p-2 text-center">
            <p class="text-lg font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(member.sets || '—')}</p>
            <p class="label-meta mt-1">sets</p>
          </div>
        </div>
        ${member.note ? `
        <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg">
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(member.note)}</p>
        </div>` : ''}
      </div>` : ''}
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
