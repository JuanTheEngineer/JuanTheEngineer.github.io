# Action App

Mobile-first fitness webapp. Browse programs, follow along, track progress.

**Live:** [juantheengineer.github.io](https://juantheengineer.github.io)

## Quick Start

```bash
cd v2
npm install
npm run dev        # → http://localhost:5173
```

## Testing

```bash
cd v2
npm test           # Build + 11 data integrity assertions
```

**Preview production locally** (Studio hidden):

```bash
cd v2
npm run build
npx serve ../docs -l 4174
# Open your LAN IP (e.g. http://192.168.x.x:4174)
```

Manual checklist:
- Home page loads, Search/Browse/Library cards visible
- Search → type a program name → results appear → tap → program loads
- Exercise library → expand → "View full page →" → detail page renders
- Program detail → exercises expand, demos play, checkboxes persist
- No console errors, mobile viewport (390px) looks good

## Deployment

Push to `main` → GitHub Actions runs tests → deploys to GitHub Pages.

```bash
git push
```

First time: go to repo Settings → Pages → Source → **GitHub Actions**.

## Project Structure

```
├── v2/                    # App source (Vite + Tailwind 4 + vanilla JS)
│   ├── src/pages/         # Route pages
│   ├── src/components/    # Reusable UI components
│   ├── src/utils/         # Router, data loader, storage
│   └── scripts/           # Build helpers, smoke test
├── docs/                  # Build output (served by GitHub Pages)
├── gifs/                  # Exercise demo GIFs (Cloudinary primary)
├── schemas/               # JSON Schema definitions
├── scripts/               # Data migration tools (reference)
├── exercises.json         # 93 exercises (source of truth)
├── workouts.json          # 15 programs
├── plans.json             # Program categories
└── glossary.json          # Term definitions
```

## Stack

- Vanilla JS (no framework), Vite 5, Tailwind CSS 4, TypeScript (strict)
- Static JSON data, Cloudinary CDN, YouTube embeds
- GitHub Pages + GitHub Actions CI/CD
- ESLint + Prettier

## Studio (Dev Only)

The Program Studio (`/#/studio`) is only available on `localhost`. It lets you create/edit programs and exercises, then export JSON to paste into the data files.

## Routes

| Route | Description |
|-------|-------------|
| `/#/` | Home |
| `/#/search` | Program search |
| `/#/programs` | Browse by category |
| `/#/program/:id` | Program detail + tracking |
| `/#/exercises` | Exercise library |
| `/#/exercise/:id` | Single exercise detail |
| `/#/studio` | Studio (local only) |
