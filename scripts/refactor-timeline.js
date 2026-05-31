#!/usr/bin/env node
// One-shot script to replace old timeline code with StudioTimeline delegation
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '..', 'v2', 'src', 'pages', 'ProgramEditorPage.js');
const lines = readFileSync(file, 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('// --- Timeline rendering'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim().startsWith('function esc(s)'));

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers. start:', startIdx, 'end:', endIdx);
  process.exit(1);
}

console.log(`Replacing lines ${startIdx + 1} to ${endIdx} (${endIdx - startIdx} lines)`);

const replacement = `// --- Timeline rendering (delegates to StudioTimeline component) ---

function renderTimeline(container) {
  const list = container.querySelector('[data-region="timeline"]');
  const empty = container.querySelector('[data-region="empty-timeline"]');
  const count = container.querySelector('[data-region="item-count"]');
  const exportSection = container.querySelector('[data-region="export-section"]');
  if (!list) return;
  count.textContent = \`\${state.items.length} item\${state.items.length !== 1 ? 's' : ''}\`;
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
    const formSlot = list.querySelector(\`[data-region="edit-form"][data-idx="\${expandedIndex}"]\`);
    if (formSlot) renderEditForm(formSlot, state.items[expandedIndex], expandedIndex, container);
  }
}

`;

const newLines = [...lines.slice(0, startIdx), ...replacement.split('\n'), ...lines.slice(endIdx)];
writeFileSync(file, newLines.join('\n'));
console.log('Done. Replaced', endIdx - startIdx, 'lines with', replacement.split('\n').length, 'lines.');
