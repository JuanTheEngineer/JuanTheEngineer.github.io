// Program detail page: HCI design winner — expanding rows + timeline
import { getProgram } from '../utils/data.js';
import { navigate } from '../utils/router.js';
import { createExerciseCard } from '../components/ExerciseCard.js';
import { getProgress, toggleProgress } from '../utils/storage.js';

export async function renderProgramDetailPage(container, programId) {
  // Loading state
  container.innerHTML = renderShell(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `);
  wireBack(container);

  try {
    const program = await getProgram(programId);
    if (!program) {
      renderNotFound(container, programId);
      return;
    }
    renderContent(container, program);
  } catch (err) {
    renderError(container, err);
  }
}

function renderContent(container, program) {
  const completed = getProgress(program.id);
  const total = program.exercises.length;
  let expandedIndex = -1; // single-expand: only one card open at a time

  container.innerHTML = renderShell(`
    <div class="px-6 pt-2">
      <div data-region="progress" class="h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div data-region="progress-bar" class="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${(completed.size / total) * 100}%"></div>
      </div>
    </div>

    <header class="px-6 pb-2">
      <h1 class="text-2xl font-bold leading-tight">${program.title}</h1>
      ${program.requirements ? `
        <p class="text-sm text-slate-400 mt-1">${program.requirements}</p>
      ` : ''}
      <p class="text-xs text-slate-500 mt-2">
        <span data-region="completed-count">${completed.size}</span> / ${total} complete
      </p>
    </header>

    <main class="flex-1 px-6 pb-32">
      <ul data-region="exercises" class="space-y-2 mt-4"></ul>

      <button
        data-action="share"
        class="btn-ghost w-full mt-6 flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        <span>Share program</span>
      </button>
    </main>
  `, program.title);

  wireBack(container);

  // Render exercise cards
  const list = container.querySelector('[data-region="exercises"]');
  const renderList = () => {
    list.innerHTML = '';
    program.exercises.forEach((ex, i) => {
      const li = document.createElement('li');
      const card = createExerciseCard(ex, {
        isExpanded: i === expandedIndex,
        isCompleted: completed.has(i),
        onToggle: (idx) => {
          expandedIndex = (expandedIndex === idx) ? -1 : idx;
          renderList();
        },
        onComplete: (idx) => {
          const next = toggleProgress(program.id, idx);
          completed.clear();
          next.forEach(v => completed.add(v));
          updateProgress(container, completed.size, total);
          renderList();
        }
      }, i);
      li.appendChild(card);
      list.appendChild(li);
    });
  };
  renderList();

  // Share button
  container.querySelector('[data-action="share"]')?.addEventListener('click', () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: `Check out this workout: ${program.title}`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => {
        alert('Program link copied to clipboard');
      }).catch(() => {
        prompt('Copy this link:', url);
      });
    }
  });
}

function updateProgress(container, count, total) {
  const bar = container.querySelector('[data-region="progress-bar"]');
  if (bar) bar.style.width = `${(count / total) * 100}%`;
  const text = container.querySelector('[data-region="completed-count"]');
  if (text) text.textContent = String(count);
}

function renderShell(content, title = 'Program') {
  return `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${title}</span>
      </header>
      ${content}
    </div>
  `;
}

function wireBack(container) {
  container.querySelector('[data-action="back"]')
    ?.addEventListener('click', () => navigate('/programs'));
}

function renderNotFound(container, id) {
  container.innerHTML = renderShell(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">Couldn't find a program with id <code class="text-slate-300">${id}</code>.</p>
      </div>
    </main>
  `);
  wireBack(container);
}

function renderError(container, err) {
  container.innerHTML = renderShell(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold text-red-400 mb-2">Couldn't load program</h2>
        <p class="text-sm text-slate-400">${err?.message || err}</p>
      </div>
    </main>
  `);
  wireBack(container);
}
