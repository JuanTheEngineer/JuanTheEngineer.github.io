// ProgramEditorPage: metadata form + exercise picker + timeline with inline editing
import { navigate } from '../utils/router.js';
import { renderExercisePicker } from '../components/ExercisePicker.js';

// Editor state (module-level singleton for this session)
let state = createFreshState();
let expandedIndex = -1;

function createFreshState() {
  return {
    meta: { title: '', id: '', requirements: '', description: '', difficulty: '', duration: '' },
    items: [],
    newExercises: []
  };
}

function deriveId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/g, '');
}

export function renderProgramEditorPage(container) {
  state = createFreshState();
  expandedIndex = -1;

  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">New Program</span>
      </header>
      <main class="flex-1 px-6 pb-32 pt-6 space-y-8">
        <section class="space-y-4">
          <h2 class="eyebrow">Program Details</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Title *</label>
              <input data-field="title" type="text" placeholder="e.g. Lower Body Rebuild A"
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
              <p data-region="id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Requirements</label>
              <input data-field="requirements" type="text" placeholder="e.g. Dumbbells, Bench"
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
            </div>
          </div>
        </section>
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="eyebrow">Exercises</h2>
            <span data-region="item-count" class="text-[11px] text-slate-500 num">0 items</span>
          </div>
          <ul data-region="timeline" class="space-y-2"></ul>
          <div data-region="empty-timeline" class="card p-6 text-center">
            <p class="text-sm text-slate-400">No exercises yet. Search below to add.</p>
          </div>
        </section>
        <section class="space-y-3">
          <h2 class="eyebrow">Add Exercise</h2>
          <div data-region="picker"></div>
        </section>

        <!-- Export -->
        <section data-region="export-section" class="hidden space-y-3 pt-4 border-t border-slate-800">
          <h2 class="eyebrow">Export</h2>
          <button data-action="export" class="btn-primary w-full text-sm">Export Program JSON</button>
        </section>
      </main>

      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content" class="space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  wireBack(container);
  wireMetaForm(container);
  wirePicker(container);
  renderTimeline(container);
  wireExport(container);
}

function wireBack(container) {
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/studio'));
}

function wireMetaForm(container) {
  const titleInput = container.querySelector('[data-field="title"]');
  const reqsInput = container.querySelector('[data-field="requirements"]');
  const idPreview = container.querySelector('[data-region="id-preview"]');
  const exportSection = container.querySelector('[data-region="export-section"]');
  titleInput?.addEventListener('input', () => {
    state.meta.title = titleInput.value;
    state.meta.id = deriveId(titleInput.value);
    idPreview.textContent = state.meta.id ? `id: ${state.meta.id}` : '';
    // Show export button when title + items exist
    exportSection?.classList.toggle('hidden', !state.meta.title.trim() || state.items.length === 0);
  });
  reqsInput?.addEventListener('input', () => { state.meta.requirements = reqsInput.value; });
}

function wirePicker(container) {
  const pickerSlot = container.querySelector('[data-region="picker"]');
  renderExercisePicker(pickerSlot, {
    onSelect: (exercise) => {
      state.items.push({
        type: 'single', exerciseId: exercise.id, exerciseName: exercise.name,
        reps: exercise.recommendations?.reps || '', sets: exercise.recommendations?.sets || '',
        repUnits: exercise.recommendations?.repUnits || 'reps', note: '', displayName: '', tags: []
      });
      renderTimeline(container);
    },
    onCreateNew: () => { alert('Exercise creation coming in a future update.'); }
  });
}

// --- Timeline rendering with inline editing ---

function renderTimeline(container) {
  const list = container.querySelector('[data-region="timeline"]');
  const empty = container.querySelector('[data-region="empty-timeline"]');
  const count = container.querySelector('[data-region="item-count"]');
  const exportSection = container.querySelector('[data-region="export-section"]');
  if (!list) return;
  count.textContent = `${state.items.length} item${state.items.length !== 1 ? 's' : ''}`;
  if (state.items.length === 0) { list.classList.add('hidden'); empty.classList.remove('hidden'); exportSection?.classList.add('hidden'); return; }
  list.classList.remove('hidden'); empty.classList.add('hidden');
  exportSection?.classList.toggle('hidden', !state.meta.title.trim());
  list.innerHTML = state.items.map((item, i) => timelineCard(item, i)).join('');
  wireTimelineActions(container);
}

function timelineCard(item, i) {
  const open = i === expandedIndex;
  const tagStr = item.tags.length ? ' · ' + item.tags.join(', ') : '';
  return `<li class="card overflow-hidden" data-item-index="${i}">
  <div class="flex items-center gap-3 px-4 py-3">
    <span class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0 num">${i + 1}</span>
    <button data-action="toggle-edit" data-index="${i}" class="flex-1 min-w-0 text-left touch-manipulation">
      <p class="text-sm font-medium text-slate-100 truncate">${esc(item.displayName || item.exerciseName)}</p>
      <p class="text-xs text-slate-400 num">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets${tagStr}</p>
    </button>
    <div class="flex items-center gap-0.5 flex-shrink-0">
      ${moveBtn('up', i, i === 0)}
      ${moveBtn('down', i, i === state.items.length - 1)}
      <button data-action="remove" data-index="${i}" class="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
  ${open ? editForm(item, i) : ''}
</li>`;
}

function moveBtn(dir, i, disabled) {
  const path = dir === 'up' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7';
  return `<button data-action="move-${dir}" data-index="${i}" class="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors ${disabled ? 'opacity-30 pointer-events-none' : ''}" aria-label="Move ${dir}">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="${path}"/></svg>
  </button>`;
}

function editForm(item, i) {
  const UNITS = ['reps','secs','min','yd','rep','reps (each side)','secs (each side)'];
  const TAGS = ['warmup','cooldown','stretch','main','accessory','finisher'];
  return `<div class="px-4 pb-4 pt-2 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
  <div class="grid grid-cols-3 gap-2">
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
      <input data-edit="reps" data-index="${i}" value="${esc(item.reps)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
      <input data-edit="sets" data-index="${i}" value="${esc(item.sets)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
      <select data-edit="repUnits" data-index="${i}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500">
        ${UNITS.map(u => `<option value="${u}"${item.repUnits === u ? ' selected' : ''}>${u}</option>`).join('')}
      </select></div>
  </div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Display Name</label>
    <input data-edit="displayName" data-index="${i}" value="${esc(item.displayName)}" placeholder="${esc(item.exerciseName)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"/></div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
    <input data-edit="note" data-index="${i}" value="${esc(item.note)}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"/></div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
    <div class="flex flex-wrap gap-2">${TAGS.map(t => `
      <label class="flex items-center gap-1.5 text-xs cursor-pointer select-none">
        <input type="checkbox" data-tag="${t}" data-index="${i}"${item.tags.includes(t) ? ' checked' : ''} class="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-brand-500 focus:ring-brand-500/30"/>
        <span class="text-slate-300">${t}</span>
      </label>`).join('')}
    </div></div>
</div>`;
}

function wireTimelineActions(container) {
  const list = container.querySelector('[data-region="timeline"]');
  if (!list) return;

  // Toggle expand
  list.querySelectorAll('[data-action="toggle-edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      expandedIndex = expandedIndex === +btn.dataset.index ? -1 : +btn.dataset.index;
      renderTimeline(container);
    });
  });

  // Move up/down
  list.querySelectorAll('[data-action="move-up"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.index;
      if (i > 0) { swap(i, i - 1); renderTimeline(container); }
    });
  });
  list.querySelectorAll('[data-action="move-down"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.index;
      if (i < state.items.length - 1) { swap(i, i + 1); renderTimeline(container); }
    });
  });

  // Remove
  list.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.index;
      state.items.splice(i, 1);
      if (expandedIndex === i) expandedIndex = -1;
      else if (expandedIndex > i) expandedIndex--;
      renderTimeline(container);
    });
  });

  // Inline field edits (reps, sets, repUnits, displayName, note)
  list.querySelectorAll('[data-edit]').forEach(el => {
    const update = () => { state.items[+el.dataset.index][el.dataset.edit] = el.value; };
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });

  // Tag checkboxes
  list.querySelectorAll('[data-tag]').forEach(cb => {
    cb.addEventListener('change', () => {
      const item = state.items[+cb.dataset.index];
      if (cb.checked && !item.tags.includes(cb.dataset.tag)) item.tags.push(cb.dataset.tag);
      else item.tags = item.tags.filter(t => t !== cb.dataset.tag);
    });
  });
}

function swap(a, b) {
  [state.items[a], state.items[b]] = [state.items[b], state.items[a]];
  if (expandedIndex === a) expandedIndex = b;
  else if (expandedIndex === b) expandedIndex = a;
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

// --- Export ---

function wireExport(container) {
  const modal = container.querySelector('[data-region="export-modal"]');
  container.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    showExportModal(container);
  });
  container.querySelector('[data-action="close-export"]')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function showExportModal(container) {
  const modal = container.querySelector('[data-region="export-modal"]');
  const content = container.querySelector('[data-region="export-content"]');
  if (!modal || !content) return;

  const programJson = buildProgramExport();
  const sections = [];

  // New exercises (if any)
  if (state.newExercises.length > 0) {
    sections.push({ label: 'New Exercises (append to exercises.json → exercises[])', json: state.newExercises });
  }

  // Program
  sections.push({ label: 'Program (append to workouts.json → programs[])', json: programJson });

  content.innerHTML = sections.map((s, idx) => `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${s.label}</p>
        <button data-action="copy-json" data-section="${idx}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${esc(JSON.stringify(s.json, null, 2))}</code></pre>
    </div>
  `).join('');

  // Wire copy buttons
  content.querySelectorAll('[data-action="copy-json"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.section;
      const text = JSON.stringify(sections[idx].json, null, 2);
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = '✓ Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }).catch(() => { prompt('Copy:', text); });
    });
  });

  modal.classList.remove('hidden');
}

function buildProgramExport() {
  const prog = { id: state.meta.id, title: state.meta.title };
  if (state.meta.requirements) prog.requirements = state.meta.requirements;
  if (state.meta.description) prog.description = state.meta.description;
  if (state.meta.difficulty) prog.difficulty = state.meta.difficulty;
  if (state.meta.duration) prog.duration = Number(state.meta.duration);

  prog.items = state.items.map(item => {
    const out = { exerciseId: item.exerciseId };
    if (item.reps) out.reps = item.reps;
    if (item.sets) out.sets = item.sets;
    if (item.repUnits && item.repUnits !== 'reps') out.repUnits = item.repUnits;
    if (item.note) out.note = item.note;
    if (item.displayName) out.displayName = item.displayName;
    if (item.tags.length) out.tags = item.tags;
    return out;
  });

  return prog;
}
