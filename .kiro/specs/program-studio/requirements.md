# Requirements Document

## Introduction

The Program Studio is a "Create" UI inside the v2 webapp for authoring new programs and exercises without hand-editing JSON. It writes to `workouts.json` (programs) and `exercises.json` (exercises). Plan placement is handled separately outside the Studio.

## Requirements

- [ ] 1. The home page displays a "Create" button that navigates to `/#/studio`. The studio page shows a chooser: "New Program" or "New Exercise". {FR-1}
- [ ] 2. When creating a program, the user fills in: Title (required, id auto-derives as snake_case), Requirements (optional), Description (optional), Difficulty (optional dropdown), Duration in minutes (optional). {FR-2}
- [ ] 3. A search input queries the 96 canonical exercises by name, aliases, and id. Returns top 10 matches ranked by relevance. Shows exercise name and demo indicator. {FR-3}
- [ ] 4. Clicking a search result adds it to the program timeline as a single item with empty overrides (inherits from canonical recommendations). {FR-4}
- [ ] 5. Each timeline item has an expandable edit form for: reps, sets, repUnits (dropdown), note, displayName, and tags (multi-select: warmup, cooldown, stretch, main, accessory, finisher). {FR-5}
- [ ] 6. Items in the timeline can be reordered by dragging. Touch-friendly on mobile. {FR-6}
- [ ] 7. User can select 2+ adjacent items and group them as superset, compound, or circuit. Groups display as a visual container and can be ungrouped. {FR-7}
- [ ] 8. Groups have optional metadata: displayName, note, tags. {FR-8}
- [ ] 9. When the picker shows no results, a "+ Create new exercise" button opens a slide-over with: Name (required, id auto-derives), recommendations (optional), demos (0+), tags, equipment. On save, exercise is immediately searchable and queued for export. {FR-9}
- [ ] 10. Each exercise can have multiple demo sources. Each demo has a media type dropdown (YouTube, Cloudinary, Local, URL, TikTok, Vimeo) that shows type-specific fields. YouTube URLs show thumbnail preview. Exactly one demo can be primary. Demos can be added, removed, and reordered. {FR-10}
- [ ] 11. When user picks "New Exercise" from the chooser, the ExerciseEditor renders full-page with DemoManager. Export produces only the exercise JSON. {FR-11}
- [ ] 12. A "Preview" button renders the program using existing ProgramDetailPage components so the user sees exactly how it will look. {FR-12}
- [ ] 13. An "Export" button shows generated JSON: new exercises (if any) and the program object. Each section has "Copy to clipboard" and "Download .json" buttons. {FR-13}
- [ ] 14. A "Start from existing" option lets the user pick an existing program and deep-clone it into the editor with the id cleared. {FR-14}
- [ ] 15. The Studio runs entirely client-side with no backend or API keys. Works on GitHub Pages. {NFR-1}
- [ ] 16. All interactions work on a 390px viewport. Drag-and-drop is touch-friendly. {NFR-2}
- [ ] 17. Studio adds no more than ~15KB gzipped to the JS bundle. {NFR-3}
- [ ] 18. Exported JSON validates against program-v2.schema.json and exercises-library.schema.json. Empty optional fields are stripped. {NFR-4}
- [ ] 19. If the user navigates away with unsaved changes, a confirmation prompt appears. {NFR-5}
