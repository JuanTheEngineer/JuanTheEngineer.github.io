// Action App V2 - Entry point
import './styles/main.css';
import { route, setNotFound, startRouter } from './utils/router.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderProgramListPage } from './pages/ProgramListPage.js';
import { renderProgramDetailPage } from './pages/ProgramDetailPage.js';

const app = document.getElementById('app');

// Loading state helper
function renderLoading() {
  app.innerHTML = `
    <div class="flex-1 flex items-center justify-center min-h-screen">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
}

// Stub pages until they're built
function renderStub(title, message) {
  return (params) => {
    app.innerHTML = `
      <div class="flex-1 flex flex-col">
        <header class="px-6 pt-12 pb-4 flex items-center gap-3">
          <button onclick="window.history.back()" class="btn-ghost -ml-2 px-3" aria-label="Back">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-2xl font-bold">${title}</h1>
        </header>
        <main class="flex-1 px-6 pb-24">
          <div class="card p-6 animate-slide-up">
            <p class="text-slate-400">${message}</p>
            ${params && Object.keys(params).length ? `
              <pre class="text-xs text-slate-500 mt-3 font-mono">${JSON.stringify(params, null, 2)}</pre>
            ` : ''}
          </div>
        </main>
      </div>
    `;
  };
}

// Register routes
route('/', () => renderHomePage(app));
route('/programs', () => renderProgramListPage(app));
route('/program/:id', ({ id }) => renderProgramDetailPage(app, id));
route('/exercises', renderStub('Exercise Library', 'Exercise library coming next.'));
route('/exercise/:id', renderStub('Exercise', 'Single exercise page coming next.'));

setNotFound((path) => {
  app.innerHTML = `
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${path}</p>
      <a href="#/" class="btn-primary">Back home</a>
    </div>
  `;
});

// Boot
startRouter();
console.log('🚀 Action App V2 ready');
