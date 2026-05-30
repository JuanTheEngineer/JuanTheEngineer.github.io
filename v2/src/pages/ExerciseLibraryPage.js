// Exercise Library: browse all exercises, search, tap to see demos
import { navigate } from '../utils/router.js';
import { loadExercises } from '../utils/data.js';
import { searchExercises } from '../components/ExercisePicker.js';
import { renderDemoCarousel } from '../components/DemoCarousel.js';

export async function renderExerciseLibraryPage(container) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page">Exercises</h1>
        <span data-region="count" class="text-[11px] text-slate-500 num ml-auto"></span>
      </header>
      <div class="px-6 pt-4 pb-2">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input data-input="search" type="text" placeholder="Search exercises..."
            class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
        </div>
      </div>
      <main class="flex-1 px-6 pb-24 pt-2">
        <ul data-region="list" class="space-y-2"></ul>
        <div data-region="empty" class="hidden text-center py-12">
          <p class="text-slate-400 text-sm">No exercises match your search.</p>
        </div>
      </main>
    </div>
  `;

  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/'));

  const { exercises } = await loadExercises();
  const countEl = container.querySelector('[data-region="count"]');
  countEl.textContent = `${exercises.length} total`;

  let expandedId = null;

  const renderList = (items) => {
    const list = container.querySelector('[data-region="list"]');
    const empty = container.querySelector('[data-region="empty"]');

    if (items.length === 0) {
      list.classList.add('hidden');
      empty.classList.remove('hidden');
      return;
    }
    list.classList.remove('hidden');
    empty.classList.add('hidden');

    list.innerHTML = items
      .map(
        (ex) => `
      <li>
        <article class="card overflow-hidden" data-exercise-id="${ex.id}">
          <button data-action="expand" data-id="${ex.id}" class="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold tracking-tight text-slate-100 truncate">${esc(ex.name)}</h3>
              <p class="text-xs text-slate-400 mt-0.5 num">${ex.demos.length} demo${ex.demos.length !== 1 ? 's' : ''}${ex.recommendations?.reps ? ` · ${ex.recommendations.reps} ${ex.recommendations.repUnits || 'reps'}` : ''}</p>
            </div>
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${expandedId === ex.id ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          ${expandedId === ex.id ? exerciseDetail(ex) : ''}
        </article>
      </li>
    `
      )
      .join('');

    // Wire expand buttons
    list.querySelectorAll('[data-action="expand"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        expandedId = expandedId === btn.dataset.id ? null : btn.dataset.id;
        renderList(items);
        // Render demo carousel for expanded item
        if (expandedId) {
          const slot = list.querySelector(`[data-demo-slot="${expandedId}"]`);
          const ex = items.find((e) => e.id === expandedId);
          if (slot && ex && ex.demos.length > 0) {
            renderDemoCarousel(slot, ex.demos);
          }
        }
      });
    });

    // Render carousel for already-expanded item on initial render
    if (expandedId) {
      const slot = list.querySelector(`[data-demo-slot="${expandedId}"]`);
      const ex = items.find((e) => e.id === expandedId);
      if (slot && ex && ex.demos.length > 0) {
        renderDemoCarousel(slot, ex.demos);
      }
    }
  };

  function exerciseDetail(ex) {
    return `
      <div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
        <div data-demo-slot="${ex.id}">
          ${ex.demos.length === 0 ? '<p class="text-xs text-slate-500 italic py-2">No demos available</p>' : ''}
        </div>
        ${
          ex.recommendations
            ? `
          <div class="flex gap-3">
            ${ex.recommendations.reps ? `<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${esc(ex.recommendations.reps)}</p><p class="label-meta mt-0.5">${esc(ex.recommendations.repUnits || 'reps')}</p></div>` : ''}
            ${ex.recommendations.sets ? `<div class="bg-slate-800/50 rounded-lg px-3 py-2 text-center flex-1"><p class="text-lg font-extrabold text-brand-400 num">${esc(ex.recommendations.sets)}</p><p class="label-meta mt-0.5">sets</p></div>` : ''}
          </div>
        `
            : ''
        }
        ${ex.recommendations?.note ? `<div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg"><p class="text-xs text-slate-300 leading-relaxed">${esc(ex.recommendations.note)}</p></div>` : ''}
        ${ex.aliases?.length ? `<p class="text-[11px] text-slate-500">Also known as: ${ex.aliases.join(', ')}</p>` : ''}
      </div>
    `;
  }

  // Initial render — show all exercises sorted by name
  const sorted = [...exercises].sort((a, b) => a.name.localeCompare(b.name));
  renderList(sorted);

  // Search
  const input = container.querySelector('[data-input="search"]');
  let debounce = null;
  input?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const query = input.value.trim();
      if (!query) {
        renderList(sorted);
        countEl.textContent = `${sorted.length} total`;
        return;
      }
      const results = await searchExercises(query, 50);
      const items = results.map((r) => r.exercise);
      renderList(items);
      countEl.textContent = `${items.length} result${items.length !== 1 ? 's' : ''}`;
    }, 150);
  });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
