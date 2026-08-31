---
inclusion: auto
---

# V3 Vision: AI-native Sessions (trainer-led)

This doc captures the decided direction for V3 of the Action App. It auto-loads
into every session in this folder, so any new chat inherits the plan. It is the
source of truth for the V3 track (Initiative F in `initiatives.md`).

Status: decided (all 12 questions answered 2026-08-30). Not yet built.

## The one-sentence idea

Instead of tapping through a static list of exercises, the user talks to an AI
coach (a "trainer") that builds their workout, remembers their preferences, and
walks them through it. The user mostly taps suggested phrases; typing is the
last resort.

## Core architecture: two layers

The key design decision is separating dumb building blocks from the smart layer
that composes them.

1. **Exercise blocks stay discrete and static.** The existing `exercises.json`
   entries (demos, muscle groups, howTo, trainer-voice prose) are the building
   blocks. They do not know about plans, users, or sessions. We keep onboarding
   them exactly as we do today (ingestion pipeline, Initiative A). Every new
   exercise added is immediately usable by the trainer as a composable unit, so
   no ingestion work is throwaway.

2. **AI-native Sessions are the smart layer.** A Session owns a workout plan,
   holds the user's preferences, and drives execution (what is next, swap this,
   mark done, reschedule). The trainer agent composes discrete exercise blocks
   into plans at runtime instead of a human hand-authoring static programs.

Consequence: static programs stop being the source of truth for what a user
does. They become templates the trainer can start from.

| Layer | V2 (today) | V3 (this vision) |
|-------|-----------|------------------|
| Exercise blocks | `exercises.json`, static, discrete | Same, still discrete, keep onboarding |
| Plans | `workouts.json` / `plans.json`, hand-authored | Composed by the Session/trainer from blocks; demoted to seed templates |
| User prefs and progress | localStorage, per device | Owned by the Session |
| Execution | Tap through a static program | Driven by the trainer, tap/voice first |

## Vocabulary

- **Session** = a chat. Owns one workout plan, the user's preferences for it, and
  execution state.
- **Trainer** = the AI agent inside a Session. Composes exercise blocks, prescribes,
  coaches through execution.
- **Block** = a discrete exercise from `exercises.json`.
- **Template** = a demoted static program (`workouts.json`) the trainer can
  instantiate into a Session plan.

## Input priority (the crucial goal: minimize typing)

Typing is the least necessary way to talk to the app. Priority order:

1. **Tap** suggested click-phrases (primary).
2. **Voice-to-text** always available, one tap away (secondary).
3. **Keyboard / text box** hidden by default, shown only when the user explicitly
   asks for it (last resort).

Every screen must let the user complete a full workout start-to-finish using only
taps and voice. The keyboard never appears unprompted.

## Decisions (answered questions)

1. **Session state storage:** Local-first, with a backend-ready schema. Ship on
   localStorage now; design the Session data model so a backend drops in at
   Phase 2 without a rewrite.
2. **Backend stack (when we add one):** Supabase.
3. **LLM provider:** Anthropic Claude.
4. **Codebase:** New `v3/` app alongside `v2/`, sharing the JSON data files. v2
   keeps building and deploying, untouched.
5. **Static programs:** Demote to seed templates the trainer can instantiate and
   edit. Do not retire them.
6. **Agent authoring:** The trainer composes existing blocks only. Onboarding new
   blocks stays a human/ingestion job (keeps blocks accurate; avoids the bad-AI-
   content problem seen in the demo-finder run).
7. **Trainers:** One trainer voice for V3, but model the schema so multiple
   specialties/personas can be added later.
8. **Click-phrase generation:** Hybrid. The trainer returns contextual suggested
   replies each turn, plus a persistent action bar of common verbs
   (Next, Swap, Done, Harder, Easier, Reschedule).
9. **Calendar:** Read-only schedule of planned and completed Sessions for V3.
   Drag-to-edit / recurrence deferred.
10. **One-off / quick-start plans:** A quick-start is an ephemeral Session with no
    saved plan; one tap promotes it to a saved Session.
11. **First build step:** A mocked Phase-0 prototype (no real LLM) to prove the
    tap/voice interaction feels good before committing to a backend or agent.
12. **How to run V3:** Its own workstream (Initiative F), in a separate
    session/worktree, so V3 work never entangles the live v2 app.

## Phased plan

**Phase 0 -- Mocked click-phrase prototype (throwaway).**
One screen in `v3/`. A scripted trainer walks through starting and completing a
workout using only tappable phrases and voice-to-text. No real LLM, no backend.
Goal: feel the interaction, confirm typing is avoidable. Kill cheaply if it does
not sing.

**Phase 1 -- Real trainer agent over the JSON blocks (still local).**
Wire Claude behind a small proxy (the client cannot hold an API key on static
hosting). The trainer manages a Session by calling structured tools:
`startPlan(templateId)`, `addBlock`, `swapBlock`, `markDone`, `reschedule`. Reads
the discrete `exercises.json` blocks and the demoted templates. Session state in
localStorage, using the backend-ready schema.

**Phase 2 -- Persistence + accounts.**
Supabase for Session/chat history, user accounts, multi-device, and the read-only
calendar. Migrate the local Session schema to Supabase.

## What does NOT change

- Exercise ingestion (Initiative A) -- discrete blocks are already the right shape.
- `exercises.json` as the block library (reused as-is).
- The v2 app -- it stays shippable and deployable throughout.

## Open questions (resolve during Phase 0/1, not blocking now)

- Exact Session JSON schema (plan + prefs + execution state) that is both
  localStorage-friendly and Supabase-migratable.
- Voice-to-text implementation (Web Speech API vs a service).
- How prescriptive the trainer is (does it auto-progress load, suggest deloads?).
- Product name for V3.
- Where the Claude proxy runs in Phase 1 (small serverless function vs local dev only).
