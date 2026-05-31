// ProgramEditorPage: metadata form + exercise picker + timeline with inline editing
import { navigate } from '../utils/router.js';
import { renderExercisePicker, addToIndex } from '../components/ExercisePicker.js';
import { renderDemoManager } from '../components/DemoManager.js';
import { renderDemoCarousel } from '../components/DemoCarousel.js';
import { renderStudioTimeline } from '../components/StudioTimeline.js';
import { loadWorkouts, loadExercises } from '../utils/data.js';

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
  // Show chooser: Start fresh vs Edit existing
  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Programs</span>
      </header>
      <main class="flex-1 px-6 pb-24 pt-8">
        <h1 class="h-page mb-2">Program Studio</h1>
        <p class="text-sm text-slate-400 mb-8">What would you like to do?</p>
        <div class="space-y-3">
          <button data-action="start-fresh" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Create new program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Start from scratch</p>
              </div>
            </div>
          </button>
          <button data-action="edit-existing" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up" style="animation-delay:50ms">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Edit existing program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Modify an existing program</p>
              </div>
            </div>
          </button>
          <button data-action="clone-existing" class="w-full card p-5 text-left active:scale-[0.98] transition-transform animate-slide-up" style="animation-delay:100ms">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
              <div class="flex-1">
                <h2 class="font-semibold tracking-tight text-sm">Clone existing program</h2>
                <p class="text-xs text-slate-400 mt-0.5">Copy as a starting point for a new one</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  `;

  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/studio'));
  container.querySelector('[data-action="start-fresh"]')?.addEventListener('click', () => {
    launchEditor(container, null, false);
  });
  container.querySelector('[data-action="edit-existing"]')?.addEventListener('click', async () => {
    const match = await pickProgram();
    if (match) launchEditor(container, match, true);
  });
  container.querySelector('[data-action="clone-existing"]')?.addEventListener('click', async () => {
    const match = await pickProgram();
    if (match) launchEditor(container, match, false);
  });
}

function launchEditor(container, program, keepId) {
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
        <span data-region="header-title" class="text-sm font-medium text-slate-400 flex-1">${program ? (keepId ? 'Edit: ' + esc(program.title) : 'New (from ' + esc(program.title) + ')') : 'New Program'}</span>
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
  wireUnsavedGuard();

  // Pre-load program if editing/cloning
  if (program) {
    loadProgramIntoState(container, program, keepId);
  }
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
        exerciseNote: exercise.recommendations?.note || '',
        reps: exercise.recommendations?.reps || '',
        sets: exercise.recommendations?.sets || '',
        repUnits: exercise.recommendations?.repUnits || 'reps',
        note: '',
        tags: []
      });
      renderTimeline(container);
    },
    onCreateNew: (searchText) => {
      openExerciseSlideOver(container, searchText);
    }
  });
}

// --- Timeline rendering (delegates to StudioTimeline component) ---

function renderTimeline(container) {
  const list = container.querySelector('[data-region="timeline"]');
  const empty = container.querySelector('[data-region="empty-timeline"]');
  const count = container.querySelector('[data-region="item-count"]');
  const exportSection = container.querySelector('[data-region="export-section"]');
  if (!list) return;
  count.textContent = `${state.items.length} item${state.items.length !== 1 ? 's' : ''}`;
  if (state.items.length === 0) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    exportSection?.classList.add('hidden');
    return;
  }
  list.classList.remove('hidden');
  empty.classList.add('hidden');
  exportSection?.classList.toggle('hidden', !state.meta.title.trim());

  renderStudioTimeline(list, { items: state.items, expandedIndex }, {
    onEdit: (idx) => {
      expandedIndex = expandedIndex === idx ? -1 : idx;
      renderTimeline(container);
    },
    onRemove: (idx) => {
      state.items.splice(idx, 1);
      if (expandedIndex === idx) expandedIndex = -1;
      else if (expandedIndex > idx) expandedIndex--;
      renderTimeline(container);
    },
    onMove: (from, to) => {
      const [moved] = state.items.splice(from, 1);
      state.items.splice(to, 0, moved);
      if (expandedIndex === from) expandedIndex = to;
      else if (from < expandedIndex && to >= expandedIndex) expandedIndex--;
      else if (from > expandedIndex && to <= expandedIndex) expandedIndex++;
      renderTimeline(container);
    },
    onGroup: (idx, direction, kind) => {
      const otherIdx = direction === 'above' ? idx - 1 : idx + 1;
      const first = Math.min(idx, otherIdx);
      const members = [state.items[first], state.items[first + 1]];
      const group = { type: 'group', kind, note: '', tags: [], members };
      state.items.splice(first, 2, group);
      expandedIndex = -1;
      renderTimeline(container);
    },
    onJoinGroup: (singleIdx, groupIdx) => {
      // Single joins an existing group
      const single = state.items[singleIdx];
      const group = state.items[groupIdx];
      group.members.push(single);
      state.items.splice(singleIdx, 1);
      expandedIndex = -1;
      renderTimeline(container);
    },
    onAbsorbIntoGroup: (groupIdx, singleIdx) => {
      // Group absorbs an adjacent single
      const single = state.items[singleIdx];
      const group = state.items[groupIdx];
      if (singleIdx < groupIdx) group.members.unshift(single);
      else group.members.push(single);
      state.items.splice(singleIdx, 1);
      expandedIndex = -1;
      renderTimeline(container);
    },
    onMemberMove: (groupIdx, memberIdx, toIdx) => {
      const group = state.items[groupIdx];
      if (!group || group.type !== 'group') return;
      const [moved] = group.members.splice(memberIdx, 1);
      group.members.splice(toIdx, 0, moved);
      renderTimeline(container);
    },
    onMemberRemove: (groupIdx, memberIdx) => {
      const group = state.items[groupIdx];
      if (!group || group.type !== 'group') return;
      const [removed] = group.members.splice(memberIdx, 1);
      // If only 1 member left, auto-ungroup
      if (group.members.length <= 1) {
        const remaining = group.members[0] || removed;
        remaining.type = 'single';
        state.items.splice(groupIdx, 1, remaining);
      }
      expandedIndex = -1;
      renderTimeline(container);
    },
    onUngroup: (idx) => {
      const group = state.items[idx];
      if (group.type !== 'group') return;
      const singles = group.members.map(m => ({ ...m, type: 'single' }));
      state.items.splice(idx, 1, ...singles);
      expandedIndex = -1;
      renderTimeline(container);
    }
  });

  // Render edit form for expanded item
  if (expandedIndex >= 0 && expandedIndex < state.items.length) {
    const formSlot = list.querySelector(`[data-region="edit-form"][data-idx="${expandedIndex}"]`);
    if (formSlot) renderEditForm(formSlot, state.items[expandedIndex], expandedIndex, container);
  }
}

function renderEditForm(slot, item, idx, container) {
  const UNITS = ['reps', 'secs', 'min', 'yd', 'rep', 'reps (each side)', 'secs (each side)'];
  const TAGS = ['warmup', 'stretch'];

  slot.innerHTML = `
    <div class="px-4 pb-4 pt-3 space-y-3 bg-slate-900/40">
      <div data-demo-preview="${idx}"></div>
      <div class="grid grid-cols-3 gap-2">
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label>
          <input data-edit="reps" value="${esc(item.reps || '')}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label>
          <input data-edit="sets" value="${esc(item.sets || '')}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500"/></div>
        <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label>
          <select data-edit="repUnits" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-hidden focus:border-brand-500">
            ${UNITS.map(u => `<option value="${u}"${(item.repUnits || 'reps') === u ? ' selected' : ''}>${u}</option>`).join('')}
          </select></div>
      </div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label>
        <input data-edit="note" value="${esc(item.note || '')}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-brand-500"/></div>
      <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label>
        <div class="flex gap-2">${TAGS.map(t => `
          <button type="button" data-pill="${t}" class="px-3 py-1.5 rounded-full text-xs font-medium transition-all ${(item.tags || []).includes(t) ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">${t}</button>`).join('')}
        </div></div>
    </div>
  `;

  // Wire edit fields
  slot.querySelectorAll('[data-edit]').forEach(el => {
    const update = () => { item[el.dataset.edit] = el.value; };
    el.addEventListener('input', update);
    el.addEventListener('change', update);
  });

  // Wire tag pills
  slot.querySelectorAll('[data-pill]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!item.tags) item.tags = [];
      const tag = btn.dataset.pill;
      if (item.tags.includes(tag)) item.tags = item.tags.filter(t => t !== tag);
      else item.tags.push(tag);
      renderTimeline(container);
    });
  });

  // Demo preview
  const previewSlot = slot.querySelector(`[data-demo-preview="${idx}"]`);
  if (previewSlot && item.exerciseId) {
    renderDemoPreview(previewSlot, item.exerciseId);
  }
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

// --- Clone/Edit handled by chooser page above ---

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
      exerciseNote: item.note || '',
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
    container.querySelector('[data-region="header-title"]').textContent = `Edit: ${match.title}`;
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

function openExerciseSlideOver(container, prefillName = '') {
  const panel = container.querySelector('[data-region="exercise-slideover"]');
  if (!panel) return;

  // Reset fields
  newExDemos = [];
  panel.querySelector('[data-exfield="name"]').value = prefillName;
  panel.querySelector('[data-exfield="reps"]').value = '';
  panel.querySelector('[data-exfield="sets"]').value = '';
  panel.querySelector('[data-exfield="repUnits"]').value = 'reps';
  panel.querySelector('[data-exfield="note"]').value = '';

  // Show id preview for prefilled name
  const idFromPrefill = prefillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '');
  panel.querySelector('[data-region="ex-id-preview"]').textContent = idFromPrefill ? `id: ${idFromPrefill}` : '';

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
    async () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        return;
      }
      const id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+$/g, '');

      // Check for duplicate name/id
      const { exercises } = await loadExercises();
      const existing = exercises.find((e) => e.id === id || e.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        const proceed = confirm(`An exercise named "${existing.name}" already exists (id: ${existing.id}).\n\nDo you still want to create "${name}"?`);
        if (!proceed) return;
      }
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
        exerciseNote: note || '',
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
