// Home page: simple welcome + entry points
import { navigate } from '../utils/router.js';
import { getRecentPrograms, getProgress } from '../utils/storage.js';
import { loadWorkouts } from '../utils/data.js';

function isLocalDev() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

export function renderHomePage(container) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-16 pb-8">
        <p class="eyebrow">Action App</p>
        <h1 class="h-display mt-2">No more excuses</h1>
        <p class="text-[15px] text-slate-400 mt-3 leading-relaxed max-w-md">
          Your mobile fitness companion.
          Pick a program, follow along, get it done.
        </p>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-6">
        <section data-region="recent" class="hidden space-y-3 animate-slide-up"></section>

        <section class="space-y-3">
          ${isLocalDev() ? `<button
            data-action="create"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Create</h2>
                <p class="text-sm text-slate-400 mt-0.5">New program or exercise</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>` : ''}

          <button
            data-action="programs"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 50ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Browse programs</h2>
                <p class="text-sm text-slate-400 mt-0.5">Curated workout plans</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            data-action="exercises"
            class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
            style="animation-delay: 100ms"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight">Exercise library</h2>
                <p class="text-sm text-slate-400 mt-0.5">All exercises with demos</p>
              </div>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </section>
      </main>
    </div>
  `;

  container.querySelector('[data-action="create"]')?.addEventListener('click', () => navigate('/studio'));
  container.querySelector('[data-action="programs"]')?.addEventListener('click', () => navigate('/programs'));
  container.querySelector('[data-action="exercises"]')?.addEventListener('click', () => navigate('/exercises'));

  // Render recent programs in the background — fail quietly if data doesn't load
  renderRecent(container).catch((err) => console.warn('[recent] skipped', err));
}

async function renderRecent(container) {
  const recents = getRecentPrograms();
  if (recents.length === 0) return;

  const slot = container.querySelector('[data-region="recent"]');
  if (!slot) return;

  const { programs } = await loadWorkouts();
  const byId = new Map(programs.map((p) => [p.id, p]));

  // Resolve to programs we still know about, take top 3
  const resolved = recents
    .map((r) => ({ ...r, program: byId.get(r.id) }))
    .filter((r) => r.program)
    .slice(0, 3);

  if (resolved.length === 0) return;

  slot.classList.remove('hidden');
  slot.innerHTML = `
    <div class="flex items-baseline justify-between">
      <h2 class="eyebrow">Pick up where you left off</h2>
      ${
        resolved.length === 3 && recents.length > 3
          ? '<button data-action="all-recent" class="text-xs text-slate-400 hover:text-brand-400 transition-colors">All</button>'
          : ''
      }
    </div>
    <ul class="space-y-2">
      ${resolved.map((r) => recentCard(r.program)).join('')}
    </ul>
  `;

  slot.querySelectorAll('[data-program-id]').forEach((el) => {
    el.addEventListener('click', () => navigate(`/program/${el.dataset.programId}`));
  });
  slot.querySelector('[data-action="all-recent"]')?.addEventListener('click', () => navigate('/programs'));
}

function recentCard(program) {
  const total = program.items?.length || program.exercises?.length || 0;
  const done = getProgress(program.id).size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const progressLabel = done === 0 ? 'Not started' : done >= total ? 'Complete' : `${done} of ${total} done`;

  return `
    <li>
      <button
        data-program-id="${program.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold tracking-tight truncate">${escapeHtml(program.title)}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-brand-500 to-brand-400 transition-all" style="width: ${pct}%"></div>
              </div>
              <span class="text-[11px] text-slate-400 num font-medium whitespace-nowrap">${progressLabel}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </li>
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
