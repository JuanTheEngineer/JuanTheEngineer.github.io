# Action App — Launch Plan

For the basketball crew and first real users. No login. Static app. Open and go.

---

## User Stories (All Valid)

| # | Story | Status | Roadmap Items Needed |
|---|-------|--------|---------------------|
| U1 | New user understands the app immediately | ✅ Done | — |
| U2 | Suggest program based on equipment | 🔲 Needs | D1, G3 |
| U3 | Filter programs by body part | 🔲 Needs | New: body focus filter |
| U4 | Search programs by name | ✅ Done | — |
| U5 | See reps, sets, form notes, video demo | ✅ Done | — |
| U6 | Check off exercises during workout | ✅ Done | — |
| U7 | Rest timer between sets | 🔲 Needs | A2 |
| U8 | Warmup/main/cooldown sections visible | ⚠️ Partial | B3 |
| U9 | Know how long a program takes | 🔲 Needs | B1 |
| U10 | Celebration on completion | ✅ Done | — |
| U11 | See last program to resume | ✅ Done | — |
| U12 | See workout streak | 🔲 Needs | A3, A5 |
| U13 | Track completed programs over time | 🔲 Needs | A3 |
| U14 | Know what weight I used last time | 🔲 Needs | A3, B4, B5 |
| U15 | Tap jargon for definitions | 🔲 Needs | G6 |
| U16 | Dedicated exercise page | ✅ Done | — |
| U17 | See what muscles an exercise targets | 🔲 Needs | G5 |
| U18 | Share program with friends | ✅ Done | — |
| U19 | Send feedback to developer | 🔲 Needs | K1 |
| U20 | Works offline after first load | 🔲 Needs | H1 |
| U21 | Install to home screen | 🔲 Needs | H2 |
| U22 | Big touch targets for sweaty hands | ⚠️ Mostly done | I3 audit |

---

## Launch Checklist

### Must-Have (blocks launch)

| # | Task | Effort | Notes |
|---|------|--------|-------|
| L1 | **Quality check all data** — exercises, programs, typos | Medium | Manual review + script assist |
| L2 | **Fix demo disappearing bug** — show placeholder instead of removing | Small | DemoCarousel.js onError handler |
| L3 | **Fix "Original" label** — change to "Video" or remove for primary demos | Small | sourceLabel() in DemoCarousel.js |
| L4 | **Loading spinners for demos** — 8-bit lifter animation while videos load | Small | New CSS animation + placeholder in MediaPlayer.js |
| L5 | **GIF tap to pause/resume** — tap pauses, tap again resumes | Small | Add click handler to video/img elements |
| L6 | **Section headers (warmup/main/stretch)** — visual separation by tags | Small | ProgramDetailPage.js — group by tag before rendering |
| L7 | **Feedback button (Google Form)** — embed or link on home + program pages | Small | 15 min, Google Form + link |
| L8 | **Add celebration text** — "Strengthened and Conditioned!" to the rotation | Tiny | Add string to celebration array |
| L9 | **Standardize program requirements** — consistent format across all 16 programs | Small | Data cleanup in workouts.json |
| L10 | **Standardize demo captions** — all demos have appropriate notes, remove dev context | Small | Data cleanup in exercises.json |
| L11 | **App manifest (PWA)** — install to home screen | Small | manifest.json + icons + meta tags |

### Nice-to-Have (do if time allows)

| # | Task | Effort | Notes |
|---|------|--------|-------|
| N1 | Body part filter on programs page | Small | Filter chips: Upper/Lower/Full Body/Rehab |
| N2 | Estimated session duration | Small | Calculate from exercise count × avg time |
| N3 | Inline glossary tooltips | Medium | Scan notes for terms, show popover |
| N4 | Rest timer between sets | Medium | Configurable countdown after completion |
| N5 | Service worker (offline) | Medium | Cache app shell + exercise data |
| N6 | Custom domain (actionapp.com or similar) | Small | DNS + GitHub Pages custom domain |

### Future (not for launch)

| # | Task | Notes |
|---|------|-------|
| F1 | Session history / log (A3) | Foundation for streaks, calendar, progress |
| F2 | Streak tracking (A5) | Depends on session history |
| F3 | Weight tracking per exercise (B4, B5) | Depends on session history |
| F4 | Muscle group tagging (G5) | Data enrichment, enables filters |
| F5 | Notes quality overhaul | CSV export → manual review → re-import. Full process below. |
| F6 | Note format guards | Schema validation that rejects exercises without notes |

---

## Notes Quality Overhaul Process (F5)

1. I generate a CSV: `exercise_id | exercise_name | current_note | your_note`
2. You fill in the `your_note` column with how you want each note styled
3. I migrate all notes to your format
4. We add a smoke test assertion: every exercise must have a non-empty note
5. Program-level note overrides continue to work (they already do)

Same process for:
- **Requirements standardization** — CSV of program requirements, you standardize format
- **Demo caption cleanup** — CSV of all demo notes, you approve/fix each

---

## Domain Options

For a mobile-only fitness app, consider:

| Domain | Availability | Vibe |
|--------|-------------|------|
| actionapp.fit | Likely available | Clean, fitness-specific TLD |
| getaction.app | Likely available | "Get Action" — memorable |
| noexcuses.app | Check availability | Matches your tagline |
| action.fitness | Likely available | Premium feel |
| juanaction.com | Likely available | Personal brand tie |

You'd buy the domain, add it as custom domain in GitHub Pages settings, and add a CNAME. 10 minutes of work once you pick one.

---

## Suggested Build Order

**Week 1 (must-ship):**
- L2, L3, L4, L5, L8 (quick fixes)
- L6 (section headers)
- L7 (feedback form)
- L11 (manifest / installable)

**Week 2 (quality):**
- L1 (data quality check)
- L9, L10 (standardize requirements + demo captions)
- N1 (body part filter)
- N2 (duration estimate)
- N6 (custom domain)

**Week 3+ (nice-to-have):**
- N3, N4, N5 (glossary, timer, offline)
- F5 (notes overhaul)

---

## What Users Get at Launch

1. Open app → see clear entry points (Search, Browse, Library)
2. Pick a program → see duration estimate, equipment needed, structured sections
3. Follow along → video demos load with cute animation, tap to pause
4. Check off exercises → celebration when done
5. Come back tomorrow → "Pick up where you left off"
6. Share with friends → link or share sheet
7. Send feedback → Google Form
8. Install to phone → feels like a native app
