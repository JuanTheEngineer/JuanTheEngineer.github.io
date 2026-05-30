// ExerciseEditorPage: create new OR edit existing exercises
import { navigate } from '../utils/router.js';
import { renderDemoManager } from '../components/DemoManager.js';
import { searchExercises } from '../components/ExercisePicker.js';

let demos = [];
let editingExisting = false;
let originalId = '';

export function renderExerciseEditorPage(container) {
  demos = [];
  editingExisting = false;
  originalId = '';

  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span data-region="header-title" class="text-sm font-medium text-slate-400">New Exercise</span>
      </header>
      <main class="flex-1 px-6 pb-32 pt-6 space-y-6">

        <!-- Search existing to edit -->
        <section class="space-y-3">
          <h2 class="eyebrow">Find exercise to edit</h2>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input data-input="edit-search" type="text" placeholder="Search to edit an existing exercise..."
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
          </div>
          <ul data-region="edit-results" class="space-y-1 max-h-[200px] overflow-y-auto hidden"></ul>
          <div class="text-center">
            <p class="text-[11px] text-slate-600">or create a new one below</p>
          </div>
        </section>

        <!-- Exercise form -->
        <section class="space-y-3">
          <h2 class="eyebrow" data-region="form-label">Exercise Details</h2>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">Name *</label>
            <input data-field="name" type="text" placeholder="e.g. Backward Treadmill Walk"
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
            <p data-region="id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
              <input data-field="reps" type="text" placeholder="10" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
              <input data-field="sets" type="text" placeholder="3" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
              <select data-field="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
                <option value="reps">reps</option><option value="secs">secs</option><option value="min">min</option><option value="yd">yd</option><option value="reps (each side)">reps (each side)</option><option value="secs (each side)">secs (each side)</option>
              </select></div>
          </div>
          <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
            <input data-field="note" type="text" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
        </section>
        <section>
          <div data-region="demos"></div>
        </section>
        <section data-region="export-section" class="hidden space-y-3 pt-4 border-t border-slate-800">
          <button data-action="export" class="btn-primary w-full text-sm">Export Exercise JSON</button>
        </section>
      </main>
      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content"></div>
        </div>
      </div>
    </div>
  `;

  wireBack(container);
  wireEditSearch(container);
  wireForm(container);
  wireExport(container);
}

function wireBack(container) {
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/studio'));
}

function wireEditSearch(container) {
  const input = container.querySelector('[data-input="edit-search"]');
  const resultsList = container.querySelector('[data-region="edit-results"]');
  let debounce = null;

  input?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const query = input.value.trim();
      if (!query) {
        resultsList.classList.add('hidden');
        return;
      }
      const results = await searchExercises(query, 8);
      if (results.length === 0) {
        resultsList.classList.add('hidden');
        return;
      }
      resultsList.classList.remove('hidden');
      resultsList.innerHTML = results
        .map(
          (r) => `
        <li><button data-load-exercise="${r.id}" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-colors flex items-center gap-3 touch-manipulation">
          <span class="text-sm font-medium text-slate-100 truncate">${esc(r.name)}</span>
          ${r.hasDemos ? '<span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-sm">demo</span>' : ''}
        </button></li>
      `
        )
        .join('');
      resultsList.querySelectorAll('[data-load-exercise]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const entry = results.find((r) => r.id === btn.dataset.loadExercise);
          if (entry) loadExerciseIntoForm(container, entry.exercise);
          resultsList.classList.add('hidden');
          input.value = '';
        });
      });
    }, 150);
  });
}

function loadExerciseIntoForm(container, exercise) {
  editingExisting = true;
  originalId = exercise.id;
  demos = JSON.parse(JSON.stringify(exercise.demos || [])); // deep clone

  // Update header
  container.querySelector('[data-region="header-title"]').textContent = `Edit: ${exercise.name}`;
  container.querySelector('[data-region="form-label"]').textContent = 'Editing Exercise';

  // Fill form fields
  const nameInput = container.querySelector('[data-field="name"]');
  nameInput.value = exercise.name;
  nameInput.dispatchEvent(new Event('input'));

  const rec = exercise.recommendations || {};
  container.querySelector('[data-field="reps"]').value = rec.reps || '';
  container.querySelector('[data-field="sets"]').value = rec.sets || '';
  container.querySelector('[data-field="repUnits"]').value = rec.repUnits || 'reps';
  container.querySelector('[data-field="note"]').value = rec.note || '';

  // Re-render demo manager with loaded demos
  renderDemoManager(container.querySelector('[data-region="demos"]'), demos);

  // Show export
  container.querySelector('[data-region="export-section"]')?.classList.remove('hidden');
}

function wireForm(container) {
  const nameInput = container.querySelector('[data-field="name"]');
  const idPreview = container.querySelector('[data-region="id-preview"]');
  const exportSection = container.querySelector('[data-region="export-section"]');

  nameInput?.addEventListener('input', () => {
    if (!editingExisting) {
      const id = nameInput.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+$/g, '');
      idPreview.textContent = id ? `id: ${id}` : '';
    } else {
      idPreview.textContent = `id: ${originalId} (existing)`;
    }
    exportSection?.classList.toggle('hidden', !nameInput.value.trim());
  });

  // Render demo manager (empty for new)
  renderDemoManager(container.querySelector('[data-region="demos"]'), demos);
}

function wireExport(container) {
  const modal = container.querySelector('[data-region="export-modal"]');

  container.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    const nameInput = container.querySelector('[data-field="name"]');
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }

    const id = editingExisting
      ? originalId
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+$/g, '');
    const exercise = { id, name, demos: demos.filter((d) => d.url), recommendations: {} };

    const reps = container.querySelector('[data-field="reps"]').value;
    const sets = container.querySelector('[data-field="sets"]').value;
    const repUnits = container.querySelector('[data-field="repUnits"]').value;
    const note = container.querySelector('[data-field="note"]').value;
    if (reps) exercise.recommendations.reps = reps;
    if (sets) exercise.recommendations.sets = sets;
    if (repUnits && repUnits !== 'reps') exercise.recommendations.repUnits = repUnits;
    if (note) exercise.recommendations.note = note;

    const content = container.querySelector('[data-region="export-content"]');
    const json = JSON.stringify(exercise, null, 2);
    const label = editingExisting
      ? `Replace entry with id "${originalId}" in exercises.json`
      : 'Append to exercises.json → exercises[]';

    content.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">${label}</p>
          <button data-action="copy" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${esc(json)}</code></pre>
      </div>`;
    content.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
      navigator.clipboard?.writeText(json).then(() => {
        e.target.textContent = '✓ Copied';
        setTimeout(() => {
          e.target.textContent = 'Copy';
        }, 2000);
      });
    });
    modal.classList.remove('hidden');
  });

  container
    .querySelector('[data-action="close-export"]')
    ?.addEventListener('click', () => modal?.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
