// Program detail page: HCI design winner — expanding rows + timeline
import { getResolvedProgram } from '../utils/data.js';
import { navigate } from '../utils/router.js';
import { createExerciseCard } from '../components/ExerciseCard.js';
import { createGroupCard } from '../components/GroupCard.js';
import { celebrate } from '../components/Celebration.js';
import { getProgress, toggleProgress, resetProgress, recordProgramVisit } from '../utils/storage.js';

export async function renderProgramDetailPage(container, programId) {
  container.innerHTML = renderShell(`
    <main class="flex-1 px-6 pb-24 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </main>
  `);
  wireBack(container);

  try {
    const program = await getResolvedProgram(programId);
    if (!program) {
      renderNotFound(container, programId);
      return;
    }
    recordProgramVisit(program.id);
    renderContent(container, program);
  } catch (err) {
    renderError(container, err);
  }
}

function renderContent(container, program) {
  const completed = getProgress(program.id);
  const total = program.resolvedItems.length;
  let expandedIndex = -1; // Don't auto-open anything; let user decide

  container.innerHTML = renderShell(
    `
    <div class="sticky top-[3.75rem] z-10 px-6 pt-2 pb-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-900">
      <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div data-region="progress-bar" class="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500" style="width: ${(completed.size / total) * 100}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-1.5 font-medium num">
        <span data-region="completed-count">${completed.size}</span> of ${total} complete
      </p>
    </div>

    <header class="px-6 pt-4 pb-3">
      <h1 class="h-page">${escapeHtml(program.title)}</h1>
      ${
        program.requirements
          ? `
        <p class="text-sm text-slate-400 mt-1.5">${escapeHtml(program.requirements)}</p>
      `
          : ''
      }
    </header>

    <main class="flex-1 px-6 pb-32 pt-2">
      <ul data-region="items" class="space-y-2.5"></ul>

      <div data-region="actions" class="mt-8 space-y-3 hidden">
        <button data-action="reset" class="btn-ghost w-full text-slate-500 hover:text-red-400 text-sm">
          Reset progress
        </button>
      </div>

      <button data-action="share" class="btn-ghost w-full mt-6 flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        <span>Share program</span>
      </button>
    </main>
  `,
    program.title
  );

  wireBack(container);

  const list = container.querySelector('[data-region="items"]');
  const actions = container.querySelector('[data-region="actions"]');

  const renderList = () => {
    list.innerHTML = '';
    program.resolvedItems.forEach((item, i) => {
      const li = document.createElement('li');
      const cardState = {
        index: i,
        isExpanded: i === expandedIndex,
        isCompleted: completed.has(i),
        onToggle: (idx) => {
          expandedIndex = expandedIndex === idx ? -1 : idx;
          renderAll();
          // Smooth-scroll the newly opened card into view (below the sticky header)
          if (expandedIndex === idx) {
            requestAnimationFrame(() => {
              const card = list.querySelector(`[data-item-index="${idx}"]`);
              if (card) {
                const offset = window.scrollY + card.getBoundingClientRect().top - 130;
                window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
              }
            });
          }
        },
        onComplete: (idx) => {
          const wasComplete = completed.size === total;
          const next = toggleProgress(program.id, idx);
          completed.clear();
          next.forEach((v) => completed.add(v));
          // Auto-collapse on completion (smoother UX). User can re-open if needed.
          if (next.has(idx) && expandedIndex === idx) {
            expandedIndex = -1;
          }
          renderAll();
          // Celebrate when crossing the finish line (and not on un-complete)
          if (!wasComplete && completed.size === total) {
            setTimeout(celebrate, 250);
          }
        }
      };
      const card = item.kind === 'single' ? createExerciseCard(item, cardState) : createGroupCard(item, cardState);
      li.appendChild(card);
      list.appendChild(li);
    });
  };

  const updateProgressBar = () => {
    const bar = container.querySelector('[data-region="progress-bar"]');
    if (bar) bar.style.width = `${(completed.size / total) * 100}%`;
    const text = container.querySelector('[data-region="completed-count"]');
    if (text) text.textContent = String(completed.size);
    actions.classList.toggle('hidden', completed.size === 0);
  };

  const renderAll = () => {
    renderList();
    updateProgressBar();
  };

  renderAll();

  // Reset button
  container.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    if (confirm('Reset progress for this program?')) {
      resetProgress(program.id);
      completed.clear();
      renderAll();
    }
  });

  // Share button
  container.querySelector('[data-action="share"]')?.addEventListener('click', () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: program.title, text: `Check out: ${program.title}`, url }).catch(() => {});
    } else {
      navigator.clipboard
        ?.writeText(url)
        .then(() => alert('Link copied!'))
        .catch(() => prompt('Copy:', url));
    }
  });
}

function renderShell(content, title = 'Program') {
  return `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 truncate">${escapeHtml(title)}</span>
      </header>
      ${content}
    </div>
  `;
}

function wireBack(container) {
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/programs'));
}

function renderNotFound(container, id) {
  container.innerHTML = renderShell(`
    <main class="flex-1 px-6 pt-12 pb-24">
      <div class="card p-6">
        <h2 class="font-semibold mb-2">Program not found</h2>
        <p class="text-sm text-slate-400">No program with id <code class="text-slate-300">${escapeHtml(id)}</code>.</p>
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
        <p class="text-sm text-slate-400">${escapeHtml(err?.message || String(err))}</p>
      </div>
    </main>
  `);
  wireBack(container);
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
