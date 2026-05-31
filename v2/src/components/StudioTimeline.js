// StudioTimeline: clean timeline renderer for the Program Studio
// Handles: rendering, expand/collapse, ⋮ menu, move, group, ungroup, remove

/**
 * Render the program timeline into a container.
 * @param {HTMLElement} container - The <ul> element to render into
 * @param {Object} state - { items: [], expandedIndex: number }
 * @param {Object} callbacks - { onEdit, onRemove, onMove, onGroup, onUngroup, onChange }
 */
export function renderStudioTimeline(container, state, callbacks) {
  const { items } = state;
  if (items.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = items.map((item, i) => {
    if (item.type === 'group') return groupHtml(item, i, state);
    return singleHtml(item, i, state, items.length);
  }).join('');

  wireAll(container, state, callbacks);
}

function singleHtml(item, i, state, total) {
  const expanded = state.expandedIndex === i;
  const note = item.exerciseNote || '';
  const notePreview = note.length > 50 ? note.substring(0, 50) + '…' : note;
  const tags = (item.tags || []).map(t => `<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${t}</span>`).join('');

  return `<li class="card" data-idx="${i}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${i}">
      ${tags ? `<div class="flex gap-1 mb-1">${tags}</div>` : ''}
      <p class="text-sm font-medium text-slate-100 truncate">${esc(item.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets</p>
      ${notePreview ? `<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${esc(notePreview)}</p>` : ''}
    </div>
    <button data-action="menu" data-idx="${i}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
      <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
    </button>
  </div>
  ${expanded ? `<div class="border-t border-slate-800" data-region="edit-form" data-idx="${i}"></div>` : ''}
</li>`;
}

function groupHtml(item, i, state) {
  const expanded = state.expandedIndex === i;
  const kindLabel = { superset: 'Superset', compound: 'Compound', circuit: 'Circuit' }[item.kind] || item.kind;

  const membersHtml = item.members.map((m, mi) => `
    <div class="flex items-center px-4 py-2.5 gap-2 ${mi > 0 ? 'border-t border-slate-800/50' : ''}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${esc(m.exerciseName)}</p>
        <p class="text-xs text-slate-400 num mt-0.5">${m.reps || '—'} ${m.repUnits || 'reps'} · ${m.sets || '—'} sets</p>
      </div>
    </div>
  `).join('');

  return `<li class="card border-l-[3px] border-l-brand-500" data-idx="${i}" data-type="group">
  <div class="flex items-center px-4 py-2 gap-2 bg-brand-500/5 relative">
    <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${kindLabel}</span>
    <span class="text-[10px] text-slate-500 num">${item.members.length} exercises</span>
    <div class="flex-1"></div>
    <button data-action="menu" data-idx="${i}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
      <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
    </button>
  </div>
  ${membersHtml}
  ${expanded ? `<div class="border-t border-slate-800" data-region="edit-form" data-idx="${i}"></div>` : ''}
</li>`;
}

// --- Menu ---

function showMenu(container, idx, state, callbacks) {
  closeMenu(container);
  const item = state.items[idx];
  const isGroup = item.type === 'group';
  const total = state.items.length;
  const canMoveUp = idx > 0;
  const canMoveDown = idx < total - 1;
  const canGroupAbove = !isGroup && idx > 0 && state.items[idx - 1].type === 'single';
  const canGroupBelow = !isGroup && idx < total - 1 && state.items[idx + 1].type === 'single';

  // Build options
  let options = '';
  if (!isGroup) options += menuItem('edit', 'Edit');
  if (canMoveUp) options += menuItem('move-up', 'Move up');
  if (canMoveDown) options += menuItem('move-down', 'Move down');
  if (canGroupAbove) options += menuItem('group-above', 'Group with above');
  if (canGroupBelow) options += menuItem('group-below', 'Group with below');
  if (isGroup) options += menuItem('ungroup', 'Ungroup');
  options += menuItem('remove', 'Remove', 'text-red-400');

  // Render as a fixed bottom sheet (mobile-friendly, never clips)
  const sheet = document.createElement('div');
  sheet.dataset.region = 'action-menu';
  sheet.className = 'fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in';
  sheet.innerHTML = `
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4">${esc(item.exerciseName || (isGroup ? 'Group' : 'Item'))}</p>
      <div class="space-y-0.5">${options}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `;

  document.body.appendChild(sheet);

  // Wire actions
  sheet.querySelectorAll('[data-menu-action]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = el.dataset.menuAction;
      sheet.remove();
      if (action !== 'cancel') handleMenuAction(action, idx, state, callbacks, container);
    });
  });

  // Close on backdrop tap
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.remove(); });
}

function menuItem(action, label, extraClass = '') {
  return `<button data-menu-action="${action}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${extraClass}">${label}</button>`;
}

function closeMenu() {
  document.querySelectorAll('[data-region="action-menu"]').forEach(el => el.remove());
}

function handleMenuAction(action, idx, state, callbacks, container) {
  switch (action) {
    case 'edit':
      callbacks.onEdit?.(idx);
      break;
    case 'move-up':
      if (idx > 0) callbacks.onMove?.(idx, idx - 1);
      break;
    case 'move-down':
      if (idx < state.items.length - 1) callbacks.onMove?.(idx, idx + 1);
      break;
    case 'group-above':
      showKindPicker(container, idx, 'above', state, callbacks);
      break;
    case 'group-below':
      showKindPicker(container, idx, 'below', state, callbacks);
      break;
    case 'ungroup':
      callbacks.onUngroup?.(idx);
      break;
    case 'remove':
      callbacks.onRemove?.(idx);
      break;
  }
}

function showKindPicker(container, idx, direction, state, callbacks) {
  const li = container.querySelector(`[data-idx="${idx}"]`);
  if (!li) return;

  const picker = document.createElement('div');
  picker.dataset.region = 'kind-picker';
  picker.className = 'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fade-in';
  picker.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
      <p class="text-sm font-medium text-slate-200 text-center">Group type</p>
      <div class="flex gap-2">
        <button data-kind="superset" class="flex-1 py-3 rounded-xl text-sm font-medium bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 active:scale-95 transition-all">Superset</button>
        <button data-kind="compound" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Compound</button>
        <button data-kind="circuit" class="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all">Circuit</button>
      </div>
      <button data-action="cancel-kind" class="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `;

  document.body.appendChild(picker);

  picker.querySelectorAll('[data-kind]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.kind;
      picker.remove();
      callbacks.onGroup?.(idx, direction, kind);
    });
  });

  picker.querySelector('[data-action="cancel-kind"]')?.addEventListener('click', () => picker.remove());
  picker.addEventListener('click', (e) => { if (e.target === picker) picker.remove(); });
}

// --- Wire all interactions ---

function wireAll(container, state, callbacks) {
  // Expand on tap
  container.querySelectorAll('[data-action="expand"]').forEach(el => {
    el.addEventListener('click', () => callbacks.onEdit?.(+el.dataset.idx));
  });

  // ⋮ menu
  container.querySelectorAll('[data-action="menu"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showMenu(container, +btn.dataset.idx, state, callbacks);
    });
  });
}

// --- Utility ---

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
