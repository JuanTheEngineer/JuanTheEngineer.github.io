// Search page: fuzzy search over programs (and exercises)
import { navigate } from '../utils/router.js';
import { loadWorkouts, loadPlans } from '../utils/data.js';

export async function renderSearchPage(container) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page">Search</h1>
      </header>
      <div class="px-6 pt-4 pb-2">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input data-input="search" type="text" placeholder="Search programs..."
            autofocus
            class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
        </div>
      </div>
      <main class="flex-1 px-6 pb-24 pt-2">
        <div data-region="results" class="space-y-2"></div>
        <div data-region="empty" class="hidden text-center py-12">
          <p class="text-slate-400 text-sm">No programs match your search.</p>
        </div>
        <div data-region="initial" class="text-center py-12">
          <p class="text-slate-500 text-sm">Type to search across all programs.</p>
        </div>
      </main>
    </div>
  `;

  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/'));

  const [{ programs }, { plans }] = await Promise.all([loadWorkouts(), loadPlans()]);

  // Build search index for programs
  const index = programs.map((p) => ({
    id: p.id,
    title: p.title,
    requirements: p.requirements || '',
    itemCount: p.items?.length || p.exercises?.length || 0,
    tokens: tokenize(p.title)
      .concat(tokenize(p.requirements || ''))
      .concat(tokenize(p.id.replace(/[-_]/g, ' '))),
    program: p
  }));

  // Resolve plan category for each program
  const categoryMap = new Map();
  for (const plan of plans) {
    for (const sub of plan.subPlans || []) {
      for (const pid of sub.programs || []) {
        categoryMap.set(pid, `${plan.name} · ${sub.name}`);
      }
    }
  }

  const resultsEl = container.querySelector('[data-region="results"]');
  const emptyEl = container.querySelector('[data-region="empty"]');
  const initialEl = container.querySelector('[data-region="initial"]');

  function renderResults(items) {
    if (items === null) {
      // Initial state
      resultsEl.classList.add('hidden');
      emptyEl.classList.add('hidden');
      initialEl.classList.remove('hidden');
      return;
    }
    initialEl.classList.add('hidden');
    if (items.length === 0) {
      resultsEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');
    resultsEl.classList.remove('hidden');
    resultsEl.innerHTML = items.map((item) => programCard(item, categoryMap.get(item.id))).join('');

    resultsEl.querySelectorAll('[data-program-id]').forEach((el) => {
      el.addEventListener('click', () => navigate(`/program/${el.dataset.programId}`));
    });
  }

  // Search logic
  const input = container.querySelector('[data-input="search"]');
  let debounce = null;

  input?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const query = input.value.trim();
      if (!query) {
        renderResults(null);
        return;
      }
      const qTokens = tokenize(query);
      const matches = index
        .map((entry) => ({ ...entry, score: scoreMatch(entry.tokens, qTokens) }))
        .filter((e) => e.score > 0)
        .sort((a, b) => b.score - a.score);
      renderResults(matches);
    }, 150);
  });

  renderResults(null);
}

function programCard(item, category) {
  return `
    <button
      data-program-id="${item.id}"
      class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          ${category ? `<p class="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">${esc(category)}</p>` : ''}
          <h3 class="font-semibold tracking-tight truncate">${esc(item.title)}</h3>
          <p class="text-xs text-slate-400 mt-1 truncate">
            <span class="num">${item.itemCount}</span> exercise${item.itemCount !== 1 ? 's' : ''}${item.requirements ? ` · ${esc(item.requirements)}` : ''}
          </p>
        </div>
        <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  `;
}

// --- Utility functions (same pattern as ExercisePicker) ---

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
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
