// AI Chat Page: conversational program builder
import { navigate } from '../utils/router.js';
import { loadExercises } from '../utils/data.js';
import {
  sendAgentMessage,
  createProgramState,
  exportProgram,
  hasApiKey,
  getApiKey,
  setApiKey
} from '../utils/agent.js';

export async function renderAIChatPage(container) {
  const state = createProgramState();
  const history = [];
  let isLoading = false;

  // Load exercise catalog for system prompt
  const { exercises } = await loadExercises();
  const catalog = exercises.map((e) => ({ id: e.id, name: e.name }));

  container.innerHTML = `
    <div class="flex-1 flex flex-col h-screen">
      <header class="px-6 pt-12 pb-2 flex items-center gap-3 sticky top-0 bg-slate-950/85 backdrop-blur-md z-20 border-b border-slate-900">
        <button data-action="back" class="btn-ghost -ml-2 px-3" aria-label="Back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-slate-400 flex-1">AI Program Builder</span>
        <button data-action="export" class="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors hidden">Export</button>
        <button data-action="settings" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Settings">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </header>

      <!-- Program preview (collapsible) -->
      <div data-region="program-preview" class="px-6 py-3 border-b border-slate-900 bg-slate-900/30 hidden">
        <div class="flex items-center justify-between mb-2">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Program</p>
          <span data-region="item-count" class="text-[10px] text-slate-500 num">0 items</span>
        </div>
        <div data-region="program-items" class="space-y-1 max-h-[200px] overflow-y-auto"></div>
      </div>

      <!-- Chat messages -->
      <main data-region="messages" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div class="text-center py-8">
          <p class="text-2xl mb-2">🏋️</p>
          <p class="text-sm text-slate-400">Tell me what kind of program you want to build.</p>
          <p class="text-xs text-slate-500 mt-1">e.g. "I need a knee-friendly lower body session with dumbbells"</p>
        </div>
      </main>

      <!-- Input -->
      <div class="px-6 py-4 border-t border-slate-900 bg-slate-950">
        <div class="flex gap-2">
          <input
            data-input="message"
            type="text"
            placeholder="Type a message..."
            class="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
          />
          <button data-action="send" class="btn-primary px-4 py-3 rounded-xl" aria-label="Send">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Settings modal -->
      <div data-region="settings-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 space-y-4">
          <h2 class="h-section">AI Settings</h2>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">OpenAI API Key</label>
            <input data-input="api-key" type="password" placeholder="sk-..."
              class="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"/>
          </div>
          <p class="text-[11px] text-slate-500">Stored in localStorage. Never sent anywhere except OpenAI.</p>
          <div class="flex gap-3">
            <button data-action="close-settings" class="btn-ghost flex-1 text-sm">Cancel</button>
            <button data-action="save-settings" class="btn-primary flex-1 text-sm">Save</button>
          </div>
        </div>
      </div>

      <!-- Export modal -->
      <div data-region="export-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center">
        <div class="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="h-section">Export Program</h2>
            <button data-action="close-export" class="p-2 rounded-lg hover:bg-white/5 text-slate-400" aria-label="Close">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div data-region="export-content" class="space-y-4"></div>
        </div>
      </div>
    </div>
  `;

  // --- Wire events ---
  container.querySelector('[data-action="back"]')?.addEventListener('click', () => navigate('/studio'));

  const messagesEl = container.querySelector('[data-region="messages"]');
  const input = container.querySelector('[data-input="message"]');
  const sendBtn = container.querySelector('[data-action="send"]');
  const exportBtn = container.querySelector('[data-action="export"]');
  const settingsModal = container.querySelector('[data-region="settings-modal"]');
  const exportModal = container.querySelector('[data-region="export-modal"]');

  // Settings
  container.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
    container.querySelector('[data-input="api-key"]').value = getApiKey();
    settingsModal.classList.remove('hidden');
  });
  container.querySelector('[data-action="close-settings"]')?.addEventListener('click', () => settingsModal.classList.add('hidden'));
  container.querySelector('[data-action="save-settings"]')?.addEventListener('click', () => {
    const key = container.querySelector('[data-input="api-key"]').value.trim();
    setApiKey(key);
    settingsModal.classList.add('hidden');
  });
  settingsModal?.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

  // Export
  exportBtn?.addEventListener('click', () => showExport());
  container.querySelector('[data-action="close-export"]')?.addEventListener('click', () => exportModal.classList.add('hidden'));
  exportModal?.addEventListener('click', (e) => { if (e.target === exportModal) exportModal.classList.add('hidden'); });

  // Check API key on load
  if (!hasApiKey()) {
    settingsModal.classList.remove('hidden');
  }

  // Send message
  async function send() {
    const text = input.value.trim();
    if (!text || isLoading) return;
    if (!hasApiKey()) { settingsModal.classList.remove('hidden'); return; }

    input.value = '';
    isLoading = true;
    sendBtn.disabled = true;

    // Add user message to UI
    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    // Show loading
    const loadingEl = appendMessage('assistant', '...');
    loadingEl.dataset.loading = 'true';

    try {
      const response = await sendAgentMessage(text, history, state, catalog, (event) => {
        if (event.type === 'tool') {
          appendToolEvent(event);
        }
      });

      // Replace loading with response
      loadingEl.remove();
      appendMessage('assistant', response);
      history.push({ role: 'assistant', content: response });

      // Update program preview
      updateProgramPreview();
    } catch (err) {
      loadingEl.remove();
      appendMessage('error', err.message);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

  // --- UI Helpers ---
  function appendMessage(role, content) {
    // Remove initial placeholder
    const placeholder = messagesEl.querySelector('.text-center.py-8');
    if (placeholder && role !== 'error') placeholder.remove();

    const div = document.createElement('div');
    div.className = role === 'user'
      ? 'flex justify-end'
      : role === 'error'
        ? 'flex justify-start'
        : 'flex justify-start';

    const bubble = document.createElement('div');
    if (role === 'user') {
      bubble.className = 'bg-brand-500/20 text-slate-100 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed';
    } else if (role === 'error') {
      bubble.className = 'bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed';
    } else {
      bubble.className = 'bg-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm leading-relaxed';
    }
    bubble.textContent = content;
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function appendToolEvent(event) {
    const div = document.createElement('div');
    div.className = 'flex justify-start';
    const label = {
      search_exercises: `🔍 Searching: "${event.args.query}"`,
      add_exercise: `✓ Added: ${event.args.exerciseId}`,
      create_exercise: `✓ Created: ${event.args.name}`,
      remove_exercise: `✗ Removed item at position ${event.args.index}`,
      group_exercises: `⚡ Grouped as ${event.args.kind}`,
      set_metadata: `📝 Updated: ${event.args.title || event.args.requirements || 'metadata'}`,
      update_exercise: `✏️ Updated item at position ${event.args.index}`
    }[event.name] || `🔧 ${event.name}`;

    div.innerHTML = `<span class="text-[11px] text-slate-500 italic px-2 py-1">${esc(label)}</span>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function updateProgramPreview() {
    const preview = container.querySelector('[data-region="program-preview"]');
    const itemsEl = container.querySelector('[data-region="program-items"]');
    const countEl = container.querySelector('[data-region="item-count"]');

    if (state.items.length === 0) {
      preview.classList.add('hidden');
      exportBtn.classList.add('hidden');
      return;
    }

    preview.classList.remove('hidden');
    exportBtn.classList.remove('hidden');
    countEl.textContent = `${state.items.length} item${state.items.length !== 1 ? 's' : ''}`;

    itemsEl.innerHTML = state.items.map((item, i) => {
      if (item.kind) {
        return `<div class="text-xs text-slate-400 pl-2 border-l-2 border-brand-500"><span class="text-brand-300 font-medium">${item.kind}</span>: ${item.exercises.map((e) => e.exerciseId).join(' + ')}</div>`;
      }
      const tags = item.tags?.length ? `<span class="text-brand-300">[${item.tags.join(', ')}]</span> ` : '';
      return `<div class="text-xs text-slate-300">${i + 1}. ${tags}${esc(item.exerciseId)} — ${item.reps || '?'} ${item.repUnits || 'reps'} × ${item.sets || '?'}</div>`;
    }).join('');
  }

  function showExport() {
    const { program, newExercises } = exportProgram(state);
    const content = container.querySelector('[data-region="export-content"]');
    let html = '';

    if (newExercises.length > 0) {
      const json = JSON.stringify(newExercises, null, 2);
      html += `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">New Exercises (append to exercises.json)</p>
            <button data-copy="${esc(json)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
          </div>
          <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[200px] overflow-y-auto font-mono">${esc(json)}</pre>
        </div>
      `;
    }

    const programJson = JSON.stringify(program, null, 2);
    html += `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-400">Program (append to workouts.json)</p>
          <button data-copy="${esc(programJson)}" class="text-xs text-brand-400 hover:text-brand-300">Copy</button>
        </div>
        <pre class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono">${esc(programJson)}</pre>
      </div>
    `;

    content.innerHTML = html;
    content.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(btn.dataset.copy).then(() => {
          btn.textContent = '✓ Copied';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
    });
    exportModal.classList.remove('hidden');
  }
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
