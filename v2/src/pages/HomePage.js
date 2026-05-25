// Home page: simple welcome + entry points
import { navigate } from '../utils/router.js';

export function renderHomePage(container) {
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-16 pb-8">
        <p class="text-brand-400 text-sm font-medium tracking-wide uppercase">Action App</p>
        <h1 class="text-4xl font-bold tracking-tight mt-2">No more excuses</h1>
        <p class="text-slate-400 mt-3 leading-relaxed">
          Your mobile fitness companion.
          Pick a program, follow along, get it done.
        </p>
      </header>

      <main class="flex-1 px-6 pb-24 space-y-3">
        <button
          data-action="programs"
          class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="font-semibold">Browse programs</h2>
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
          style="animation-delay: 50ms"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="font-semibold">Exercise library</h2>
              <p class="text-sm text-slate-400 mt-0.5">All exercises with demos</p>
            </div>
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </button>
      </main>
    </div>
  `;

  container.querySelector('[data-action="programs"]')
    ?.addEventListener('click', () => navigate('/programs'));
  container.querySelector('[data-action="exercises"]')
    ?.addEventListener('click', () => navigate('/exercises'));
}
