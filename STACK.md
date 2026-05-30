# Technical Stack Overview: Juan's Workout Database

> **Last Updated**: January 2025  
> **Version**: V1.0 (Mobile-First Onsen UI)  
> **Developer**: Juan Rodriguez (L5 SDE @ Amazon)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/JuanTheEngineer/JuanTheEngineer.github.io.git
cd JuanTheEngineer.github.io

# Serve locally (Python 3)
python3 -m http.server 4000

# Access the site
# V1 (Modern): http://127.0.0.1:4000/
# V0 (Legacy): http://127.0.0.1:4000/v0/
```

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│                  (Static Hosting)                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Jekyll Processing                      │
│              (Automatic on push to main)                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    V1 Mobile App                         │
│                  (Onsen UI SPA)                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  index.html (Main Entry Point)                  │   │
│  │  - Onsen UI Navigator                           │   │
│  │  - Tabbar (Home, Start, Programs, Glossary)    │   │
│  │  - Inline JavaScript (Vanilla)                  │   │
│  │  - Inline CSS (Custom Styling)                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  workouts.json (Exercise Programs)              │   │
│  │  plans.json (Category Organization)             │   │
│  │  glossary.json (Exercise Definitions)           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Client Storage                          │
│              (localStorage API)                          │
│  - Workout progress (checkboxes)                        │
│  - Timeline state                                        │
│  - User preferences                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
- **Onsen UI 2.x** (Mobile-first UI components)
  - CDN: `https://unpkg.com/onsenui/`
  - Components: `ons-navigator`, `ons-tabbar`, `ons-page`, `ons-card`, `ons-list`
  - Why: Lightweight, mobile-optimized, no build step required

### Core Technologies
- **HTML5** (Semantic markup)
- **CSS3** (Custom properties, flexbox, animations)
- **Vanilla JavaScript** (ES6+, no frameworks)
  - No TypeScript (yet)
  - No build tools (yet)
  - Direct DOM manipulation

### Data Format
- **JSON** (Structured data files)
  - `workouts.json`: 10+ programs, 100+ exercises
  - `plans.json`: Category organization
  - `glossary.json`: Exercise terminology

### Storage
- **localStorage** (Client-side persistence)
  - Workout progress tracking
  - No backend, no database
  - No user accounts

### Deployment
- **GitHub Pages** (Static hosting)
  - Automatic deployment on push to `main`
  - Jekyll processing (minimal config)
  - HTTPS enabled
  - Custom domain support (not yet configured)

### Assets
- **82 Exercise GIFs** (Demonstrations)
  - Stored in `/gifs/` directory
  - Referenced by path in JSON
  - Optimized for mobile viewing (3:4 aspect ratio, 9 fps)

### Exercise Content Pipeline
- **YouTube → GIF Conversion** (Python tooling)
  - `youtube_to_gif_v2.py`: Main conversion script
  - `run_gif_maker.sh`: Bash wrapper with parameters
  - Dependencies: pytube, moviepy, yt-dlp, ffmpeg, PIL
  - ChatGPT API: Auto-generates PascalCase exercise names
  - Output: `gifs_staging/` → manual move to `gifs/`

---

## Project Structure

```
JuanTheEngineer.github.io/
│
├── index.html              # V1 Main entry (Onsen UI app)
├── workouts.json           # Exercise program data
├── plans.json              # Category organization
├── glossary.json           # Exercise definitions
├── _config.yml             # Jekyll configuration
├── README.md               # Project documentation
├── CLAUDE.md               # AI assistant guidance
├── STACK.md                # This file
├── Planning.txt            # Development notes
│
├── gifs/                   # Exercise demonstration GIFs (82 files)
│   ├── BarbellSquat.gif
│   ├── Chinups.gif
│   └── ...
│
├── gifs_staging/           # Staging folder for new GIFs (from youtube_to_gif_v2.py)
│
├── youtube_to_gif_v2.py    # Python script: YouTube → GIF conversion
├── run_gif_maker.sh        # Bash wrapper for youtube_to_gif_v2.py
│
├── v0/                     # Legacy desktop version
│   ├── index.html
│   ├── programs.html
│   ├── start.html
│   ├── glossary.html
│   ├── style.css
│   └── ...
│
├── _site/                  # Jekyll build output (auto-generated)
│
├── .kiro/                  # Kiro AI configuration
│   └── steering/
│       ├── commit-discipline.md
│       └── project-goals.md
│
└── onsen_demo/             # Development/demo files
```

---

## Data Structure

### workouts.json Schema

```json
{
  "programs": [
    {
      "id": "agility_lower_1-1",
      "title": "Agility Lower Body Program 1.1",
      "requirements": "Dumbbells, Exercise Band, Swiss Ball, Trap Bar",
      "exercises": [
        {
          "name": "Warm Up 1: Decline Pistols",
          "gif": "gifs/DeclinePistols.gif",
          "reps": "10",
          "sets": "4",
          "note": "Two seconds down, one second up. Elevate your heel.",
          "repUnits": "reps",
          "subExercise": {  // Optional: for compound movements
            "gif": "gifs/SplitSquats.gif",
            "reps": "12",
            "sets": "4",
            "note": "Controlled on the way down.",
            "repUnits": "reps"
          }
        }
      ]
    }
  ]
}
```

### plans.json Schema

```json
{
  "plans": [
    {
      "name": "Strength",
      "description": "All programs for Strength by zone.",
      "subPlans": [
        {
          "name": "Push/Pull/Legs 3-Day Rotation",
          "description": "Strength workouts that push your muscles...",
          "programs": [
            "ppl_push_day_1-0",
            "ppl_pull_day_1-0",
            "ppl_leg_day_1-0"
          ]
        }
      ]
    }
  ]
}
```

---

## Key Features & Implementation

### 1. Progress Tracking
**Implementation**: localStorage + DOM manipulation
```javascript
// Store completion state
let completedExercises = {};
completedExercises[exerciseIndex] = true;
localStorage.setItem('workout_progress', JSON.stringify(completedExercises));

// Update timeline dot
dots[index].classList.add('completed');
```

### 2. Timeline Visualization
**Implementation**: CSS flexbox + dynamic classes
```css
.timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.timeline-dot.active {
  background: var(--primary-blue);
  transform: scale(1.1);
}
```

### 3. Expandable Exercise Rows
**Implementation**: Toggle CSS classes
```javascript
function toggleExercise(element) {
  const content = element.querySelector('.exercise-content');
  content.classList.toggle('active');
}
```

### 4. Share Functionality
**Implementation**: Web Share API + clipboard fallback
```javascript
if (navigator.share) {
  navigator.share({
    title: programTitle,
    url: window.location.href
  });
} else {
  navigator.clipboard.writeText(window.location.href);
}
```

---

## CSS Architecture

### Design System (CSS Custom Properties)

```css
:root {
  /* Primary Brand Colors */
  --primary-blue: #4586F1;
  --primary-dark-blue: #093175;
  --primary-light-blue: #65A9ED;
  --primary-very-light-blue: #C5DDFA;

  /* Accent Colors */
  --accent-white: #FFFFFF;
  --accent-light-gray: #f4f4f4;
  --accent-gray: #e0e0e0;
  --accent-dark: #333333;

  /* Semantic Colors */
  --success-green: #28a745;
  --text-primary: var(--primary-dark-blue);
  --bg-primary: var(--accent-white);
}
```

### Key UI Components
- **Toolbar**: Dark blue header with white text
- **Timeline**: Adaptive dot visualization (1, 2, or 4+ layouts)
- **Progress Bar**: Animated with shimmer effect
- **Exercise Cards**: Expandable with completion checkmarks
- **Hero Section**: Gradient blue background

---

## JavaScript Architecture

### Global Namespace
```javascript
window.WorkoutApp = {
  navigator: null,
  workoutsData: [],
  categoriesData: [],
  glossaryData: []
};
```

### Page Lifecycle (Onsen UI)
```javascript
ons.getScriptPage().onInit = function() {
  // Page initialization
  loadProgramData(this);
};

ons.getScriptPage().onShow = function() {
  // Page shown (navigation)
};
```

### Data Loading Pattern
```javascript
Promise.all([
  fetch('workouts.json').then(r => r.json()),
  fetch('plans.json').then(r => r.json()),
  fetch('glossary.json').then(r => r.json())
])
.then(([workouts, plans, glossary]) => {
  WorkoutApp.workoutsData = workouts.programs;
  // ... initialize app
});
```

---

## Development Workflow

### Local Development
```bash
# Serve with Python
python3 -m http.server 4000

# Or with Node (if you have http-server)
npx http-server -p 4000

# Access at http://localhost:4000
```

### Adding New Exercises

**Current Workflow** (YouTube → GIF → JSON):

```bash
# 1. Edit run_gif_maker.sh with parameters
VIDEO_URL="https://www.youtube.com/shorts/kzc1LZbBtkI"
START_TIME=3
END_TIME=10
ASPECT_RATIO="3:4"
OUTPUT_FOLDER="gifs_staging"

# 2. Run the script
./run_gif_maker.sh

# Script automatically:
# - Downloads YouTube video (yt-dlp)
# - Extracts clip (start → end time)
# - Crops to 3:4 aspect ratio (mobile-optimized)
# - Converts to GIF (9 fps, moviepy)
# - Uses ChatGPT API to generate PascalCase name
# - Saves to gifs_staging/BicepCurls.gif

# 3. Manual steps:
mv gifs_staging/BicepCurls.gif gifs/

# 4. Edit workouts.json manually
{
  "name": "Bicep Curls",
  "gif": "gifs/BicepCurls.gif",
  "reps": "10",
  "sets": "3",
  "note": "Keep elbows stationary",
  "repUnits": "reps"
}

# 5. Commit and push
git add gifs/BicepCurls.gif workouts.json
git commit -m "feat: add Bicep Curls exercise"
git push origin main
```

**Dependencies Required**:
```bash
# Python packages
pip install pytube moviepy yt-dlp pillow

# System dependencies
brew install ffmpeg  # macOS
# or: apt-get install ffmpeg  # Linux

# ChatGPT API key (in chatgpt_api.py)
OPENAI_API_KEY=sk-xxx
```

**Pain Points**:
- Requires editing shell script for each exercise
- No batch processing
- Manual file movement
- Manual JSON editing (error-prone)
- Requires Python setup and API keys

### Adding New Programs
1. Design program structure
2. Add to `workouts.json` programs array
3. Reference in `plans.json` category
4. Ensure all GIFs exist

### Deployment
```bash
# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main

# GitHub Pages auto-deploys in ~1 minute
```

---

## Performance Characteristics

### Load Time
- **Initial Load**: ~500ms (HTML + CSS + JS inline)
- **Data Fetch**: ~100ms (JSON files are small)
- **GIF Loading**: Lazy (only when exercise expanded)

### Bundle Size
- **HTML**: ~50KB (includes inline CSS + JS)
- **Onsen UI**: ~150KB (CDN cached)
- **Data**: ~30KB (all JSON files)
- **Total**: ~230KB (excluding GIFs)

### Browser Support
- **Target**: Modern mobile browsers (iOS Safari, Chrome)
- **Minimum**: ES6 support, localStorage, Fetch API
- **Tested**: iPhone 15, Android Chrome

---

## Known Limitations

### Current Constraints
1. **No Backend**: All data is static, no user accounts
2. **No Build Tools**: Manual DOM manipulation, no TypeScript
3. **No Testing**: No automated tests (yet)
4. **localStorage Only**: Data loss if browser cache cleared
5. **No Offline Support**: Requires internet for initial load
6. **No Analytics**: Can't track usage patterns

### Technical Debt
1. **Inline JavaScript**: All JS in `index.html` (~1000 lines)
2. **Inline CSS**: All styles in `<style>` tag (~800 lines)
3. **No Modules**: Everything in global scope
4. **No State Management**: Manual DOM updates
5. **No Routing**: Onsen UI navigator only

---

## Future Architecture Considerations

### Potential Improvements

#### 1. Modern Build Tooling
```
Current: Vanilla JS, no build
Future:  Vite + TypeScript + Component modules
```

#### 2. Component Architecture
```
Current: Monolithic index.html
Future:  Separate components (Timeline.ts, ExerciseCard.ts, etc.)
```

#### 3. State Management
```
Current: Manual DOM updates
Future:  Reactive state (Signals, Zustand, or similar)
```

#### 4. Backend Integration
```
Current: Static JSON files
Future:  Firebase/Supabase for sync
```

#### 5. Testing
```
Current: Manual testing only
Future:  Vitest + Testing Library
```

---

## Dependencies

### Production Dependencies (CDN)
- **Onsen UI**: `2.x` (UI components)
  - CSS: `https://unpkg.com/onsenui/css/onsenui.css`
  - JS: `https://unpkg.com/onsenui/js/onsenui.min.js`

### Development Dependencies (Python Tooling)
- **pytube**: YouTube video downloading
- **moviepy**: Video editing and GIF conversion
- **yt-dlp**: Alternative YouTube downloader (more reliable)
- **Pillow (PIL)**: Image processing
- **ffmpeg**: Video codec (system dependency)
- **ChatGPT API**: Exercise name generation (requires API key)

### Future Considerations
- **Vite**: Build tooling
- **TypeScript**: Type safety
- **Vitest**: Testing framework
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Cloudinary SDK**: Media hosting (planned migration)

---

## Git Workflow

### Branch Strategy
- **main**: Production (auto-deploys to GitHub Pages)
- **feature/***: Feature branches (merge to main via PR)

### Commit Convention
Follow the 150-150-CR rule (see `.kiro/steering/commit-discipline.md`)

```
feat: add completion celebration animation

Implements user-requested celebration when all exercises completed.
- Add confetti animation
- Green checkmarks
- Success message

Lines changed: ~120 source, ~80 test
```

---

## Environment Variables

### None Currently
All configuration is hardcoded or in JSON files.

### Future Considerations
```bash
# If adding backend
VITE_API_URL=https://api.example.com
VITE_FIREBASE_KEY=xxx
```

---

## Debugging Tips

### Common Issues

**1. Exercises not loading**
```javascript
// Check browser console for fetch errors
// Verify JSON syntax with: https://jsonlint.com/
```

**2. Progress not saving**
```javascript
// Check localStorage in DevTools
localStorage.getItem('workout_progress')
```

**3. Timeline not updating**
```javascript
// Check if dots have correct classes
document.querySelectorAll('.timeline-dot')
```

### DevTools Setup
1. Open Chrome DevTools (F12)
2. **Application** tab → localStorage
3. **Network** tab → check JSON loads
4. **Console** tab → check for errors

---

## Resources

### Documentation
- [Onsen UI Docs](https://onsen.io/v2/guide/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

### Project Files
- `README.md`: User-facing documentation
- `CLAUDE.md`: AI assistant guidance
- `Planning.txt`: Development notes
- `HCI Action App Individual Project.md`: Research report

---

## Quick Reference

### File Locations
```
Main App:     index.html
Data:         workouts.json, plans.json, glossary.json
Assets:       gifs/
Legacy:       v0/
Config:       _config.yml
Docs:         README.md, STACK.md, CLAUDE.md
```

### Key Functions
```javascript
loadAppData()              // Load JSON data
loadStartWorkoutPlans()    // Render Start tab
loadProgramsList()         // Render Programs tab
loadAdvancedProgramDetail() // Render workout detail
toggleExercise()           // Expand/collapse exercise
toggleCompleted()          // Mark exercise complete
```

### Key Classes
```css
.timeline-dot              // Timeline indicator
.exercise-item             // Exercise row
.exercise-content          // Expandable content
.completed                 // Completion state
.active                    // Active/expanded state
```

---

**Last Updated**: January 2025  
**Maintainer**: Juan Rodriguez  
**Questions?**: Check `CLAUDE.md` or open an issue on GitHub
