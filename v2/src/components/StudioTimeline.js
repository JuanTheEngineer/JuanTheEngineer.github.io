// StudioTimeline: timeline renderer for Program Studio
// Handles: rendering, ⋮ menu (bottom sheet), grouping rules, member reorder

/**
 * @param {HTMLElement} container - The <ul> element
 * @param {Object} state - { items: [], expandedIndex: number }
 * @param {Object} callbacks - { onEdit, onRemove, onMove, onGroup, onUngroup, onMemberMove, onMemberRemove, onChange }
 */
export function renderStudioTimeline(container, state, callbacks) {
  const { items } = state;
  if (items.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = items.map((item, i) => {
    if (item.type === 'group') return groupHtml(item, i, state);
    return singleHtml(item, i, state);
  }).join('');

  wireAll(container, state, callbacks);
}

// --- Single card ---
function singleHtml(item, i, state) {
  const expanded = state.expandedIndex === i;
  const note = item.exerciseNote || '';
  const notePreview = note.length > 50 ? note.substring(0, 50) + '…' : note;
  const tags = (item.tags || []).map(t =>
    `<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300">${t}</span>`
  ).join('');

  return `<li class="card" data-idx="${i}" data-type="single">
  <div class="flex items-center px-4 py-3 gap-2 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${i}">
      ${tags ? `<div class="flex gap-1 mb-1">${tags}</div>` : ''}
      <p class="text-sm font-medium text-slate-100 truncate">${esc(item.exerciseName)}</p>
      <p class="text-xs text-slate-400 num mt-0.5">${item.reps || '—'} ${item.repUnits || 'reps'} · ${item.sets || '—'} sets</p>
      ${notePreview ? `<p class="text-[11px] text-slate-500 truncate mt-0.5 italic">${esc(notePreview)}</p>` : ''}
    </div>
    ${menuButton(i)}
  </div>
  ${expanded ? `<div class="border-t border-slate-800" data-region="edit-form" data-idx="${i}"></div>` : ''}
</li>`;
}

// --- Group card ---
function groupHtml(item, i, state) {
  const expanded = state.expandedIndex === i;
  const kindLabel = { superset: 'Superset', compound: 'Compound', circuit: 'Circuit' }[item.kind] || item.kind;

  const membersHtml = item.members.map((m, mi) => `
    <div class="flex items-center px-4 py-2.5 gap-2 ${mi > 0 ? 'border-t border-slate-800/50' : ''}">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-100 truncate">${esc(m.exerciseName)}</p>
        <p class="text-xs text-slate-400 num mt-0.5">${m.reps || '—'} ${m.repUnits || 'reps'} · ${m.sets || '—'} sets</p>
      </div>
      ${expanded ? `<div class="flex gap-0.5">
        <button data-action="member-up" data-idx="${i}" data-mi="${mi}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${mi === 0 ? 'opacity-20 pointer-events-none' : ''}" aria-label="Move up"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>
        <button data-action="member-down" data-idx="${i}" data-mi="${mi}" class="p-1 rounded text-slate-600 hover:text-slate-300 ${mi === item.members.length - 1 ? 'opacity-20 pointer-events-none' : ''}" aria-label="Move down"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
        <button data-action="member-remove" data-idx="${i}" data-mi="${mi}" class="p-1 rounded text-slate-600 hover:text-red-400" aria-label="Remove from group"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>` : ''}
    </div>
  `).join('');

  return `<li class="card border-l-[3px] border-l-brand-500" data-idx="${i}" data-type="group">
  <div class="flex items-center px-4 py-2 gap-2 bg-brand-500/5 relative">
    <div class="flex-1 min-w-0 cursor-pointer" data-action="expand" data-idx="${i}">
      <span class="text-[10px] font-bold uppercase tracking-wide text-brand-300">${kindLabel}</span>
      <span class="text-[10px] text-slate-500 num ml-2">${item.members.length} exercises</span>
    </div>
    ${menuButton(i)}
  </div>
  ${membersHtml}
  ${expanded ? `<div class="border-t border-slate-800" data-region="edit-form" data-idx="${i}"></div>` : ''}
</li>`;
}

// --- Shared button ---
function menuButton(i) {
  return `<button data-action="menu" data-idx="${i}" class="relative z-10 p-3 -mr-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation shrink-0" aria-label="Actions">
    <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
  </button>`;
}

// --- Bottom sheet menu ---
function showMenu(container, idx, state, callbacks) {
  closeMenu();
  const item = state.items[idx];
  const isGroup = item.type === 'group';
  const total = state.items.length;
  const above = idx > 0 ? state.items[idx - 1] : null;
  const below = idx < total - 1 ? state.items[idx + 1] : null;

  let options = '';

  if (!isGroup) {
    options += menuItem('edit', 'Edit');
    if (idx > 0) options += menuItem('move-up', 'Move up');
    if (idx < total - 1) options += menuItem('move-down', 'Move down');
    // Grouping: single can group with adjacent single OR join adjacent group
    if (above?.type === 'single') options += menuItem('group-above', 'Group with above');
    else if (above?.type === 'group') options += menuItem('group-above', 'Join group above');
    if (below?.type === 'single') options += menuItem('group-below', 'Group with below');
    else if (below?.type === 'group') options += menuItem('group-below', 'Join group below');
  } else {
    options += menuItem('edit', 'Edit group');
    if (idx > 0) options += menuItem('move-up', 'Move up');
    if (idx < total - 1) options += menuItem('move-down', 'Move down');
    // Group can absorb adjacent singles only (not other groups)
    if (above?.type === 'single') options += menuItem('group-above', 'Add above to group');
    if (below?.type === 'single') options += menuItem('group-below', 'Add below to group');
    options += menuItem('ungroup', 'Ungroup');
  }
  options += menuItem('remove', 'Remove', 'text-red-400');

  const name = isGroup
    ? item.members.map(m => m.exerciseName).join(' + ')
    : (item.exerciseName || 'Item');

  const sheet = document.createElement('div');
  sheet.dataset.region = 'action-menu';
  sheet.className = 'fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in';
  sheet.innerHTML = `
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm pb-8 pt-3 px-2">
      <div class="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
      <p class="text-xs text-slate-500 text-center mb-2 px-4 truncate">${esc(name)}</p>
      <div class="space-y-0.5">${options}</div>
      <button data-menu-action="cancel" class="w-full mt-2 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
    </div>
  `;
  document.body.appendChild(sheet);

  sheet.querySelectorAll('[data-menu-action]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = el.dataset.menuAction;
      sheet.remove();
      if (action !== 'cancel') handleAction(action, idx, state, callbacks, container);
    });
  });
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.remove(); });
}

function menuItem(action, label, extra = '') {
  return `<button data-menu-action="${action}" class="w-full text-left px-5 py-3 text-sm font-medium rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors ${extra}">${label}</button>`;
}

function closeMenu() {
  document.querySelectorAll('[data-region="action-menu"]').forEach(el => el.remove());
}

// --- Action handler ---
function handleAction(action, idx, state, callbacks, container) {
  const item = state.items[idx];
  const above = idx > 0 ? state.items[idx - 1] : null;
  const below = idx < state.items.length - 1 ? state.items[idx + 1] : null;

  switch (action) {
    case 'edit':
      callbacks.onEdit?.(idx);
      break;
    case 'move-up':
      callbacks.onMove?.(idx, idx - 1);
      break;
    case 'move-down':
      callbacks.onMove?.(idx, idx + 1);
      break;
    case 'group-above':
      if (above?.type === 'group') {
        // Join existing group above
        callbacks.onJoinGroup?.(idx, idx - 1);
      } else if (item.type === 'group' && above?.type === 'single') {
        // Absorb single above into this group
        callbacks.onAbsorbIntoGroup?.(idx, idx - 1);
      } else {
        // Two singles → create new group
        showKindPicker(idx, 'above', callbacks);
      }
      break;
    case 'group-below':
      if (below?.type === 'group') {
        // Join existing group below
        callbacks.onJoinGroup?.(idx, idx + 1);
      } else if (item.type === 'group' && below?.type === 'single') {
        // Absorb single below into this group
        callbacks.onAbsorbIntoGroup?.(idx, idx + 1);
      } else {
        // Two singles → create new group
        showKindPicker(idx, 'below', callbacks);
      }
      break;
    case 'ungroup':
      callbacks.onUngroup?.(idx);
      break;
    case 'remove':
      callbacks.onRemove?.(idx);
      break;
  }
}

function showKindPicker(idx, direction, callbacks) {
  const picker = document.createElement('div');
  picker.dataset.region = 'kind-picker';
  picker.className = 'fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in';
  picker.innerHTML = `
    <div class="bg-slate-900 border-t border-slate-700 rounded-t-2xl w-full max-w-sm p-5 space-y-4 pb-8">
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
    btn.addEventListener('click', () => { picker.remove(); callbacks.onGroup?.(idx, direction, btn.dataset.kind); });
  });
  picker.querySelector('[data-action="cancel-kind"]')?.addEventListener('click', () => picker.remove());
  picker.addEventListener('click', (e) => { if (e.target === picker) picker.remove(); });
}

// --- Wire all ---
function wireAll(container, state, callbacks) {
  container.querySelectorAll('[data-action="expand"]').forEach(el => {
    el.addEventListener('click', () => callbacks.onEdit?.(+el.dataset.idx));
  });
  container.querySelectorAll('[data-action="menu"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showMenu(container, +btn.dataset.idx, state, callbacks);
    });
  });
  // Member reorder/remove (inside expanded groups)
  container.querySelectorAll('[data-action="member-up"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onMemberMove?.(+btn.dataset.idx, +btn.dataset.mi, +btn.dataset.mi - 1);
    });
  });
  container.querySelectorAll('[data-action="member-down"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onMemberMove?.(+btn.dataset.idx, +btn.dataset.mi, +btn.dataset.mi + 1);
    });
  });
  container.querySelectorAll('[data-action="member-remove"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onMemberRemove?.(+btn.dataset.idx, +btn.dataset.mi);
    });
  });
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
