// DemoManager: multi-demo source editor with type dropdown + contextual fields
// Used inside ExerciseEditor (slide-over and standalone)

const DEMO_TYPES = [
  { value: 'youtube', label: 'YouTube', fields: ['url', 'startTime', 'endTime', 'notes'] },
  { value: 'cloudinary', label: 'Cloudinary', fields: ['url', 'startTime', 'endTime', 'notes'] },
  { value: 'local', label: 'Local file', fields: ['url', 'notes'] },
  { value: 'url', label: 'URL (external)', fields: ['url', 'notes'] },
  { value: 'tiktok', label: 'TikTok', fields: ['url', 'notes'] },
  { value: 'vimeo', label: 'Vimeo', fields: ['url', 'startTime', 'endTime', 'notes'] }
];

/**
 * Render the demo manager into a container.
 * @param {HTMLElement} container
 * @param {Array} demos - mutable array of demo objects (modified in place)
 */
export function renderDemoManager(container, demos) {
  render();

  function render() {
    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-[10px] text-slate-500 uppercase font-semibold">Demo Sources</label>
          <span class="text-[10px] text-slate-500 num">${demos.length} demo${demos.length !== 1 ? 's' : ''}</span>
        </div>
        ${demos.length === 0 ? `<p class="text-xs text-slate-500 italic">No demos yet. Add one below.</p>` : ''}
        <div class="space-y-3">
          ${demos.map((d, i) => demoCard(d, i)).join('')}
        </div>
        <button data-action="add-demo" class="w-full border border-dashed border-slate-700 rounded-xl py-2.5 text-sm text-slate-400 hover:text-brand-400 hover:border-brand-500/50 transition-colors touch-manipulation">
          + Add demo
        </button>
      </div>
    `;
    wireActions();
  }

  function demoCard(demo, i) {
    const typeConfig = DEMO_TYPES.find(t => t.value === demo.type) || DEMO_TYPES[0];
    const hasTime = typeConfig.fields.includes('startTime');
    const thumb = demo.type === 'youtube' ? getYouTubeThumbnail(demo.url) : null;

    return `
      <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 space-y-2.5" data-demo-index="${i}">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-slate-500 font-bold num">#${i + 1}</span>
          <select data-demo-field="type" data-index="${i}" class="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500">
            ${DEMO_TYPES.map(t => `<option value="${t.value}"${demo.type === t.value ? ' selected' : ''}>${t.label}</option>`).join('')}
          </select>
          <label class="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
            <input type="radio" name="primary-demo" data-index="${i}" ${demo.isPrimary ? 'checked' : ''} class="w-3 h-3 text-brand-500"/>
            <span>Primary</span>
          </label>
          <button data-action="remove-demo" data-index="${i}" class="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" aria-label="Remove demo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div>
          <input data-demo-field="url" data-index="${i}" value="${esc(demo.url || '')}" placeholder="https://..." class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 font-mono"/>
        </div>
        ${thumb ? `<img src="${thumb}" alt="Thumbnail" class="w-full h-20 object-cover rounded-lg bg-slate-900"/>` : ''}
        ${hasTime ? `
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-slate-500 block mb-0.5">Start (sec)</label>
              <input data-demo-field="startTime" data-index="${i}" type="number" min="0" value="${demo.startTime || 0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 num"/></div>
            <div><label class="text-[10px] text-slate-500 block mb-0.5">End (sec)</label>
              <input data-demo-field="endTime" data-index="${i}" type="number" min="0" value="${demo.endTime || 0}" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 num"/></div>
          </div>
        ` : ''}
        <div>
          <input data-demo-field="notes" data-index="${i}" value="${esc(demo.notes || '')}" placeholder="Notes (optional)" class="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-brand-500"/>
        </div>
      </div>
    `;
  }

  function wireActions() {
    // Add demo
    container.querySelector('[data-action="add-demo"]')?.addEventListener('click', () => {
      demos.push({ type: 'youtube', mediaType: 'video', format: 'youtube', url: '', startTime: 0, endTime: 0, isPrimary: demos.length === 0, notes: '' });
      render();
    });

    // Remove demo
    container.querySelectorAll('[data-action="remove-demo"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.index;
        const wasPrimary = demos[i].isPrimary;
        demos.splice(i, 1);
        if (wasPrimary && demos.length > 0) demos[0].isPrimary = true;
        render();
      });
    });

    // Primary radio
    container.querySelectorAll('input[name="primary-demo"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const i = +radio.dataset.index;
        demos.forEach((d, idx) => { d.isPrimary = idx === i; });
      });
    });

    // Type dropdown (re-renders to show/hide fields)
    container.querySelectorAll('[data-demo-field="type"]').forEach(sel => {
      sel.addEventListener('change', () => {
        const i = +sel.dataset.index;
        demos[i].type = sel.value;
        demos[i].format = sel.value === 'youtube' ? 'youtube' : sel.value === 'cloudinary' ? detectCloudinaryFormat(demos[i].url) : sel.value;
        demos[i].mediaType = 'video';
        render();
      });
    });

    // Field inputs (url, startTime, endTime, notes)
    container.querySelectorAll('[data-demo-field]').forEach(el => {
      if (el.tagName === 'SELECT') return; // handled above
      const update = () => {
        const i = +el.dataset.index;
        const field = el.dataset.demoField;
        if (field === 'startTime' || field === 'endTime') {
          demos[i][field] = Number(el.value) || 0;
        } else {
          demos[i][field] = el.value;
        }
        // Auto-detect format for cloudinary URLs
        if (field === 'url' && demos[i].type === 'cloudinary') {
          demos[i].format = detectCloudinaryFormat(el.value);
        }
      };
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
  }
}

function getYouTubeThumbnail(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function detectCloudinaryFormat(url) {
  if (!url) return 'gif';
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'mp4' : 'gif';
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
