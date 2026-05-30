// ProgramEditorPage: metadata form + exercise picker + timeline with inline editing
import { navigate } from '../utils/router.js';
import { renderExercisePicker, addToIndex } from '../components/ExercisePicker.js';
import { renderDemoManager } from '../components/DemoManager.js';
import { renderDemoCarousel } from '../components/DemoCarousel.js';
import { loadWorkouts, loadExercises } from '../utils/data.js';
import Sortable from 'sortablejs';

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
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+$/g, '');
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
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
              <p data-region="id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Requirements</label>
              <input data-field="requirements" type="text" placeholder="e.g. Dumbbells, Bench"
                class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30" />
            </div>
            <button data-action="clone" class="w-full card p-3 text-left active:scale-[0.98] transition-transform mt-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-300">Clone existing program</p>
                  <p class="text-[11px] text-slate-500">Copy as a new program</p>
                </div>
                <svg class="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
            <button data-action="edit-program" class="w-full card p-3 text-left active:scale-[0.98] transition-transform mt-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-300">Edit existing program</p>
                  <p class="text-[11px] text-slate-500">Modify and re-export</p>
                </div>
                <svg class="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        </section>
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="eyebrow">Exercises</h2>
            <div class="flex items-center gap-3">
              <button data-action="group-selected" class="hidden text-[11px] text-brand-400 hover:text-brand-300 font-medium transition-colors">Group as…</button>
              <span data-region="item-count" class="text-[11px] text-slate-500 num">0 items</span>
            </div>
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
          <div class="flex gap-3">
            <button data-action="preview" class="btn-ghost flex-1 text-sm border border-slate-700">Preview</button>
            <button data-action="export" class="btn-primary flex-1 text-sm">Export JSON</button>
          </div>
        </section>
      </main>

      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
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

      <!-- Exercise creation slide-over -->
      <div data-region="exercise-slideover" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="h-section">New Exercise</h2>
            <button data-action="close-exercise" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Exercise Name *</label>
              <input data-exfield="name" type="text" placeholder="e.g. Backward Treadmill Walk" class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"/>
              <p data-region="ex-id-preview" class="text-[11px] text-slate-500 mt-1 font-mono"></p>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
                <input data-exfield="reps" type="text" placeholder="10" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
                <input data-exfield="sets" type="text" placeholder="3" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
              <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
                <select data-exfield="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
                  <option value="reps">reps</option><option value="secs">secs</option><option value="min">min</option><option value="yd">yd</option><option value="rep">rep</option><option value="reps (each side)">reps (each side)</option><option value="secs (each side)">secs (each side)</option>
                </select></div>
            </div>
            <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
              <input data-exfield="note" type="text" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
          </div>
          <div data-region="demo-manager"></div>
          <div class="flex gap-3 pt-2">
            <button data-action="cancel-exercise" class="btn-ghost flex-1 text-sm">Cancel</button>
            <button data-action="save-exercise" class="btn-primary flex-1 text-sm">Save Exercise</button>
          </div>
        </div>
      </div>
    </div>
  `;

  wireBack(container);
  wireMetaForm(container);
  wirePicker(container);
  renderTimeline(container);
  wireExport(container);
  wireClone(container);
  wireUnsavedGuard();
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
  reqsInput?.addEventListener('input', () => {
    state.meta.requirements = reqsInput.value;
  });
}

function wirePicker(container) {
  const pickerSlot = container.querySelector('[data-region="picker"]');
  renderExercisePicker(pickerSlot, {
    onSelect: (exercise) => {
      state.items.push({
        type: 'single',
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        reps: exercise.recommendations?.reps || '',
        sets: exercise.recommendations?.sets || '',
        repUnits: exercise.recommendations?.repUnits || 'reps',
        note: '',
        tags: []
      });
      renderTimeline(container);
    },
    onCreateNew: () => {
      openExerciseSlideOver(container);
    }
  });
}

// --- Timeline rendering with inline editing ---

function renderTimeline(container) {
  const list = container.querySelector('[data-region="timeline"]');
  const empty = container.querySelector('[data-region="empty-timeline"]');
  const count = container.querySelector('[data-region="item-count"]');
  const exportSection = container.querySelector('[data-region="export-section"]');
  const groupBtn = container.querySelector('[data-action="group-selected"]');
  if (!list) return;
  count.textContent = `${state.items.length} item${state.items.length !== 1 ? 's' : ''}`;
  if (state.items.length === 0) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    exportSection?.classList.add('hidden');
    groupBtn?.classList.add('hidden');
    return;
  }
  list.classList.remove('hidden');
  empty.classList.add('hidden');
  exportSection?.classList.toggle('hidden', !state.meta.title.trim());
  // Show group button when 2+ singles exist
  const singleCount = state.items.filter((i) => i.type === 'single').length;
  groupBtn?.classList.toggle('hidden', singleCount < 2);
  list.innerHTML = state.items.map((item, i) => timelineCard(item, i)).join('');
  wireTimelineActions(container);
}

function timelineCard(item, i) {
  const open = i === expandedIndex;
  const tagStr = item.tags.length ? ' · ' + item.tags.join(', ') : '';
  const isGroup = item.type === 'group';

  if (isGroup) return groupCard(item, i);

  return `<li class="card overflow-hidden" data-item-index="${i}">
  <div class="flex items-center gap-2 px-4 py-3">
    <span class="drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-600 hover:text-slate-400 touch-manipulation">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
    </span>
    <button data-action="toggle-edit" data-index="${i}" class="flex-1 min-w-0 text-left touch-manipulation">
      <p class="text-sm font-medium text-slate-100 truncate">${esc(item.exerciseName)}</p>
      <p class="text-xs text-slate-400 num">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets${tagStr}</p>
    </button>
    <button data-action="remove" data-index="${i}" class="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0" aria-label="Remove">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  ${open ? editForm(item, i) : ''}
</li>`;
}

function groupCard(item, i) {
  const open = i === expandedIndex;
  const kindLabel = { superset: 'Super Set', compound: 'Compound', circuit: 'Circuit' }[item.kind] || item.kind;
  return `<li class="card overflow-hidden border-brand-500/30" data-item-index="${i}">
  <div class="flex items-center gap-2 px-4 py-3">
    <span class="drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-600 hover:text-slate-400 touch-manipulation">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
    </span>
    <button data-action="toggle-edit" data-index="${i}" class="flex-1 min-w-0 text-left touch-manipulation">
      <div class="flex items-center gap-1.5 mb-0.5">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${kindLabel}</span>
      </div>
      <p class="text-sm font-medium text-slate-100 truncate">${esc(item.members.map((m) => m.exerciseName).join(' + '))}</p>
    </button>
    <button data-action="ungroup" data-index="${i}" class="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors shrink-0" aria-label="Ungroup" title="Ungroup">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17H7A2 2 0 017 13h2m6 4h2a2 2 0 002-2v0a2 2 0 00-2-2h-2m-6-4h6"/></svg>
    </button>
    <button data-action="remove" data-index="${i}" class="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0" aria-label="Remove">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  ${open ? groupEditForm(item, i) : ''}
</li>`;
}

function editForm(item, i) {
  const UNITS = ['reps', 'secs', 'min', 'yd', 'rep', 'reps (each side)', 'secs (each side)'];
  const TAGS = ['warmup', 'stretch'];
  return `<div class="px-4 pb-4 pt-2 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
  <div data-demo-preview="${i}"></div>
  <div class="grid grid-cols-3 gap-2">
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
      <input data-edit="reps" data-index="${i}" value="${esc(item.reps)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
      <input data-edit="sets" data-index="${i}" value="${esc(item.sets)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
      <select data-edit="repUnits" data-index="${i}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
        ${UNITS.map((u) => `<option value="${u}"${item.repUnits === u ? ' selected' : ''}>${u}</option>`).join('')}
      </select></div>
  </div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
    <input data-edit="note" data-index="${i}" value="${esc(item.note)}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
    <div class="flex gap-2">${TAGS.map(
      (t) => `
      <button type="button" data-pill="${t}" data-index="${i}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${item.tags.includes(t) ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">${t}</button>`
    ).join('')}
    </div></div>
</div>`;
}

function groupEditForm(item, i) {
  const KINDS = ['superset', 'compound', 'circuit'];
  return `<div class="px-4 pb-4 pt-2 space-y-3 border-t border-slate-800 bg-slate-900/40 animate-fade-in">
  <div>
    <label class="text-[10px] text-slate-500 uppercase block mb-1">Group Type</label>
    <select data-group-edit="kind" data-index="${i}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
      ${KINDS.map((k) => `<option value="${k}"${item.kind === k ? ' selected' : ''}>${k}</option>`).join('')}
    </select>
  </div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
    <input data-group-edit="note" data-index="${i}" value="${esc(item.note || '')}" placeholder="Shared note for the group" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
  <div class="space-y-1.5">
    <p class="text-[10px] text-slate-500 uppercase font-semibold">Members</p>
    ${item.members
      .map(
        (m, mi) => `
      <div class="bg-slate-800/40 rounded-lg px-3 py-2 text-xs text-slate-300">${String.fromCharCode(97 + mi)}. ${esc(m.exerciseName)} — ${m.reps || '—'} ${m.repUnits || 'reps'} · ${m.sets || '—'} sets</div>
    `
      )
      .join('')}
  </div>
</div>`;
}

let sortableInstance = null;

function wireTimelineActions(container) {
  const list = container.querySelector('[data-region="timeline"]');
  if (!list) return;

  // Drag-and-drop via SortableJS
  if (sortableInstance) sortableInstance.destroy();
  sortableInstance = Sortable.create(list, {
    handle: '.drag-handle',
    animation: 200,
    ghostClass: 'opacity-30',
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;
      if (oldIndex === newIndex) return;
      const [moved] = state.items.splice(oldIndex, 1);
      state.items.splice(newIndex, 0, moved);
      if (expandedIndex === oldIndex) expandedIndex = newIndex;
      else if (oldIndex < expandedIndex && newIndex >= expandedIndex) expandedIndex--;
      else if (oldIndex > expandedIndex && newIndex <= expandedIndex) expandedIndex++;
      renderTimeline(container);
    }
  });

  // Toggle expand
  list.querySelectorAll('[data-action="toggle-edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      expandedIndex = expandedIndex === +btn.dataset.index ? -1 : +btn.dataset.index;
      renderTimeline(container);
    });
  });

  // Remove
  list.querySelectorAll('[data-action="remove"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.index;
      state.items.splice(i, 1);
      if (expandedIndex === i) expandedIndex = -1;
      else if (expandedIndex > i) expandedIndex--;
      renderTimeline(container);
    });
  });

  // Ungroup
  list.querySelectorAll('[data-action="ungroup"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.index;
      const group = state.items[i];
      if (group.type !== 'group') return;
      // Replace group with its members as singles
      const singles = group.members.map((m) => ({ ...m, type: 'single' }));
      state.items.splice(i, 1, ...singles);
      expandedIndex = -1;
      renderTimeline(container);
    });
  });

  // Inline field edits
  list.querySelectorAll('[data-edit]').forEach((el) => {
    const update = () => {
      state.items[+el.dataset.index][el.dataset.edit] = el.value;
    };
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });

  // Group edits (kind, note)
  list.querySelectorAll('[data-group-edit]').forEach((el) => {
    const update = () => {
      state.items[+el.dataset.index][el.dataset.groupEdit] = el.value;
    };
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });

  // Pill tag toggles
  list.querySelectorAll('[data-pill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.items[+btn.dataset.index];
      const tag = btn.dataset.pill;
      if (item.tags.includes(tag)) {
        item.tags = item.tags.filter((t) => t !== tag);
      } else {
        item.tags.push(tag);
      }
      renderTimeline(container);
    });
  });

  // Demo preview for expanded item
  const previewSlot = list.querySelector(`[data-demo-preview="${expandedIndex}"]`);
  if (previewSlot && expandedIndex >= 0) {
    const item = state.items[expandedIndex];
    if (item && item.exerciseId) {
      renderDemoPreview(previewSlot, item.exerciseId);
    }
  }

  // Group button (shows a prompt for kind selection)
  container.querySelector('[data-action="group-selected"]')?.addEventListener('click', () => {
    // Group the last 2 ungrouped singles (simple approach)
    const singles = state.items.reduce((acc, item, i) => {
      if (item.type === 'single') acc.push(i);
      return acc;
    }, []);
    if (singles.length < 2) return;
    const kind = prompt('Group type? (superset, compound, circuit)', 'superset');
    if (!kind || !['superset', 'compound', 'circuit'].includes(kind)) return;
    // Take last 2 singles and group them
    const lastTwo = singles.slice(-2);
    const members = lastTwo.map((i) => state.items[i]);
    const group = { type: 'group', kind, note: '', tags: [], members };
    // Remove from items (reverse order to preserve indices)
    for (let j = lastTwo.length - 1; j >= 0; j--) state.items.splice(lastTwo[j], 1);
    // Insert group at the position of the first removed item
    state.items.splice(lastTwo[0], 0, group);
    expandedIndex = -1;
    renderTimeline(container);
  });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

// --- Demo preview in timeline ---

async function renderDemoPreview(slot, exerciseId) {
  const { exercises } = await loadExercises();
  const ex = exercises.find((e) => e.id === exerciseId);
  const newEx = state.newExercises.find((e) => e.id === exerciseId);
  const demos = ex?.demos || newEx?.demos || [];

  if (demos.length === 0) {
    slot.innerHTML = `<p class="text-[11px] text-slate-600 italic">No demos available</p>`;
    return;
  }

  renderDemoCarousel(slot, demos);
}

// --- Clone from existing ---

async function wireClone(container) {
  container.querySelector('[data-action="clone"]')?.addEventListener('click', async () => {
    if (state.items.length > 0 && !confirm('This will replace your current timeline. Continue?')) return;
    const match = await pickProgram();
    if (!match) return;
    loadProgramIntoState(container, match, false);
    alert(`Cloned "${match.title}" — set a new title to continue.`);
  });

  container.querySelector('[data-action="edit-program"]')?.addEventListener('click', async () => {
    if (state.items.length > 0 && !confirm('This will replace your current timeline. Continue?')) return;
    const match = await pickProgram();
    if (!match) return;
    loadProgramIntoState(container, match, true);
  });
}

async function pickProgram() {
  const { programs } = await loadWorkouts();
  const name = prompt('Type part of a program name:\n\n' + programs.map((p) => `• ${p.title}`).join('\n'));
  if (!name) return null;
  const match = programs.find((p) => p.title.toLowerCase().includes(name.toLowerCase()));
  if (!match) {
    alert('No program found matching "' + name + '"');
    return null;
  }
  return match;
}

function loadProgramIntoState(container, match, keepId) {
  state.meta.title = keepId ? match.title : '';
  state.meta.id = keepId ? match.id : '';
  state.meta.requirements = match.requirements || '';
  state.items = (match.items || []).map((item) => {
    if (item.kind) {
      return {
        type: 'group',
        kind: item.kind,
        note: item.note || '',
        tags: item.tags || [],
        members: item.exercises.map((m) => ({
          type: 'single',
          exerciseId: m.exerciseId,
          exerciseName: m.exerciseId,
          reps: m.reps || '',
          sets: m.sets || '',
          repUnits: m.repUnits || 'reps',
          note: m.note || '',
          tags: []
        }))
      };
    }
    return {
      type: 'single',
      exerciseId: item.exerciseId,
      exerciseName: item.exerciseId,
      reps: item.reps || '',
      sets: item.sets || '',
      repUnits: item.repUnits || 'reps',
      note: item.note || '',
      tags: item.tags || []
    };
  });
  expandedIndex = -1;

  // Update UI
  const titleInput = container.querySelector('[data-field="title"]');
  titleInput.value = state.meta.title;
  titleInput.dispatchEvent(new Event('input'));
  container.querySelector('[data-field="requirements"]').value = state.meta.requirements;

  // Update header
  if (keepId) {
    container.querySelector('header span').textContent = `Edit: ${match.title}`;
  }

  renderTimeline(container);
}

// --- Unsaved changes guard ---

let guardActive = false;

function wireUnsavedGuard() {
  if (guardActive) return;
  guardActive = true;
  const handler = (e) => {
    if (state.items.length > 0 || state.meta.title) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handler);
  // Clean up when navigating away within the app
  const cleanup = () => {
    window.removeEventListener('beforeunload', handler);
    window.removeEventListener('hashchange', cleanup);
    guardActive = false;
  };
  window.addEventListener('hashchange', cleanup);
}

// --- Exercise creation slide-over ---

let newExDemos = [];

function openExerciseSlideOver(container) {
  const panel = container.querySelector('[data-region="exercise-slideover"]');
  if (!panel) return;

  // Reset fields
  newExDemos = [];
  panel.querySelector('[data-exfield="name"]').value = '';
  panel.querySelector('[data-exfield="reps"]').value = '';
  panel.querySelector('[data-exfield="sets"]').value = '';
  panel.querySelector('[data-exfield="repUnits"]').value = 'reps';
  panel.querySelector('[data-exfield="note"]').value = '';
  panel.querySelector('[data-region="ex-id-preview"]').textContent = '';

  // Render demo manager
  const demoSlot = panel.querySelector('[data-region="demo-manager"]');
  renderDemoManager(demoSlot, newExDemos);

  // Wire name → id preview
  const nameInput = panel.querySelector('[data-exfield="name"]');
  const idPreview = panel.querySelector('[data-region="ex-id-preview"]');
  nameInput.addEventListener('input', () => {
    const id = nameInput.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+$/g, '');
    idPreview.textContent = id ? `id: ${id}` : '';
  });

  // Wire save
  panel.querySelector('[data-action="save-exercise"]')?.addEventListener(
    'click',
    () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        return;
      }
      const id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+$/g, '');
      const reps = panel.querySelector('[data-exfield="reps"]').value;
      const sets = panel.querySelector('[data-exfield="sets"]').value;
      const repUnits = panel.querySelector('[data-exfield="repUnits"]').value;
      const note = panel.querySelector('[data-exfield="note"]').value;

      const newExercise = {
        id,
        name,
        demos: newExDemos.filter((d) => d.url), // only keep demos with URLs
        recommendations: {}
      };
      if (reps) newExercise.recommendations.reps = reps;
      if (sets) newExercise.recommendations.sets = sets;
      if (repUnits && repUnits !== 'reps') newExercise.recommendations.repUnits = repUnits;
      if (note) newExercise.recommendations.note = note;

      // Add to state + search index
      state.newExercises.push(newExercise);
      addToIndex(newExercise);

      // Auto-add to timeline
      state.items.push({
        type: 'single',
        exerciseId: id,
        exerciseName: name,
        reps: reps || '',
        sets: sets || '',
        repUnits: repUnits || 'reps',
        note: '',
        tags: []
      });

      panel.classList.add('hidden');
      renderTimeline(container);
    },
    { once: true }
  );

  // Wire cancel / close
  const close = () => panel.classList.add('hidden');
  panel.querySelector('[data-action="cancel-exercise"]')?.addEventListener('click', close, { once: true });
  panel.querySelector('[data-action="close-exercise"]')?.addEventListener('click', close, { once: true });

  panel.classList.remove('hidden');
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

  // Preview button
  container.querySelector('[data-action="preview"]')?.addEventListener('click', () => {
    showPreview(container);
  });
}

function showPreview(container) {
  const prog = buildProgramExport();
  // Build a simple read-only preview
  const items = prog.items || [];
  const previewHtml = `
    <div class="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="close-preview" class="btn-ghost -ml-2 px-3" aria-label="Close preview">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Preview</span>
      </header>
      <div class="px-6 pt-4 pb-3">
        <h1 class="h-page">${esc(prog.title || 'Untitled')}</h1>
        ${prog.requirements ? `<p class="text-sm text-slate-400 mt-1.5">${esc(prog.requirements)}</p>` : ''}
      </div>
      <div class="px-6 pb-24 pt-2">
        <ul class="space-y-2.5">
          ${items.map((item, i) => previewItem(item, i)).join('')}
        </ul>
      </div>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.innerHTML = previewHtml;
  container.appendChild(overlay.firstElementChild);

  container.querySelector('[data-action="close-preview"]')?.addEventListener('click', () => {
    container.querySelector('.fixed.inset-0.z-50.bg-slate-950')?.remove();
  });
}

function previewItem(item, i) {
  if (item.kind) {
    const kindLabel = { superset: 'Super Set', compound: 'Compound', circuit: 'Circuit' }[item.kind] || item.kind;
    return `<li class="card p-4 space-y-2">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-brand-500/20 text-brand-300">${kindLabel}</span>
      </div>
      <p class="text-sm font-semibold text-slate-100">${esc(item.exercises.map((e) => e.exerciseId).join(' + '))}</p>
      <div class="space-y-1.5 pl-3 border-l-2 border-slate-700">
        ${item.exercises
          .map(
            (m, mi) => `
          <div class="text-xs text-slate-300">${mi + 1}. ${esc(m.exerciseId)} — ${m.reps || '—'} ${m.repUnits || 'reps'} · ${m.sets || '—'} sets</div>
        `
          )
          .join('')}
      </div>
    </li>`;
  }
  const tags = item.tags?.length
    ? item.tags
        .map(
          (t) =>
            `<span class="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">${t}</span>`
        )
        .join('')
    : '';
  return `<li class="card px-4 py-3">
    ${tags ? `<div class="flex gap-1.5 mb-1">${tags}</div>` : ''}
    <p class="text-sm font-semibold text-slate-100">${esc(item.exerciseId)}</p>
    <p class="text-xs text-slate-400 num mt-0.5">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets</p>
    ${item.note ? `<p class="text-xs text-slate-500 mt-1">${esc(item.note)}</p>` : ''}
  </li>`;
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

  content.innerHTML = sections
    .map(
      (s, idx) => `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400 font-medium">${s.label}</p>
        <button data-action="copy-json" data-section="${idx}" class="text-xs text-brand-400 hover:text-brand-300 transition-colors">Copy</button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono leading-relaxed"><code>${esc(JSON.stringify(s.json, null, 2))}</code></pre>
    </div>
  `
    )
    .join('');

  // Wire copy buttons
  content.querySelectorAll('[data-action="copy-json"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.section;
      const text = JSON.stringify(sections[idx].json, null, 2);
      navigator.clipboard
        ?.writeText(text)
        .then(() => {
          btn.textContent = '✓ Copied';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        })
        .catch(() => {
          prompt('Copy:', text);
        });
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

  prog.items = state.items.map((item) => {
    if (item.type === 'group') {
      const group = {
        kind: item.kind,
        exercises: item.members.map((m) => {
          const out = { exerciseId: m.exerciseId };
          if (m.reps) out.reps = m.reps;
          if (m.sets) out.sets = m.sets;
          if (m.repUnits && m.repUnits !== 'reps') out.repUnits = m.repUnits;
          if (m.note) out.note = m.note;
          return out;
        })
      };
      if (item.note) group.note = item.note;
      if (item.tags?.length) group.tags = item.tags;
      return group;
    }
    const out = { exerciseId: item.exerciseId };
    if (item.reps) out.reps = item.reps;
    if (item.sets) out.sets = item.sets;
    if (item.repUnits && item.repUnits !== 'reps') out.repUnits = item.repUnits;
    if (item.note) out.note = item.note;
    if (item.tags.length) out.tags = item.tags;
    return out;
  });

  return prog;
}
