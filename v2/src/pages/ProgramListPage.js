// Programs list: grouped by category from plans.json
import { loadWorkouts, loadPlans } from '../utils/data.js';
import { navigate } from '../utils/router.js';

export async function renderProgramListPage(container) {
  // Loading state
  container.innerHTML = `
    <header class="px-6 pt-12 pb-2 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-2xl font-bold">Programs</h1>
    </header>
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `;

  container.querySelector('[data-action="back"]')
    ?.addEventListener('click', () => navigate('/'));

  try {
    const [workouts, plans] = await Promise.all([loadWorkouts(), loadPlans()]);
    renderContent(container, workouts.programs, plans.plans);
  } catch (err) {
    renderError(container, err);
  }
}

function renderContent(container, programs, plans) {
  const programsById = new Map(programs.map(p => [p.id, p]));

  // Build sections from plans.json so programs appear in curated order
  const sections = [];
  for (const plan of plans) {
    for (const subPlan of (plan.subPlans || [])) {
      const items = (subPlan.programs || [])
        .map(id => programsById.get(id))
        .filter(Boolean);
      if (items.length === 0) continue;
      sections.push({
        category: plan.name,
        title: subPlan.name,
        description: subPlan.description,
        programs: items
      });
    }
  }

  container.innerHTML = `
    <header class="px-6 pt-12 pb-4 flex items-center gap-3">
      <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-2xl font-bold">Programs</h1>
    </header>

    <main class="flex-1 px-6 pb-24 space-y-8">
      ${sections.map((section, sIdx) => `
        <section class="space-y-3 animate-slide-up" style="animation-delay: ${sIdx * 30}ms">
          <div>
            <p class="text-xs font-medium text-brand-400 uppercase tracking-wide">${section.category}</p>
            <h2 class="text-lg font-semibold mt-1">${section.title}</h2>
            ${section.description ? `<p class="text-sm text-slate-400 mt-1 leading-relaxed">${section.description}</p>` : ''}
          </div>
          <ul class="space-y-2">
            ${section.programs.map(p => programCard(p)).join('')}
          </ul>
        </section>
      `).join('')}
    </main>
  `;

  container.querySelector('[data-action="back"]')
    ?.addEventListener('click', () => navigate('/'));

  container.querySelectorAll('[data-program-id]').forEach(el => {
    el.addEventListener('click', () => {
      navigate(`/program/${el.dataset.programId}`);
    });
  });
}

function programCard(program) {
  const exerciseCount = program.exercises?.length || 0;
  return `
    <li>
      <button
        data-program-id="${program.id}"
        class="w-full card p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold truncate">${program.title}</h3>
            <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span>${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}</span>
              ${program.requirements ? `
                <span class="text-slate-600">•</span>
                <span class="truncate">${program.requirements}</span>
              ` : ''}
            </div>
          </div>
          <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </li>
  `;
}

function renderError(container, err) {
  container.innerHTML = `
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load programs</h2>
        <p class="text-sm text-slate-400">${err?.message || err}</p>
      </div>
    </main>
  `;
}
