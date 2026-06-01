// AI Agent Core: manages conversation, calls OpenAI, executes tools
import { searchExercises } from '../components/ExercisePicker.js';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';
const MAX_HISTORY = 20; // keep last N messages to stay within context

// --- API Key Management ---
const KEY_STORAGE = 'action-app:openai-key';

export function getApiKey() {
  return localStorage.getItem(KEY_STORAGE) || '';
}

export function setApiKey(key) {
  localStorage.setItem(KEY_STORAGE, key);
}

export function hasApiKey() {
  return !!getApiKey();
}

// --- Program State ---
export function createProgramState() {
  return {
    meta: { title: '', id: '', requirements: '', description: '' },
    items: [],
    newExercises: []
  };
}

// --- Tool Definitions (OpenAI format) ---
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_exercises',
      description: 'Search the exercise library by name, alias, or keyword. Always call this before adding an exercise.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (exercise name or keyword)' },
          limit: { type: 'number', description: 'Max results to return (default 5)' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'add_exercise',
      description: 'Add an exercise to the program timeline.',
      parameters: {
        type: 'object',
        properties: {
          exerciseId: { type: 'string', description: 'Exercise ID from search results' },
          reps: { type: 'string', description: 'Number of reps (e.g. "10", "30", "AMRAP")' },
          sets: { type: 'string', description: 'Number of sets (e.g. "3", "4")' },
          repUnits: { type: 'string', description: 'Unit type: reps, secs, min, yd' },
          note: { type: 'string', description: 'Form cues or notes' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags like warmup, stretch' }
        },
        required: ['exerciseId']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'create_exercise',
      description: 'Create a new exercise that does not exist in the library.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exercise name' },
          reps: { type: 'string' },
          sets: { type: 'string' },
          repUnits: { type: 'string' },
          note: { type: 'string' }
        },
        required: ['name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'remove_exercise',
      description: 'Remove an exercise from the program by its position (0-based index).',
      parameters: {
        type: 'object',
        properties: {
          index: { type: 'number', description: '0-based position in the timeline' }
        },
        required: ['index']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'group_exercises',
      description: 'Group exercises into a superset, compound set, or circuit.',
      parameters: {
        type: 'object',
        properties: {
          indices: { type: 'array', items: { type: 'number' }, description: '0-based positions to group' },
          kind: { type: 'string', enum: ['superset', 'compound', 'circuit'] }
        },
        required: ['indices', 'kind']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'set_metadata',
      description: 'Set program title, requirements, or description.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          requirements: { type: 'string' },
          description: { type: 'string' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'update_exercise',
      description: 'Update reps, sets, note, or tags of an exercise at a given position.',
      parameters: {
        type: 'object',
        properties: {
          index: { type: 'number', description: '0-based position' },
          reps: { type: 'string' },
          sets: { type: 'string' },
          repUnits: { type: 'string' },
          note: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['index']
      }
    }
  }
];

// --- Tool Executors ---
async function executeTool(name, args, state) {
  switch (name) {
    case 'search_exercises': {
      const results = await searchExercises(args.query, args.limit || 5);
      return results.map((r) => ({
        id: r.id,
        name: r.name,
        hasDemos: r.hasDemos,
        reps: r.exercise?.recommendations?.reps,
        sets: r.exercise?.recommendations?.sets,
        repUnits: r.exercise?.recommendations?.repUnits
      }));
    }
    case 'add_exercise': {
      const item = { exerciseId: args.exerciseId };
      if (args.reps) item.reps = args.reps;
      if (args.sets) item.sets = args.sets;
      if (args.repUnits && args.repUnits !== 'reps') item.repUnits = args.repUnits;
      if (args.note) item.note = args.note;
      if (args.tags?.length) item.tags = args.tags;
      state.items.push(item);
      return { success: true, index: state.items.length - 1, total: state.items.length };
    }
    case 'create_exercise': {
      const id = args.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      const newEx = { id, name: args.name, demos: [], recommendations: {} };
      if (args.reps) newEx.recommendations.reps = args.reps;
      if (args.sets) newEx.recommendations.sets = args.sets;
      if (args.repUnits) newEx.recommendations.repUnits = args.repUnits;
      if (args.note) newEx.recommendations.note = args.note;
      state.newExercises.push(newEx);
      return { success: true, id, name: args.name };
    }
    case 'remove_exercise': {
      if (args.index >= 0 && args.index < state.items.length) {
        state.items.splice(args.index, 1);
        return { success: true, remaining: state.items.length };
      }
      return { success: false, error: 'Invalid index' };
    }
    case 'group_exercises': {
      // Simple grouping: collect items at indices, replace with group
      const sorted = [...args.indices].sort((a, b) => a - b);
      const members = sorted.map((i) => state.items[i]).filter(Boolean);
      if (members.length < 2) return { success: false, error: 'Need at least 2 exercises to group' };
      // Remove from highest index first to preserve positions
      for (let i = sorted.length - 1; i >= 0; i--) {
        state.items.splice(sorted[i], 1);
      }
      const group = { kind: args.kind, exercises: members };
      state.items.splice(sorted[0], 0, group);
      return { success: true, groupIndex: sorted[0] };
    }
    case 'set_metadata': {
      if (args.title) state.meta.title = args.title;
      if (args.requirements) state.meta.requirements = args.requirements;
      if (args.description) state.meta.description = args.description;
      if (args.title) state.meta.id = args.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
      return { success: true, meta: state.meta };
    }
    case 'update_exercise': {
      const item = state.items[args.index];
      if (!item) return { success: false, error: 'Invalid index' };
      if (args.reps) item.reps = args.reps;
      if (args.sets) item.sets = args.sets;
      if (args.repUnits) item.repUnits = args.repUnits;
      if (args.note) item.note = args.note;
      if (args.tags) item.tags = args.tags;
      return { success: true };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// --- System Prompt Builder ---
export function buildSystemPrompt(exerciseCatalog) {
  return `You are a fitness programming assistant for the Action App. You help users build workout programs through conversation.

## Your Capabilities
- Search the exercise library (${exerciseCatalog.length} exercises) using the search_exercises tool
- Add exercises to the program timeline using add_exercise
- Create new exercises when nothing in the library matches using create_exercise
- Group exercises into supersets, compounds, or circuits using group_exercises
- Set program metadata (title, requirements) using set_metadata
- Update or remove exercises

## Rules
1. ALWAYS call search_exercises before add_exercise — never guess exercise IDs
2. Use the user's exact reps/sets if specified; otherwise use exercise defaults from search results
3. Tag warmup exercises with ["warmup"] and cooldown/stretches with ["stretch"]
4. If the user's request is ambiguous, ask a clarifying question
5. After adding exercises, briefly confirm what was added
6. When creating new exercises, the ID will be auto-generated from the name

## Fitness Knowledge
- Balanced lower body: quads, hamstrings, glutes, calves
- Balanced upper body: chest, back, shoulders, arms
- Warmups: 2-4 exercises, low intensity, movement-specific
- Rep ranges: strength (3-6), hypertrophy (8-12), endurance (15-20), rehab (12-20 slow)
- Supersets pair opposing muscles or same muscle for intensity
- Rehab: higher reps, slower tempo, isometric holds, avoid impact

## Exercise Library (${exerciseCatalog.length} exercises, format: id | name):
${exerciseCatalog.map((e) => `${e.id} | ${e.name}`).join('\n')}
`;
}

// --- Build program state summary for context ---
function programStateContext(state) {
  if (state.items.length === 0 && !state.meta.title) return '\n[Program is empty — no exercises added yet]';
  let ctx = '\n## Current Program State\n';
  if (state.meta.title) ctx += `Title: ${state.meta.title}\n`;
  if (state.meta.requirements) ctx += `Requirements: ${state.meta.requirements}\n`;
  ctx += `\nTimeline (${state.items.length} items):\n`;
  state.items.forEach((item, i) => {
    if (item.kind) {
      ctx += `${i}. [${item.kind}] ${item.exercises.map((e) => e.exerciseId).join(' + ')}\n`;
    } else {
      ctx += `${i}. ${item.exerciseId} — ${item.reps || '?'} ${item.repUnits || 'reps'} × ${item.sets || '?'} sets${item.tags?.length ? ` [${item.tags.join(', ')}]` : ''}\n`;
    }
  });
  if (state.newExercises.length > 0) {
    ctx += `\nNew exercises created this session: ${state.newExercises.map((e) => e.name).join(', ')}\n`;
  }
  return ctx;
}

// --- Main Agent: send message and get response ---
export async function sendAgentMessage(userMessage, history, state, exerciseCatalog, onChunk) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key configured');

  const systemPrompt = buildSystemPrompt(exerciseCatalog) + programStateContext(state);

  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-MAX_HISTORY),
    { role: 'user', content: userMessage }
  ];

  // Call OpenAI with tools
  let response = await callOpenAI(apiKey, messages);
  let assistantMessage = response.choices[0].message;

  // Handle tool calls (may be multiple rounds)
  let rounds = 0;
  while (assistantMessage.tool_calls && rounds < 5) {
    rounds++;
    // Execute each tool call
    const toolResults = [];
    for (const tc of assistantMessage.tool_calls) {
      const args = JSON.parse(tc.function.arguments);
      const result = await executeTool(tc.function.name, args, state);
      toolResults.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify(result)
      });
      // Notify UI of tool execution
      onChunk?.({ type: 'tool', name: tc.function.name, args, result });
    }

    // Send tool results back to get final response
    messages.push(assistantMessage);
    messages.push(...toolResults);
    response = await callOpenAI(apiKey, messages);
    assistantMessage = response.choices[0].message;
  }

  return assistantMessage.content || '';
}

async function callOpenAI(apiKey, messages) {
  const res = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  return res.json();
}

// --- Export program as JSON ---
export function exportProgram(state) {
  const program = { id: state.meta.id || 'untitled', title: state.meta.title || 'Untitled Program' };
  if (state.meta.requirements) program.requirements = state.meta.requirements;
  program.items = state.items;
  return { program, newExercises: state.newExercises };
}
