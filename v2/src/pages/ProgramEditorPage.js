// ProgramEditorPage: metadata form + exercise picker + timeline
import { navigate } from '../utils/router.js';
import { renderExercisePicker } from '../components/ExercisePicker.js';

// Editor state (module-level singleton for this session)
const state = createFreshState();

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
  // Reset state for a fresh program
  Object.assign(state, createFreshState());

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
        <!-- Metadata -->
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

        <!-- Timeline -->
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

        <!-- Picker -->
        <section class="space-y-3">
          <h2 class="eyebrow">Add Exercise</h2>
          <div data-region="picker"></div>
        </section>
      </main>
    </div>
  `;

  wireBack(container);
  wireMetaForm(container);
  wirePicker(container);
  renderTimeline(container);
}

function wireBack(container) {
  container.querySelector('[data-action="back"]')
    ?.addEventListener('click', () => navigate('/studio'));
}

function wireMetaForm(container) {
  const titleInput = container.querySelector('[data-field="title"]');
  const reqsInput = container.querySelector('[data-field="requirements"]');
  const idPreview = container.querySelector('[data-region="id-preview"]');

  titleInput?.addEventListener('input', () => {
    state.meta.title = titleInput.value;
    state.meta.id = deriveId(titleInput.value);
    idPreview.textContent = state.meta.id ? `id: ${state.meta.id}` : '';
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
        displayName: '',
        tags: []
      });
      renderTimeline(container);
    },
    onCreateNew: () => {
      // TODO: Task 7 — open exercise creation slide-over
      alert('Exercise creation coming in a future update.');
    }
  });
}

let expandedIndex = -1;

function renderTimeline(container) {
  const list = container.querySelector('[data-region="timeline"]');
  const empty = container.querySelector('[data-region="empty-timeline"]');
  const count = container.querySelector('[data-region="item-count"]');
  if (!list) return;
  count.textContent = `${state.items.length} item${state.items.length !== 1 ? 's' : ''}`;
  if (state.items.length === 0) { list.classList.add('hidden'); empty.classList.remove('hidden'); return; }
  list.classList.remove('hidden'); empty.classList.add('hidden');
  list.innerHTML = state.items.map((item, i) => timelineItem(item, i)).join('');
  wireTimelineActions(container);
}

function timelineItem(item, i) {
  const open = i === expandedIndex;
  return `<li class="card overflow-hidden" data-item-index="${i}">
  <div class="flex items-center gap-3 px-4 py-3">
    <span class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0 num">${i + 1}</span>
    <button data-action="toggle-edit" data-index="${i}" class="flex-1 min-w-0 text-left touch-manipulation">
      <p class="text-sm font-medium text-slate-100 truncate">${escapeHtml(item.displayName || item.exerciseName)}</p>
      <p class="text-xs text-slate-400 num">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets${item.tags.length ? ' · ' + item.tags.join(', ') : ''}</p>
    </button>
    <div class="flex items-center gap-0.5">
      <button data-action="move-up" data-index="${i}" class="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 ${i === 0 ? 'opacity-30 pointer-events-none' : ''}" aria-label="Move up"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>
      <button data-action="move-down" data-index="${i}" class="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 ${i === state.items.length - 1 ? 'opacity-30 pointer-events-none' : ''}" aria-label="Move down"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
      <button data-action="remove" data-index="${i}" class="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400" aria-label="Remove"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
  </div>
  ${open ? itemEditForm(item, i) : ''}
</li>`;
}

function itemEditForm(item, i) {
  const units = ['reps','secs','min','yd','rep','reps (each side)','secs (each side)'];
  const tags = ['warmup','cooldown','stretch','main','accessory','finisher'];
  return `<div class="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800 bg-slate-900/40">
  <div class="grid grid-cols-3 gap-2">
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Reps</label><input data-edit="reps" data-index="${i}" value="${escapeHtml(item.reps)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Sets</label><input data-edit="sets" data-index="${i}" value="${escapeHtml(item.sets)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"/></div>
    <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Units</label><select data-edit="repUnits" data-index="${i}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500">${units.map(u=>`<option value="${u}"${item.repUnits===u?' selected':''}>${u}</option>`).join('')}</select></div>
  </div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Display Name</label><input data-edit="displayName" data-index="${i}" value="${escapeHtml(item.displayName)}" placeholder="${escapeHtml(item.exerciseName)}" class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"/></div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Note</label><input data-edit="note" data-index="${i}" value="${escapeHtml(item.note)}" placeholder="Form cues, weight, etc." class="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"/></div>
  <div><label class="text-[10px] text-slate-500 uppercase block mb-1">Tags</label><div class="flex flex-wrap gap-2">${tags.map(t=>`<label class="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" data-tag="${t}" data-index="${i}"${item.tags.includes(t)?' checked':''} class="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-brand-500"/><span class="text-slate-300">${t}</span></label>`).join('')}</div></div>
</div>`;
}

function wireTimelineActions(container) {
  const list = container.querySelector('[data-region="timeline"]');
  if (!list) return;
  list.querySelectorAll('[data-action="toggle-edit"]').forEach(btn => {
    btn.addEventListener('click', () => { expandedIndex = expandedIndex === +btn.dataset.index ? -1 : +btn.dataset.index; renderTimeline(container); });
  });
  list.querySelectorAll('[data-action="move-up"]').forEach(btn => {
    btn.addEventListener('click', () => { const i = +btn.dataset.index; if (i > 0) { [state.items[i-1],state.items[i]]=[state.items[i],state.items[i-1]]; if(expandedIndex===i)expandedIndex=i-1;else if(expandedIndex===i-1)expandedIndex=i; renderTimeline(container); } });
  });
  list.querySelectorAll('[data-action="move-down"]').forEach(btn => {
    btn.addEventListener('click', () => { const i = +btn.dataset.index; if (i < state.items.length-1) { [state.items[i],state.items[i+1]]=[state.items[i+1],state.items[i]]; if(expandedIndex===i)expandedIndex=i+1;else if(expandedIndex===i+1)expandedIndex=i; renderTimeline(container); } });
  });
  list.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', () => { const i = +btn.dataset.index; state.items.splice(i,1); if(expandedIndex===i)expandedIndex=-1;else if(expandedIndex>i)expandedIndex--; renderTimeline(container); });
  });
  list.querySelectorAll('[data-edit]').forEach(el => {
    const handler = () => { state.items[+el.dataset.index][el.dataset.edit] = el.value; };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });
  list.querySelectorAll('[data-tag]').forEach(cb => {
    cb.addEventListener('change', () => { const tags = state.items[+cb.dataset.index].tags; if(cb.checked&&!tags.includes(cb.dataset.tag))tags.push(cb.dataset.tag);else state.items[+cb.dataset.index].tags=tags.filter(t=>t!==cb.dataset.tag); });
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}
