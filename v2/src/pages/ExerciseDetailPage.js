// Single Exercise Page: full detail view with all demos, recommendations, and program usage
import { navigate } from '../utils/router.js';
import { getExercise, loadWorkouts } from '../utils/data.js';
import { renderDemoCarousel } from '../components/DemoCarousel.js';

export async function renderExerciseDetailPage(container, id) {
  // Loading state
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">Exercise</h1>
      </header>
      <main class="flex-1 px-6 pb-24 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    </div>
  `;
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => window.history.back());

  const exercise = await getExercise(id);
  if (!exercise) {
    renderNotFound(container, id);
    return;
  }

  // Find which programs use this exercise
  const { programs } = await loadWorkouts();
  const usedIn = findProgramsUsing(programs, id);

  renderDetail(container, exercise, usedIn);
}

function renderDetail(container, exercise, usedIn) {
  const demos = exercise.demos || [];
  const rec = exercise.recommendations || {};
  const aliases = exercise.aliases || [];

  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-4 flex items-center gap-3">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="h-page flex-1 min-w-0 truncate">${esc(exercise.name)}</h1>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-6 animate-slide-up">
        <!-- Demo carousel -->
        <section data-region="demos">
          ${demos.length === 0 ? '<div class="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">No demos available</div>' : ''}
        </section>

        <!-- Recommendations -->
        ${rec.reps || rec.sets ? `
        <section class="space-y-3">
          <h2 class="eyebrow">Recommendations</h2>
          <div class="grid grid-cols-2 gap-3">
            ${rec.reps ? `
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${esc(rec.reps)}</p>
              <p class="label-meta mt-1.5">${esc(rec.repUnits || 'reps')}</p>
            </div>` : ''}
            ${rec.sets ? `
            <div class="card p-4 text-center">
              <p class="text-3xl font-extrabold text-brand-400 leading-none num tracking-tight">${esc(rec.sets)}</p>
              <p class="label-meta mt-1.5">sets</p>
            </div>` : ''}
          </div>
          ${rec.note ? `
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2.5 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${esc(rec.note)}</p>
          </div>` : ''}
        </section>` : ''}

        <!-- Aliases -->
        ${aliases.length > 0 ? `
        <section class="space-y-2">
          <h2 class="eyebrow">Also known as</h2>
          <div class="flex flex-wrap gap-2">
            ${aliases.map((a) => `<span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">${esc(a)}</span>`).join('')}
          </div>
        </section>` : ''}

        <!-- Used in programs -->
        ${usedIn.length > 0 ? `
        <section class="space-y-3">
          <h2 class="eyebrow">Used in ${usedIn.length} program${usedIn.length !== 1 ? 's' : ''}</h2>
          <ul class="space-y-2">
            ${usedIn.map((p) => `
            <li>
              <button data-program-id="${p.id}" class="w-full card p-3 text-left active:scale-[0.98] transition-transform">
                <div class="flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-semibold tracking-tight truncate">${esc(p.title)}</h3>
                  </div>
                  <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            </li>`).join('')}
          </ul>
        </section>` : ''}

        <!-- Metadata -->
        <section class="space-y-2 pt-2 border-t border-slate-800">
          <p class="text-[11px] text-slate-500 font-mono">${esc(exercise.id)}</p>
          <p class="text-[11px] text-slate-500">${demos.length} demo${demos.length !== 1 ? 's' : ''}</p>
        </section>
      </main>
    </div>
  `;

  // Wire back button
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => window.history.back());

  // Wire program links
  container.querySelectorAll('[data-program-id]').forEach((el) => {
    el.addEventListener('click', () => navigate(`/program/${el.dataset.programId}`));
  });

  // Render demo carousel
  if (demos.length > 0) {
    const slot = container.querySelector('[data-region="demos"]');
    renderDemoCarousel(slot, demos);
  }
}

function renderNotFound(container, id) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤷</p>
      <h1 class="text-2xl font-bold mb-2">Exercise not found</h1>
      <p class="text-slate-400 mb-6 text-sm font-mono">${esc(id)}</p>
      <a href="#/exercises" class="btn-primary">Browse exercises</a>
    </div>
  `;
}

/**
 * Find all programs that reference this exercise ID.
 */
function findProgramsUsing(programs, exerciseId) {
  return programs.filter((p) => {
    for (const item of p.items || []) {
      if (item.exerciseId === exerciseId) return true;
      // Check group members
      if (item.exercises) {
        for (const member of item.exercises) {
          if (member.exerciseId === exerciseId) return true;
        }
      }
    }
    return false;
  });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
