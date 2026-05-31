// Action App V2 - Entry point
import './styles/main.css';
import { route, setNotFound, startRouter } from './utils/router.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderProgramListPage } from './pages/ProgramListPage.js';
import { renderProgramDetailPage } from './pages/ProgramDetailPage.js';
import { renderStudioPage } from './pages/StudioPage.js';
import { renderProgramEditorPage } from './pages/ProgramEditorPage.js';
import { renderExerciseEditorPage } from './pages/ExerciseEditorPage.js';
import { renderExerciseLibraryPage } from './pages/ExerciseLibraryPage.js';
import { renderExerciseDetailPage } from './pages/ExerciseDetailPage.js';
import { renderSearchPage } from './pages/SearchPage.js';

const app = document.getElementById('app');

// Register routes
route('/', () => renderHomePage(app));
route('/programs', () => renderProgramListPage(app));
route('/program/:id', ({ id }) => renderProgramDetailPage(app, id));
route('/exercises', () => renderExerciseLibraryPage(app));
route('/exercise/:id', ({ id }) => renderExerciseDetailPage(app, id));
route('/search', () => renderSearchPage(app));

// Studio routes — only available in local dev
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
if (isLocal) {
  route('/studio', () => renderStudioPage(app));
  route('/studio/program', () => renderProgramEditorPage(app));
  route('/studio/exercise', () => renderExerciseEditorPage(app));
}

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
