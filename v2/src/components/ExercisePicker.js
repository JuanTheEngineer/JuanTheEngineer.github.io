// ExercisePicker: fuzzy search over exercises.json
// Reusable across Studio (program builder) and Exercise Library page.

import { loadExercises } from '../utils/data.js';

let searchIndex = null;

/**
 * Build the search index from exercises.json (called once, cached).
 */
async function ensureIndex() {
  if (searchIndex) return searchIndex;
  const { exercises } = await loadExercises();
  searchIndex = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    hasDemos: (ex.demos || []).length > 0,
    tokens: tokenize(ex.name)
      .concat((ex.aliases || []).flatMap((a) => tokenize(a)))
      .concat(tokenize(ex.id.replace(/[-_]/g, ' '))),
    exercise: ex
  }));
  return searchIndex;
}

/**
 * Add a newly created exercise to the in-memory index so it's immediately searchable.
 */
export function addToIndex(exercise) {
  if (!searchIndex) return;
  searchIndex.push({
    id: exercise.id,
    name: exercise.name,
    hasDemos: (exercise.demos || []).length > 0,
    tokens: tokenize(exercise.name)
      .concat((exercise.aliases || []).flatMap((a) => tokenize(a)))
      .concat(tokenize(exercise.id.replace(/[-_]/g, ' '))),
    exercise
  });
}

/**
 * Search exercises. Returns top `limit` matches.
 */
export async function searchExercises(query, limit = 10) {
  const index = await ensureIndex();
  if (!query || !query.trim()) return index.slice(0, limit);
  const qTokens = tokenize(query);
  return index
    .map((entry) => ({ ...entry, score: scoreMatch(entry.tokens, qTokens) }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Render the picker UI into a container.
 * @param {HTMLElement} container
 * @param {Object} options - { onSelect(exercise), onCreateNew() }
 */
export function renderExercisePicker(container, options = {}) {
  container.innerHTML = `
    <div class="space-y-3">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          data-input="search"
          type="text"
          placeholder="Search exercises..."
          class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
        />
      </div>
      <ul data-region="results" class="space-y-1 max-h-[300px] overflow-y-auto hidden"></ul>
      <div data-region="empty" class="hidden text-center py-4">
        <p class="text-sm text-slate-400">No exercises match that name.</p>
      </div>
      <button data-action="create-new" class="hidden w-full py-2.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">+ Create new exercise</button>
    </div>
  `;

  const input = container.querySelector('[data-input="search"]');
  const resultsList = container.querySelector('[data-region="results"]');
  const emptyState = container.querySelector('[data-region="empty"]');
  const createBtn = container.querySelector('[data-action="create-new"]');

  let debounceTimer = null;

  const renderResults = (results, query) => {
    if (!query || !query.trim()) {
      resultsList.classList.add('hidden');
      emptyState.classList.add('hidden');
      createBtn.classList.add('hidden');
      return;
    }

    // Always show create button when user has typed something
    createBtn.classList.remove('hidden');

    if (results.length === 0) {
      resultsList.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');
    resultsList.classList.remove('hidden');
    resultsList.innerHTML = results
      .map(
        (r) => `
      <li>
        <button
          data-exercise-id="${r.id}"
          class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation"
        >
          <span class="flex-1 min-w-0">
            <span class="text-sm font-medium text-slate-100 block truncate">${escapeHtml(r.name)}</span>
          </span>
          ${
            r.hasDemos
              ? `
            <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>
          `
              : ''
          }
        </button>
      </li>
    `
      )
      .join('');

    resultsList.querySelectorAll('[data-exercise-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const entry = results.find((r) => r.id === btn.dataset.exerciseId);
        if (entry) options.onSelect?.(entry.exercise);
      });
    });
  };

  const doSearch = async () => {
    const query = input.value;
    const results = await searchExercises(query);
    renderResults(results, query);
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 150);
  });

  // Initial render (empty — wait for user to type)
  renderResults([], '');

  // Create new button — passes current search text for auto-fill
  createBtn?.addEventListener('click', () => options.onCreateNew?.(input.value.trim()));
}

// --- Utility functions ---

function tokenize(str) {
  if (!str) return [];
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

function scoreMatch(entryTokens, queryTokens) {
  let total = 0;
  for (const qt of queryTokens) {
    let best = 0;
    for (const et of entryTokens) {
      if (et === qt) {
        best = Math.max(best, 10);
      } else if (et.startsWith(qt)) {
        best = Math.max(best, 7);
      } else if (et.includes(qt)) {
        best = Math.max(best, 4);
      }
    }
    if (best === 0) return 0; // all query tokens must match something
    total += best;
  }
  return total;
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
