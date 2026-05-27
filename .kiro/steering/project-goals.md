---
inclusion: auto
---

# Juan's Workout Database: Project Goals & Vision

## Project Overview

**Juan's Workout Database** is a mobile-first web application that helps users plan, execute, and track their workout routines with minimal cognitive load. Born from personal experience and validated through rigorous HCI research, this project serves as both a functional fitness tool and a showcase of user-centered design principles.

## Origin Story

This project began as **my first coding project**—a way to learn web development, HTML/CSS/JavaScript, and GitHub Pages deployment. Years later, as an L5 SDE at Amazon, I'm bringing it up to professional standards while maintaining its core simplicity and effectiveness.

The project also served as the foundation for an **HCI (Human-Computer Interactions) class project**, where I conducted comprehensive user research including:
- Surveys with 24+ participants
- Wizard of Oz studies comparing instruction modalities
- Heuristic evaluations against Nielsen's principles
- Think-aloud usability testing

This research validated the core design decisions and identified clear user needs.

## Core Problem Statement

**Primary Problem**: Gym-goers struggle to choose, save, and follow workout plans efficiently while maintaining good exercise form and pace. The cognitive overload from managing sets, repetitions, weights, and form simultaneously leads to frustration, inefficiency, and wasted time.

**Secondary Problem**: Sharing workout plans between fitness enthusiasts is inefficient, relying on verbal communication, poorly formatted texts, or unconventional workarounds.

## Research-Validated User Needs

From our needfinding activities, we identified:

1. **Visual Demonstrations Are Critical** (58.3% prefer video, Wizard of Oz study confirmed 4.5/5 effectiveness)
2. **Progress Tracking Is Essential** (58.3% rely on memory alone—a major pain point)
3. **Minimal Phone Interaction** (54.2% prioritize this, distractions are a major issue)
4. **Balance Overview vs. Focus** (Users want to see the full workout but focus on one exercise at a time)
5. **Easy Sharing** (Low current usage but high potential when friction is removed)

## Project Goals

### Immediate Goals (V1 Polish)
1. ✅ **Reduce cognitive load** during workouts through clear visual hierarchy
2. ✅ **Provide visual demonstrations** for every exercise (82 GIFs currently)
3. ✅ **Enable progress tracking** with timeline and checkboxes
4. ✅ **Minimize interaction friction** with expandable rows (no modals)
5. ✅ **Support workout sharing** with native Web Share API

### Near-Term Goals (V1.x Enhancements)
6. 🎯 **Add completion celebrations** (user-requested: animations, green checkmarks, dopamine hits)
7. 🎯 **Implement weight tracking** (bodybuilder request: "remember what your last weight was")
8. 🎯 **Enable data export/backup** (localStorage safety concern)
9. 🎯 **Enhance exercise descriptions** (novice user support)
10. 🎯 **Connect custom domain** (professional polish)
11. 🎯 **Add onboarding flow** (first-time user tutorial, feature discovery)
12. 🎯 **Improve workout storage** (export/import, backup to cloud, workout history)

### Long-Term Goals (V2+)
11. 🔮 **AI-powered workout generation** (conversational agent that asks questions and prescribes personalized workouts)
12. 🔮 **Workout builder** (let users create custom routines manually)
13. 🔮 **Multi-device sync** (cloud backup, optional accounts)
14. 🔮 **Social features** (share workouts, discover popular routines)
15. 🔮 **Progressive web app** (offline support, install to home screen)
16. 🔮 **Analytics & insights** (track progress over time, identify trends)

## Design Principles

Based on our HCI research and evaluation:

### 1. **Discoverability** (Norman, 2013)
- Clear visual indicators for all actions
- Intuitive navigation without hidden features
- Progress always visible (timeline + checkboxes)

### 2. **Simplicity** (Nielsen's Heuristics)
- Present only essential information during workouts
- Hide complexity until needed (expandable rows)
- Minimize cognitive load at every step

### 3. **Flexibility & Efficiency** (Universal Design)
- Serve both novice and expert users
- Allow flexible exercise ordering
- Support different workout contexts (home vs. gym)

### 4. **Visual-First Communication**
- GIF demonstrations as primary instruction method
- Large, clear visuals when exercise is expanded
- Text as supplementary, not primary

### 5. **Minimal Interaction**
- Reduce phone usage during workouts
- One-tap actions wherever possible
- Persistent state (no re-entering data)

## Success Metrics

### User Experience
- **Cognitive Load**: Users report low mental effort during workouts
- **Confidence**: Users feel confident in exercise execution (target: 4.5/5)
- **Satisfaction**: Users prefer this over current methods
- **Adoption**: Users actually use it regularly (not just try once)

### Technical Quality
- **Performance**: Fast load times, smooth animations
- **Reliability**: No data loss, consistent behavior
- **Accessibility**: Works on all common mobile devices
- **Maintainability**: Clean code, good documentation

### Engagement
- **Daily Active Users**: Track how many people use it regularly
- **Workout Completion Rate**: % of started workouts that are finished
- **Sharing Rate**: How often workouts are shared
- **Return Rate**: How often users come back

## Target Audience

### Primary Users
- **Returning Gym-Goers**: People who exercise 3-5x/week, familiar with workouts but need structure
- **Intermediate Lifters**: Know basic exercises, want to try new programs
- **Mobile-First Users**: Prefer phone over paper/notebooks

### Secondary Users
- **Novice Exercisers**: Need visual guidance and clear instructions
- **Personal Trainers**: Want to share workout plans with clients
- **Fitness Enthusiasts**: Looking for new workout ideas

## Technical Philosophy

### Current Approach (V1)
- **Vanilla JavaScript**: No framework overhead, fast and simple
- **Mobile-First**: Designed for iPhone 15 (most popular US smartphone)
- **Progressive Enhancement**: Works without JavaScript for basic content
- **Static Hosting**: GitHub Pages, no backend complexity
- **localStorage**: Client-side persistence, no accounts needed
- **Static JSON Data**: Curated workout programs in `workouts.json`

### Current State & Limitations

#### User Onboarding (First-Time User Experience)
**Current State**: 
- No onboarding flow for first-time users
- Users land directly on Home tab with text explanation
- No tutorial or guided tour
- Glossary exists but not discoverable
- Users must explore to understand features

**Known Issues**:
- Confusion on first use (identified in think-aloud testing)
- Timeline feature not explained
- Checkbox interaction not obvious
- Share button purpose unclear

#### Exercise Content Onboarding (Developer Workflow)
**Current State**:
- **YouTube → GIF Pipeline**: `youtube_to_gif_v2.py` script downloads YouTube videos and converts to GIFs
- **AI-Powered Naming**: Uses ChatGPT API to generate PascalCase GIF names from video titles/descriptions
- **Automated Processing**: `run_gif_maker.sh` wrapper script with hardcoded parameters
- **Manual Steps**:
  1. Edit `run_gif_maker.sh` with YouTube URL, start/end times, aspect ratio
  2. Run script to generate GIF in `gifs_staging/` folder
  3. Manually move GIF from staging to `gifs/` folder
  4. Manually edit `workouts.json` to add exercise entry
  5. Commit GIF + JSON changes to git

**Current Workflow**:
```bash
# 1. Edit run_gif_maker.sh
VIDEO_URL="https://www.youtube.com/shorts/kzc1LZbBtkI"
START_TIME=3
END_TIME=10
ASPECT_RATIO="3:4"

# 2. Run script
./run_gif_maker.sh

# 3. Manual steps
mv gifs_staging/BicepCurls.gif gifs/
# Edit workouts.json manually
git add gifs/BicepCurls.gif workouts.json
git commit -m "Add Bicep Curls exercise"
```

**Known Issues**:
- Requires editing shell script for each exercise (not user-friendly)
- Manual file movement from staging to production
- Manual JSON editing (error-prone, no validation)
- GIFs committed to git (bloats repository)
- No batch processing (one exercise at a time)
- Requires Python dependencies (pytube, moviepy, yt-dlp, ffmpeg)
- ChatGPT API dependency (requires API key, costs money)
- No preview before committing
- No rollback mechanism

#### Workout Storage
**Current State**:
- **Workout Programs**: Static JSON files (`workouts.json`, `plans.json`)
- **User Progress**: localStorage only (exercise completion, timeline state)
- **No Cloud Sync**: Data lives only on device
- **No Backup**: If browser cache cleared, progress lost
- **No History**: Can't view past workout sessions
- **No Weight Tracking**: Can't store weights used per exercise

**Known Issues**:
- Data loss risk (localStorage can be cleared)
- No multi-device support
- No workout history or analytics
- Can't track progressive overload
- No export/import functionality

### Future Considerations
- **Modern Tooling**: Consider Vite + TypeScript for better DX
- **Component Architecture**: Easier to maintain as features grow
- **Backend Integration**: For multi-device sync, workout history, weight tracking
- **Testing**: Add automated tests as complexity increases
- **AI Integration**: LLM-powered workout generation and personalization

## Non-Goals

What this project is **NOT** trying to be:

❌ **Not a social network** (though sharing is supported)
❌ **Not a comprehensive fitness tracker** (no calorie counting, no step tracking, no nutrition)
❌ **Not a marketplace** (no paid programs, no subscriptions)
❌ **Not a replacement for trainers** (supplement, not substitute)

## Open for Future Exploration

What we're **keeping open** as possibilities:

✨ **AI-generated workouts** - Conversational agents that ask questions and prescribe personalized workout combinations
✨ **Workout customization** - User-created routines from exercise database
✨ **Advanced analytics** - ML-powered insights and recommendations

## Project Values

1. **User-Centered**: Every decision backed by research or user feedback
2. **Simplicity**: Solve the core problem well, don't add unnecessary features
3. **Quality**: Professional polish, attention to detail
4. **Accessibility**: Works for everyone, regardless of fitness level
5. **Open**: Code is public, learnings are shared

## Evolution Path

### V0 → V1 (Completed)
- Migrated from static Jekyll site to Onsen UI mobile app
- Added progress tracking (timeline + checkboxes)
- Implemented expandable exercise rows
- Added share functionality
- Improved visual hierarchy and mobile UX

### V1 → V1.x (Current Focus)
- Polish user-requested features (celebrations, weight tracking)
- Improve data safety (export/backup)
- Connect custom domain
- Enhance exercise descriptions

### V1.x → V2 (Future)
- Evaluate modern architecture (React/Vue/Svelte?)
- Consider backend for sync (Firebase/Supabase?)
- Add workout builder
- Implement analytics

## Personal Goals

As the developer:

1. **Showcase Growth**: Demonstrate evolution from first project to professional quality
2. **Learn Modern Practices**: Experiment with new technologies and patterns
3. **Build Portfolio**: Create a compelling case study for interviews/discussions
4. **Help Others**: Provide a genuinely useful tool for fitness enthusiasts
5. **Practice Discipline**: Apply Amazon engineering standards to personal projects

## Measuring Success

This project is successful if:

✅ **I use it regularly** for my own workouts
✅ **Others find it useful** and provide positive feedback
✅ **Code quality is high** (would pass Amazon code review)
✅ **Design is validated** (backed by research, not assumptions)
✅ **I learn something** from building it

---

## Key Takeaway

This project is about **solving a real problem** (workout cognitive load) with **research-validated solutions** (visual demos, progress tracking, minimal interaction) while **maintaining simplicity** and **professional quality**. It's a showcase of user-centered design, clean code, and thoughtful engineering.

**Remember**: Every feature should answer "Does this reduce cognitive load during workouts?" If not, it doesn't belong.


---

## Detailed: Exercise Onboarding Strategy

### Current State (V1.0)
**What exists**:
- Home tab with text explanation
- Navigation tabs (Home, Start, Programs, Glossary)
- Link to V0 (classic version)

**What's missing**:
- No first-time user tutorial
- No feature discovery flow
- No interactive walkthrough
- No tooltips or hints
- No "What's New" for returning users

**User Feedback**:
- "Confusion points: Homepage navigation, visual inconsistency noted" (Think-aloud testing)
- "First-time use: No onboarding or tutorial" (Usability testing)
- "Glossary access: Not discoverable enough" (Evaluation feedback)

### Proposed Improvements (V1.x)

#### Option 1: Lightweight Tooltip Tour (User Onboarding)
**Approach**: Show contextual tooltips on first visit
- "Tap here to browse workouts by category" (Start tab)
- "Check off exercises as you complete them" (Checkbox)
- "Track your progress with the timeline" (Timeline dots)
- "Tap to expand and see exercise details" (Exercise row)

**Pros**: Minimal development, non-intrusive, skippable
**Cons**: Easy to dismiss, might be ignored

#### Option 2: Interactive Walkthrough (User Onboarding)
**Approach**: Guided tour with sample workout
- Step 1: "Welcome! Let's take a quick tour"
- Step 2: "Choose a workout from Start or Programs"
- Step 3: "Tap an exercise to see the demonstration"
- Step 4: "Check it off when you're done"
- Step 5: "Watch your progress on the timeline"

**Pros**: Hands-on learning, memorable, comprehensive
**Cons**: More development, could feel forced

#### Option 3: Video Tutorial (User Onboarding)
**Approach**: Short 30-second video on Home tab
- Shows key features in action
- Skippable, rewatchable
- Hosted on YouTube or as GIF

**Pros**: Visual, engaging, easy to understand
**Cons**: Requires video production, file size

#### Recommended Approach: Hybrid (User Onboarding)
1. **First Visit**: Lightweight tooltip tour (Option 1)
2. **Home Tab**: Add "How to Use" section with key features
3. **Help Icon**: Add "?" icon in toolbar → opens quick guide
4. **Sample Workout**: Add "Try a Sample Workout" on Home tab

---

#### Exercise Content Onboarding Improvements

**Current Pain Points**:
- Manual shell script editing for each exercise
- No batch processing capability
- Manual file movement and JSON editing
- GIFs bloat git repository (~50MB)
- Requires technical setup (Python, ffmpeg, API keys)

**Proposed Improvements**:

**Phase 1: Cloudinary Migration** (This Feature)
- Move GIFs to Cloudinary CDN
- Reduces repo size by ~50MB
- Enables future improvements

**Phase 2: CLI Tool** (Near-term)
```bash
# Interactive CLI
npm run add-exercise

# Prompts:
# - YouTube URL?
# - Start time (seconds)?
# - End time (seconds)?
# - Aspect ratio? (default: 3:4)
# - Exercise name? (AI-suggested, editable)
# - Reps? Sets? Notes?

# Outputs:
# - Uploads GIF to Cloudinary
# - Updates workouts.json
# - Creates git commit
```

**Phase 3: Web Admin UI** (Medium-term)
- Browser-based exercise management
- Preview GIF before saving
- Drag-and-drop video upload
- Batch import from YouTube playlist
- Visual JSON editor
- One-click publish

**Phase 4: Full CMS** (Long-term)
- Multi-user access control
- Approval workflows
- Version history
- Exercise library management
- Analytics (which exercises are popular)
- Integration with workout builder

### Implementation Plan

**Phase 1: Quick Wins (User Onboarding)** (1-2 days)
- Add "How to Use" section on Home tab
- Improve feature descriptions
- Add help icon in toolbar

**Phase 2: Tooltip Tour (User Onboarding)** (3-5 days)
- Detect first visit (localStorage flag)
- Show contextual tooltips
- Allow skip/dismiss
- Mark as completed

**Phase 3: Sample Workout (User Onboarding)** (5-7 days)
- Create short 3-exercise sample
- Pre-populate with beginner-friendly exercises
- Guide user through full flow
- Celebrate completion

**Phase 4: Exercise Content Onboarding CLI** (After Cloudinary Migration)
- Create interactive CLI tool
- Integrate with Cloudinary upload
- Auto-update workouts.json
- Generate git commits

---

## Detailed: Workout Storage Strategy

### Current State (V1.0)

#### What's Stored Now
**localStorage** (client-side only):
```javascript
{
  "workout_progress": {
    "agility_lower_1-1": {
      "0": true,  // Exercise 0 completed
      "2": true,  // Exercise 2 completed
      "currentExercise": 3
    }
  }
}
```

**Static JSON Files** (read-only):
- `workouts.json`: 10+ programs, 100+ exercises
- `plans.json`: Category organization
- `glossary.json`: Exercise definitions

#### What's NOT Stored
- ❌ Weight used per exercise
- ❌ Workout history (past sessions)
- ❌ Custom user-created workouts
- ❌ Exercise notes or modifications
- ❌ Rest times or tempo
- ❌ Personal records (PRs)
- ❌ Workout duration
- ❌ Timestamps (when completed)

### Known Issues & Risks

1. **Data Loss Risk**
   - Browser cache cleared → all progress lost
   - New device → start from scratch
   - No backup or recovery

2. **No Multi-Device Support**
   - Can't sync between phone and tablet
   - Can't access from different browsers
   - No cloud backup

3. **Limited Analytics**
   - Can't track progress over time
   - Can't identify trends
   - Can't see workout frequency

4. **No Progressive Overload Tracking**
   - Bodybuilder request: "remember what your last weight was"
   - Can't track strength gains
   - Manual tracking required (paper/notes)

### Proposed Improvements (V1.x → V2)

#### Phase 1: Enhanced localStorage (V1.x)
**Goal**: Improve local storage without backend

**Features**:
1. **Weight Tracking**
   ```javascript
   {
     "workout_history": [
       {
         "programId": "agility_lower_1-1",
         "date": "2025-01-15T10:30:00Z",
         "exercises": [
           {
             "name": "Barbell Squat",
             "sets": [
               { "reps": 10, "weight": 135 },
               { "reps": 10, "weight": 135 },
               { "reps": 8, "weight": 145 }
             ]
           }
         ],
         "duration": 3600  // seconds
       }
     ]
   }
   ```

2. **Export/Import**
   - Export to JSON file
   - Import from JSON file
   - Backup to device storage

3. **Workout History**
   - Store last 30 days of workouts
   - Show "Last time: 135 lbs" when viewing exercise
   - Display workout frequency

**Pros**: No backend needed, works offline, privacy-friendly
**Cons**: Still device-specific, no sync, storage limits

#### Phase 2: Cloud Sync (V2)
**Goal**: Multi-device support with optional accounts

**Architecture Options**:

**Option A: Firebase**
- Firestore for data storage
- Firebase Auth for accounts (optional)
- Real-time sync across devices
- Free tier: 1GB storage, 50K reads/day

**Option B: Supabase**
- PostgreSQL database
- Row-level security
- Real-time subscriptions
- Free tier: 500MB storage, unlimited API requests

**Option C: AWS (Your Expertise)**
- DynamoDB for data storage
- Cognito for authentication
- S3 for backups
- Lambda for API
- Leverage your Amazon experience

**Recommended**: Start with Supabase (easier), migrate to AWS later if needed

**Data Model** (Cloud):
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP
)

-- Workout sessions table
workout_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  program_id TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration INTEGER
)

-- Exercise logs table
exercise_logs (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES workout_sessions(id),
  exercise_name TEXT,
  set_number INTEGER,
  reps INTEGER,
  weight DECIMAL,
  rpe INTEGER,
  notes TEXT
)

-- Custom workouts table
custom_workouts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  exercises JSONB,
  created_at TIMESTAMP
)
```

#### Phase 3: AI-Powered Features (V2+)
**Goal**: Intelligent workout generation and recommendations

**Features**:
1. **Conversational Workout Builder**
   - "What equipment do you have?"
   - "What muscle groups do you want to work?"
   - "How much time do you have?"
   - → Generates personalized workout

2. **Smart Recommendations**
   - "Based on your history, try this next"
   - "You haven't worked legs in 5 days"
   - "Your squat weight has plateaued, try this variation"

3. **Progressive Overload Suggestions**
   - "Last time: 135 lbs × 10. Try 140 lbs × 8 today"
   - Auto-calculate progressive overload
   - Deload week recommendations

**Implementation**:
- Use OpenAI API or Claude API
- Prompt engineering for workout generation
- RAG (Retrieval Augmented Generation) with exercise database
- Store conversation history for context

### Migration Path

**V1.0 → V1.1** (Current → Next)
- Add weight tracking to localStorage
- Add export/import functionality
- Add workout history (last 30 days)

**V1.1 → V1.5** (Near-term)
- Add onboarding flow
- Improve data structure
- Add analytics dashboard

**V1.5 → V2.0** (Long-term)
- Add backend (Supabase or AWS)
- Add optional user accounts
- Add cloud sync
- Migrate localStorage data to cloud

**V2.0 → V2.5** (Future)
- Add AI workout generation
- Add smart recommendations
- Add social features (optional)

### Storage Comparison

| Feature | V1.0 (Current) | V1.x (Enhanced) | V2.0 (Cloud) |
|---------|----------------|-----------------|--------------|
| Progress tracking | ✅ localStorage | ✅ localStorage | ✅ Cloud DB |
| Weight tracking | ❌ | ✅ localStorage | ✅ Cloud DB |
| Workout history | ❌ | ✅ 30 days local | ✅ Unlimited |
| Multi-device sync | ❌ | ❌ | ✅ Real-time |
| Export/Import | ❌ | ✅ JSON files | ✅ Automatic |
| Custom workouts | ❌ | ✅ localStorage | ✅ Cloud DB |
| AI generation | ❌ | ❌ | ✅ API-powered |
| Analytics | ❌ | ✅ Basic | ✅ Advanced |
| Backup | ❌ | ✅ Manual | ✅ Automatic |

---

## Key Takeaway

**Onboarding**: Currently non-existent, needs lightweight tooltip tour + help section as quick win, then interactive walkthrough later.

**Storage**: Currently localStorage-only with data loss risk. Near-term: enhance localStorage with weight tracking and export. Long-term: add cloud sync with optional accounts. Future: AI-powered workout generation.

**Remember**: Start simple (localStorage enhancements), validate with users, then invest in backend infrastructure only when multi-device sync becomes critical.
