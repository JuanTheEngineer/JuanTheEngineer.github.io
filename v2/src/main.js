// Action App V2 - Entry point
import './styles/main.css';
import { route, setNotFound, startRouter } from './utils/router.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderProgramListPage } from './pages/ProgramListPage.js';
import { renderProgramDetailPage } from './pages/ProgramDetailPage.js';
import { renderStudioPage } from './pages/StudioPage.js';
import { renderProgramEditorPage } from './pages/ProgramEditorPage.js';
import { renderExerciseEditorPage } from './pages/ExerciseEditorPage.js';
import { renderAIChatPage } from './pages/AIChatPage.js';
import { renderExerciseLibraryPage } from './pages/ExerciseLibraryPage.js';
import { renderExerciseDetailPage } from './pages/ExerciseDetailPage.js';
import { renderSearchPage } from './pages/SearchPage.js';
import { renderSubmitPage } from './pages/SubmitPage.js';

const app = document.getElementById('app');

// Register routes
route('/', () => renderHomePage(app));
route('/programs', () => renderProgramListPage(app));
route('/program/:id', ({ id }) => renderProgramDetailPage(app, id));
route('/exercises', () => renderExerciseLibraryPage(app));
route('/exercise/:id', ({ id }) => renderExerciseDetailPage(app, id));
route('/search', () => renderSearchPage(app));
route('/submit', () => renderSubmitPage(app));

// Studio routes — only available in local dev
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
if (isLocal) {
  route('/studio', () => renderStudioPage(app));
  route('/studio/program', () => renderProgramEditorPage(app));
  route('/studio/exercise', () => renderExerciseEditorPage(app));
  route('/studio/ai', () => renderAIChatPage(app));
}

setNotFound((path) => {
  app.innerHTML = `
    <div class="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p class="text-6xl mb-4">🤔</p>
      <h1 class="text-2xl font-bold mb-2">Page not found</h1>
      <p class="text-slate-400 mb-6 text-sm">${path}</p>
      <a href="/" class="btn-primary">Back home</a>
    </div>
  `;
});

// Hide the global Submit pill when the user is already on /submit.
function syncSubmitPill() {
  const pill = document.getElementById('submit-pill');
  if (pill) pill.hidden = window.location.pathname === '/submit';
}
window.addEventListener('popstate', syncSubmitPill);
// Runs after the router's own click handler (both bubble on document).
document.addEventListener('click', () => requestAnimationFrame(syncSubmitPill));
syncSubmitPill();

// Boot
startRouter();
console.log('🚀 Action App V2 ready');
