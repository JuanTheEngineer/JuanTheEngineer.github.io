---
inclusion: auto
---

# Exercise Content Guidelines

This document defines the rules for writing and onboarding exercise data. All contributors (human or AI) must follow these guidelines when creating or editing exercise entries.

## General Writing Rules

1. All text must be professional, helpful, and written in plain English.
2. No profanity, vulgarity, slang, or crude humor.
3. No emojis, em dashes, en dashes, or decorative punctuation. Use commas, periods, and semicolons only.
4. No "AI-like" phrasing: avoid superlatives ("the best ever"), filler ("it's important to note that"), or bullet-style hyphens in prose fields.
5. Use a positive, encouraging tone. Frame corrections as improvements, not failures.
6. No body shaming, weight-based language, or assumptions about the reader's body type, age, gender, or ability level. Be politically correct and inclusive.
7. Do not favor or exclude any demographic. Exercises benefit everyone; write as if speaking to any human body.
8. Use active voice. Be direct and concise.
9. Write for an audience with no prior training knowledge, but do not be condescending.

## Field-Specific Rules

### description (string)
- One to two sentences explaining what the exercise is and how it is performed at a high level.
- Should orient someone who has never seen this movement before.

### purpose (string)
- One to three sentences on why this exercise is in a training program.
- Focus on what it builds, what movement pattern it trains, and who benefits from it.

### benefits (string)
- Physiobiological adaptations: tissue changes, injury prevention, hormonal response, movement carryover.
- Write in plain language. Avoid jargon without context. If you use a technical term, briefly explain it.
- Do not make medical claims or promise specific outcomes.

### howTo (string[])
- Numbered steps (the array order is the step order).
- Each step is one clear action. Keep to 3 to 6 steps total.
- Start each step with a verb.
- Do not include subjective commentary in the steps (save that for commonMistakes).

### commonMistakes (string[])
- A simple list of mistakes and their fixes.
- Format: state the mistake, then state the fix. Keep each item to one or two sentences.
- No hyphens or bullet markers in the text itself (the array structure handles listing).

### muscleGroups (string[])
- Must only contain IDs from `data-model.json > muscleGroups > values`.
- First item in the array should be the primary muscle group.
- Unknown or invented muscle group IDs are not allowed.

### equipment (string[])
- Must only contain IDs from `data-model.json > equipment > values`.
- Empty array means bodyweight only (no equipment needed).
- Unknown or invented equipment IDs are not allowed.

### alternatives (string[])
- Must only contain exercise IDs that exist in `exercises.json`.
- This field is optional. Leave as an empty array if unsure.
- Do not invent exercise IDs that do not exist in the database.

### recommendations.note (string)
- Practical coaching notes: tempo, weight guidance, modifications, context within a program.
- Keep to one to three sentences.

## Guardrails

1. Never reference a muscle group, equipment item, or exercise ID that does not exist in the canonical data model or exercises database. Validate before saving.
2. Never use language that implies a reader "should" look a certain way or that an exercise will change their appearance in aesthetic terms. Focus on function, strength, and health.
3. Never provide medical diagnoses or guarantee injury prevention. Use language like "may reduce risk" or "supports joint health" rather than "prevents" or "cures."
4. Never use gendered language when describing who an exercise is for. Avoid "this is great for women who want to tone" or "men who want to bulk up."
5. If an exercise has injury contraindications, state them neutrally: "May not be appropriate for individuals with active disc injuries. Consult a professional if unsure."
6. All data must be valid JSON. No trailing commas, no comments in data files.
7. Demo URLs must be real, accessible links. Do not use placeholder URLs.
8. When AI-generating content, always validate the output against these rules before committing.

## Reference Files

- Canonical muscle groups and equipment: `data-model.json`
- Exercise database: `exercises.json`
- Workout programs: `workouts.json`
- Training plans: `plans.json`
