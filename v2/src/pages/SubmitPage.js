// Public Submission Builder.
//
// One mental model: everything is a workout you add exercises to. A single
// exercise submission is just a one-item workout. Each slot is either an
// EXISTING exercise (searched live from the library) or a NEW exercise (a light
// inline mini-form). Submitting builds an ingest-ready JSON payload and opens a
// prefilled GitHub issue (with a copy-to-clipboard fallback).
//
// HCI: tap-first, signifiers over instructional text, NO modals, no hidden
// gestures, minimal typing, demo stays visible. Everything happens inline on one
// scrolling page; the only "screen change" is swapping the builder for a review
// panel in place.

import { navigate } from '../utils/router.js';
import { loadExercises, loadWorkouts, loadDataModel } from '../utils/data.js';

const REPO = 'JuanTheEngineer/JuanTheEngineer.github.io';

// ── Builder state ──────────────────────────────────────────────────────────
// items: [{ uid, mode: 'existing'|'new', exercise?, draft?, reps, sets, repUnits }]
const state = {
  title: '',
  items: [],
  muscleGroups: [], // [{id,label}]
  stage: 'build' // 'build' | 'review'
};

let seq = 0;
const nextUid = () => `slot_${++seq}`;

// ── Small helpers ────────────────────────────────────────────────────────────
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Primary demo thumbnail for an exercise, if any.
function thumbFor(exercise) {
  const demos = exercise?.demos || [];
  const primary = demos.find((d) => d.isPrimary) || demos[0];
  return primary?.metadata?.thumbnail || null;
}

// Normalized token list for fuzzy matching.
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Cheap fuzzy score: shared word overlap + substring boost. 0..1.
function fuzzyScore(a, b) {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (nb.includes(na) || na.includes(nb)) return 0.85;
  const wa = new Set(na.split(' '));
  const wb = new Set(nb.split(' '));
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  const denom = Math.max(wa.size, wb.size);
  return denom ? shared / denom : 0;
}

// ── Lazy library handles (loaded once) ───────────────────────────────────────
let LIB = { exercises: [], muscleOptions: [] };

async function ensureLibrary() {
  if (LIB.exercises.length) return LIB;
  const [exData, model] = await Promise.all([loadExercises(), loadDataModel()]);
  // loadWorkouts primes the cache for consistency (title suggestions etc.); not
  // strictly required for the builder, so failure is non-fatal.
  loadWorkouts().catch(() => {});
  LIB = {
    exercises: exData.exercises || [],
    muscleOptions: (model.muscleGroups?.values || []).map((m) => ({ id: m.id, label: m.label }))
  };
  return LIB;
}

// ── Search over the live library ─────────────────────────────────────────────
function searchExercises(q, limit = 8) {
  const query = norm(q);
  if (!query) return [];
  const scored = [];
  for (const ex of LIB.exercises) {
    const nameScore = fuzzyScore(query, ex.name);
    const muscleHit = (ex.muscleGroups || []).some((m) => norm(m).includes(query));
    const score = Math.max(nameScore, muscleHit ? 0.5 : 0);
    if (score > 0.05) scored.push({ ex, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.ex);
}

// Best existing match for a typed new-exercise name (the "already exists" nudge).
function bestMatch(name) {
  const query = norm(name);
  if (query.length < 3) return null;
  let best = null;
  for (const ex of LIB.exercises) {
    const score = fuzzyScore(query, ex.name);
    if (score >= 0.6 && (!best || score > best.score)) best = { ex, score };
  }
  return best?.ex || null;
}

// ── Payload ──────────────────────────────────────────────────────────────────
function buildPayload() {
  const newExercises = [];
  const seen = new Set();

  const items = state.items.map((it) => {
    const base = {
      reps: it.reps || '',
      sets: it.sets || '',
      repUnits: it.repUnits || 'reps'
    };
    if (it.mode === 'existing' && it.exercise) {
      return { exerciseId: it.exercise.id, ...base };
    }
    // new
    const d = it.draft || {};
    const slug = slugify(d.name);
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      newExercises.push({
        name: d.name || '',
        demoUrl: d.demoUrl || '',
        muscleGroups: d.muscleGroups || [],
        description: d.description || '',
        suggested: { sets: d.sets || '', reps: d.reps || '' }
      });
    }
    return { exerciseId: `NEW:${slug}`, ...base };
  });

  const type = items.length === 1 ? 'exercise' : 'workout';
  return {
    type,
    workout: {
      title: state.title || (items.length === 1 ? 'Single exercise' : 'Untitled workout'),
      items
    },
    newExercises
  };
}

function issueUrl(payload) {
  const title =
    payload.type === 'exercise'
      ? `Submission: ${payload.workout.title}`
      : `Workout submission: ${payload.workout.title}`;
  const body = [
    'A community submission from the Submission Builder.',
    '',
    '```json',
    JSON.stringify(payload, null, 2),
    '```',
    '',
    '_Review the JSON above, then author trainer-voice prose at ingest time._'
  ].join('\n');
  const params = new URLSearchParams({ title, labels: 'submission', body });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

// ── Rendering ────────────────────────────────────────────────────────────────
let rootEl = null;

export function renderSubmitPage(container) {
  rootEl = container;
  // Reset builder each time the page is entered fresh.
  state.title = '';
  state.items = [];
  state.muscleGroups = [];
  state.stage = 'build';
  seq = 0;

  container.innerHTML = `
    <div class="flex-1 flex flex-col">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="home" class="btn-ghost -ml-2 px-3" aria-label="Back to home">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400">Submission Builder</span>
      </header>
      <main class="flex-1 px-6 pb-28 pt-7" data-region="body"></main>
    </div>
  `;

  container.querySelector('[data-action="home"]').addEventListener('click', () => navigate('/'));

  ensureLibrary()
    .then(() => renderStage())
    .catch((err) => {
      console.error('[submit] library load failed', err);
      container.querySelector('[data-region="body"]').innerHTML = `
        <div class="card p-6 text-center">
          <p class="text-sm text-slate-300">Couldn't load the exercise library.</p>
          <button data-action="retry" class="btn-primary mt-4">Try again</button>
        </div>`;
      container.querySelector('[data-action="retry"]')?.addEventListener('click', () => renderSubmitPage(container));
    });
}

function body() {
  return rootEl.querySelector('[data-region="body"]');
}

function renderStage() {
  if (state.stage === 'review') return renderReview();
  return renderBuild();
}

// ── Build stage ──────────────────────────────────────────────────────────────
function renderBuild() {
  const el = body();
  const count = state.items.length;
  el.innerHTML = `
    <p class="eyebrow">Share with the community</p>
    <h1 class="h-page mt-2">Build a submission</h1>
    <p class="text-[15px] text-slate-400 mt-3 leading-relaxed max-w-md">
      Everything is a workout. Add one exercise or many — a single exercise is just
      a one-item workout.
    </p>

    <label class="block mt-7">
      <span class="label-meta">Workout name</span>
      <input data-field="title" type="text" value="${escapeHtml(state.title)}"
        placeholder="e.g. Lower body power"
        class="mt-2 w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-[15px]
               placeholder:text-slate-600 focus:border-brand-500 focus:outline-none" />
    </label>

    <section data-region="items" class="mt-6 space-y-3"></section>

    <section data-region="adder" class="mt-3"></section>

    <div class="mt-8 flex items-center gap-3">
      <button data-action="review" class="btn-primary flex-1 ${count ? '' : 'opacity-40 pointer-events-none'}">
        Review ${count ? `· ${count} exercise${count === 1 ? '' : 's'}` : ''}
      </button>
    </div>
  `;

  el.querySelector('[data-field="title"]').addEventListener('input', (e) => {
    state.title = e.target.value;
  });
  el.querySelector('[data-action="review"]').addEventListener('click', () => {
    if (!state.items.length) return;
    state.stage = 'review';
    renderStage();
  });

  renderItems();
  renderAdder();
}

function renderItems() {
  const host = rootEl.querySelector('[data-region="items"]');
  if (!host) return;
  if (!state.items.length) {
    host.innerHTML = `
      <p class="text-sm text-slate-500 border border-dashed border-slate-800 rounded-2xl px-4 py-6 text-center">
        No exercises yet. Add your first below.
      </p>`;
    return;
  }
  host.innerHTML = state.items.map((it, i) => itemCard(it, i)).join('');
  state.items.forEach((it) => {
    host.querySelector(`[data-remove="${it.uid}"]`)?.addEventListener('click', () => {
      state.items = state.items.filter((x) => x.uid !== it.uid);
      renderBuild();
    });
    ['reps', 'sets'].forEach((f) => {
      host.querySelector(`[data-edit="${it.uid}:${f}"]`)?.addEventListener('input', (e) => {
        it[f] = e.target.value;
      });
    });
  });
}

function itemCard(it, i) {
  const isNew = it.mode === 'new';
  const name = isNew ? it.draft?.name || 'New exercise' : it.exercise?.name || it.exercise?.id;
  const thumb = isNew ? null : thumbFor(it.exercise);
  const badge = isNew
    ? '<span class="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">New</span>'
    : '<span class="text-[10px] font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Library</span>';
  const media = thumb
    ? `<img src="${escapeHtml(thumb)}" alt="" class="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />`
    : `<div class="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
       </div>`;
  return `
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <span class="num text-xs text-slate-500 w-5 text-right">${i + 1}</span>
        ${media}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">${badge}</div>
          <h3 class="font-semibold tracking-tight truncate mt-1">${escapeHtml(name)}</h3>
        </div>
        <button data-remove="${it.uid}" class="btn-ghost px-2 text-slate-500 hover:text-red-400" aria-label="Remove">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex items-center gap-2 mt-3 pl-8">
        <label class="flex-1">
          <span class="label-meta">Sets</span>
          <input data-edit="${it.uid}:sets" value="${escapeHtml(it.sets)}" inputmode="numeric" placeholder="3"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
        <span class="text-slate-600 mt-5">×</span>
        <label class="flex-1">
          <span class="label-meta">Reps</span>
          <input data-edit="${it.uid}:reps" value="${escapeHtml(it.reps)}" placeholder="10-12"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
      </div>
    </div>
  `;
}

// ── Adder: search existing, fall back to create-new ──────────────────────────
function renderAdder() {
  const host = rootEl.querySelector('[data-region="adder"]');
  if (!host) return;
  host.innerHTML = `
    <div class="card p-4">
      <label class="block">
        <span class="eyebrow">Add an exercise</span>
        <div class="relative mt-2">
          <svg class="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.3-4.3"/></svg>
          <input data-field="search" type="text" autocomplete="off"
            placeholder="Search the library…"
            class="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-[15px]
                   placeholder:text-slate-600 focus:border-brand-500 focus:outline-none" />
        </div>
      </label>
      <div data-region="results" class="mt-3 space-y-2"></div>
    </div>
  `;

  const input = host.querySelector('[data-field="search"]');
  input.addEventListener('input', (e) => renderResults(e.target.value));
  renderResults('');
}

function renderResults(q) {
  const host = rootEl.querySelector('[data-region="results"]');
  if (!host) return;
  const results = searchExercises(q);
  const trimmed = q.trim();

  const existingRows = results
    .map((ex) => {
      const thumb = thumbFor(ex);
      const media = thumb
        ? `<img src="${escapeHtml(thumb)}" alt="" class="w-11 h-11 rounded-lg object-cover shrink-0" loading="lazy" />`
        : `<div class="w-11 h-11 rounded-lg bg-slate-800 shrink-0"></div>`;
      const muscles = (ex.muscleGroups || []).slice(0, 2).join(' · ');
      return `
        <button data-add-existing="${escapeHtml(ex.id)}" class="w-full flex items-center gap-3 text-left p-2 rounded-xl hover:bg-white/5 active:scale-[0.99] transition">
          ${media}
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">${escapeHtml(ex.name)}</p>
            ${muscles ? `<p class="text-xs text-slate-500 truncate">${escapeHtml(muscles)}</p>` : ''}
          </div>
          <svg class="w-5 h-5 text-brand-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        </button>`;
    })
    .join('');

  // Create-new is always the fallback below the results.
  const createRow = trimmed
    ? `<button data-create-new class="w-full flex items-center gap-3 text-left p-3 mt-1 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5 active:scale-[0.99] transition">
         <div class="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
         </div>
         <div class="flex-1 min-w-0">
           <p class="font-medium">Add "<span class="text-emerald-400">${escapeHtml(trimmed)}</span>" as new</p>
           <p class="text-xs text-slate-500">Not in the library yet</p>
         </div>
       </button>`
    : `<p class="text-sm text-slate-500 px-2 py-1">Type to search, or add a brand-new exercise.</p>`;

  host.innerHTML = existingRows + createRow;

  host.querySelectorAll('[data-add-existing]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ex = LIB.exercises.find((e) => e.id === btn.dataset.addExisting);
      if (!ex) return;
      state.items.push({
        uid: nextUid(),
        mode: 'existing',
        exercise: ex,
        reps: ex.recommendations?.reps || '',
        sets: ex.recommendations?.sets || '',
        repUnits: ex.recommendations?.repUnits || 'reps'
      });
      renderBuild();
    });
  });
  host.querySelector('[data-create-new]')?.addEventListener('click', () => openNewForm(trimmed));
}

// ── New-exercise mini-form (inline, no modal) ────────────────────────────────
function openNewForm(prefillName) {
  const host = rootEl.querySelector('[data-region="adder"]');
  if (!host) return;
  const draft = { name: prefillName || '', demoUrl: '', muscleGroups: [], description: '', sets: '', reps: '' };

  host.innerHTML = `
    <div class="card p-4 animate-slide-up">
      <div class="flex items-center justify-between">
        <span class="eyebrow text-emerald-400">New exercise</span>
        <button data-action="cancel-new" class="btn-ghost px-2 text-slate-500" aria-label="Cancel">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <label class="block mt-3">
        <span class="label-meta">Name</span>
        <input data-nf="name" type="text" value="${escapeHtml(draft.name)}" placeholder="e.g. Banded knee drive"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>
      <div data-region="dupe" class="mt-2"></div>

      <label class="block mt-3">
        <span class="label-meta">Demo video URL</span>
        <input data-nf="demoUrl" type="url" value="${escapeHtml(draft.demoUrl)}" placeholder="https://youtube.com/watch?v=…"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>

      <div class="mt-3">
        <span class="label-meta">Primary muscle</span>
        <div data-region="muscles" class="mt-2 flex flex-wrap gap-2"></div>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <label class="flex-1">
          <span class="label-meta">Suggested sets</span>
          <input data-nf="sets" inputmode="numeric" value="${escapeHtml(draft.sets)}" placeholder="3"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
        <span class="text-slate-600 mt-5">×</span>
        <label class="flex-1">
          <span class="label-meta">Reps</span>
          <input data-nf="reps" value="${escapeHtml(draft.reps)}" placeholder="10-12"
            class="mt-1 w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm num focus:border-brand-500 focus:outline-none" />
        </label>
      </div>

      <label class="block mt-3">
        <span class="label-meta">One-line description <span class="text-slate-600 normal-case">(optional)</span></span>
        <input data-nf="description" type="text" value="${escapeHtml(draft.description)}" placeholder="A short cue in your own words"
          class="mt-1 w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 text-[15px] focus:border-brand-500 focus:outline-none" />
      </label>

      <button data-action="save-new" class="btn-primary w-full mt-5 opacity-40 pointer-events-none">Add to workout</button>
    </div>
  `;

  // Muscle chips
  const muscleHost = host.querySelector('[data-region="muscles"]');
  muscleHost.innerHTML = LIB.muscleOptions
    .map(
      (m) => `
    <button type="button" data-muscle="${escapeHtml(m.id)}"
      class="text-sm px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-brand-500 transition">
      ${escapeHtml(m.label)}
    </button>`
    )
    .join('');

  const saveBtn = host.querySelector('[data-action="save-new"]');
  const refreshSave = () => {
    const ok = draft.name.trim() && draft.demoUrl.trim() && draft.muscleGroups.length > 0;
    saveBtn.classList.toggle('opacity-40', !ok);
    saveBtn.classList.toggle('pointer-events-none', !ok);
  };

  // Field bindings
  ['name', 'demoUrl', 'sets', 'reps', 'description'].forEach((f) => {
    host.querySelector(`[data-nf="${f}"]`).addEventListener('input', (e) => {
      draft[f] = e.target.value;
      if (f === 'name') renderDupeNudge(draft);
      refreshSave();
    });
  });

  muscleHost.querySelectorAll('[data-muscle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.muscle;
      if (draft.muscleGroups.includes(id)) {
        draft.muscleGroups = draft.muscleGroups.filter((x) => x !== id);
        btn.classList.remove('bg-brand-500', 'border-brand-500', 'text-white');
        btn.classList.add('border-slate-700', 'text-slate-300');
      } else {
        draft.muscleGroups.push(id);
        btn.classList.add('bg-brand-500', 'border-brand-500', 'text-white');
        btn.classList.remove('border-slate-700', 'text-slate-300');
      }
      refreshSave();
    });
  });

  host.querySelector('[data-action="cancel-new"]').addEventListener('click', () => renderAdder());
  host.querySelector('[data-action="save-new"]').addEventListener('click', () => {
    if (!(draft.name.trim() && draft.demoUrl.trim() && draft.muscleGroups.length)) return;
    state.items.push({
      uid: nextUid(),
      mode: 'new',
      draft: { ...draft },
      reps: draft.reps || '',
      sets: draft.sets || '',
      repUnits: 'reps'
    });
    renderBuild();
  });

  renderDupeNudge(draft);
}

// Live "already exists" nudge while typing a new name.
function renderDupeNudge(draft) {
  const host = rootEl.querySelector('[data-region="dupe"]');
  if (!host) return;
  const match = bestMatch(draft.name);
  if (!match) {
    host.innerHTML = '';
    return;
  }
  host.innerHTML = `
    <button data-use-existing="${escapeHtml(match.id)}"
      class="w-full flex items-center gap-2 text-left text-sm bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl px-3 py-2 hover:bg-amber-500/15 transition">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>Already exists: <b>${escapeHtml(match.name)}</b> — use it instead?</span>
    </button>`;
  host.querySelector('[data-use-existing]').addEventListener('click', () => {
    state.items.push({
      uid: nextUid(),
      mode: 'existing',
      exercise: match,
      reps: match.recommendations?.reps || '',
      sets: match.recommendations?.sets || '',
      repUnits: match.recommendations?.repUnits || 'reps'
    });
    renderBuild();
  });
}

// ── Review stage ─────────────────────────────────────────────────────────────
function renderReview() {
  const payload = buildPayload();
  const el = body();
  el.innerHTML = `
    <button data-action="back-build" class="btn-ghost -ml-2 px-3 inline-flex items-center gap-1 text-sm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Keep editing
    </button>

    <p class="eyebrow mt-4">Review & submit</p>
    <h1 class="h-page mt-2">${escapeHtml(payload.workout.title)}</h1>
    <p class="text-sm text-slate-400 mt-2">
      ${payload.workout.items.length} exercise${payload.workout.items.length === 1 ? '' : 's'}
      · ${payload.newExercises.length} new
    </p>

    <ol class="mt-6 space-y-2">
      ${state.items.map((it, i) => reviewRow(it, i)).join('')}
    </ol>

    <details class="mt-6 card p-4">
      <summary class="eyebrow cursor-pointer select-none">Submission JSON</summary>
      <pre class="mt-3 text-xs text-slate-400 overflow-x-auto no-scrollbar whitespace-pre-wrap">${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
    </details>

    <button data-action="submit" class="btn-primary w-full mt-7">Submit via GitHub issue</button>
    <p data-region="fallback" class="text-xs text-slate-500 text-center mt-3"></p>
  `;

  el.querySelector('[data-action="back-build"]').addEventListener('click', () => {
    state.stage = 'build';
    renderStage();
  });
  el.querySelector('[data-action="submit"]').addEventListener('click', () => submit(payload));
}

function reviewRow(it, i) {
  const isNew = it.mode === 'new';
  const name = isNew ? it.draft?.name : it.exercise?.name;
  const setsReps = [it.sets, it.reps].filter(Boolean).join(' × ');
  const tag = isNew ? 'New' : 'Library';
  const tagClass = isNew ? 'text-emerald-400' : 'text-brand-400';
  return `
    <li class="card p-3 flex items-center gap-3">
      <span class="num text-xs text-slate-500 w-5 text-right">${i + 1}</span>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">${escapeHtml(name)}</p>
        <p class="text-xs text-slate-500">
          <span class="${tagClass} font-semibold uppercase tracking-wider text-[10px]">${tag}</span>
          ${setsReps ? ` · <span class="num">${escapeHtml(setsReps)}</span>` : ''}
        </p>
      </div>
    </li>`;
}

// ── Submit ───────────────────────────────────────────────────────────────────
function submit(payload) {
  const url = issueUrl(payload);
  const fallback = rootEl.querySelector('[data-region="fallback"]');
  const win = window.open(url, '_blank', 'noopener');
  if (win) {
    if (fallback) fallback.textContent = 'Opened a prefilled GitHub issue in a new tab.';
    return;
  }
  // Popup blocked — copy the JSON so nothing is lost.
  const json = JSON.stringify(payload, null, 2);
  const done = (msg) => {
    if (fallback) {
      fallback.innerHTML = `${escapeHtml(msg)} <a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="text-brand-400 underline">Open issue</a>`;
    }
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(json)
      .then(() => done('Popup blocked — JSON copied to clipboard.'))
      .catch(() => done('Popup blocked — copy the JSON above.'));
  } else {
    done('Popup blocked — copy the JSON above.');
  }
}
