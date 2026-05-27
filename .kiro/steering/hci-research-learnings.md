---
inclusion: auto
---

# HCI Research Learnings: User-Centered Design Principles

## Overview

This document captures the comprehensive user research conducted for the Action App (V1) through an HCI (Human-Computer Interactions) class project. All design decisions should be validated against these research-backed insights.

**Research Methods Used**:
- General Exercise Presentation Efficacy Survey (24 participants)
- Wizard of Oz Study (4 participants, 2 pairs)
- Heuristic Evaluation (Nielsen's principles, Norman's design principles)
- Comparative Design Evaluation (20 participants)
- Think-Aloud Usability Testing (3 participants)

---

## Critical Research Findings

### Finding #1: Visual Instruction Superiority

**Evidence**: Wizard of Oz study definitively demonstrated visual demonstrations significantly outperform verbal and written instructions.

**Quantitative Data**:
- Visual demos: 4.5/5 confidence, 4.5/5 form accuracy
- Written instructions: 3.5/5 confidence, 3.5/5 form accuracy
- Verbal instructions: 3/5 confidence, 3/5 form accuracy
- Survey: 58.3% prefer video demonstrations for learning exercises

**User Quotes**:
- "The visuals of what the exercise is is so important and made it way easier"
- "The video is literally bigger" (praising Design 3)

**Design Implications**:
✅ **DO**:
- Make GIF demonstrations the PRIMARY instruction method
- Display visuals prominently (large, clear, centered)
- Ensure videos are immediately visible when exercise is expanded
- Use high-quality, clear demonstration GIFs
- Show full range of motion in demonstrations

❌ **DON'T**:
- Hide videos behind modals or extra clicks
- Make text the primary instruction method
- Use small, thumbnail-sized demonstrations
- Rely on verbal or written instructions alone
- Make users search for the demonstration

**Implementation**: Current V1 uses expandable rows with large GIF displays. Maintain this pattern.

---

### Finding #2: Progress Tracking Necessity

**Evidence**: Heuristic evaluation revealed critical violation of Norman's discoverability principle—absence of visual indicators for completed exercises creates significant cognitive burden.

**Quantitative Data**:
- 58.3% of participants rely solely on memory for workout tracking
- 75% rated exercise completion checkmarks as most appreciated feature
- 60% valued progress tracking features

**User Quotes**:
- "I really like the progress bar at the top. It was like a really clear visual reference for where I was in the workout"
- "I like the feedback I get from collapsing the row, it makes me feel like I've made progress"
- "It's cool that I can like check off the boxes easily to remember what I've done and what I have left to do"

**Design Implications**:

✅ **DO**:
- Provide clear visual indicators for completed exercises (checkmarks)
- Show overall progress (timeline with dots)
- Make completion state persistent (localStorage)
- Update progress indicators in real-time
- Provide multiple views of progress (timeline + checkboxes)
- Make progress visible without scrolling

❌ **DON'T**:
- Rely on user memory for tracking
- Hide progress indicators
- Make users manually track completion
- Lose progress on page refresh
- Require extra clicks to see progress

**Implementation**: Current V1 has timeline + checkboxes. Consider adding:
- Green checkmarks (user requested: "give me that extra bit of dopamine")
- Completion celebration animation
- Progress percentage display

---

### Finding #3: Minimal Interaction During Workouts

**Evidence**: Survey identified strong user preference for limited device interaction during exercise.

**Quantitative Data**:
- 54.2% prioritize minimal phone use during workouts
- Distractions reported: checking instructions (8 mentions), social media (13 mentions), music (9 mentions)
- Design 2's modal approach received consistently negative feedback due to interaction friction

**User Quotes**:
- "I don't like the entire workout to take up the whole screen on my phone. It's more clicks to get through the entire session"
- "I'm not a fan of modals because it typically takes more clicks to navigate around"
- "The process of sharing was really easy because it literally took me two taps"

**Design Implications**:

✅ **DO**:
- Minimize required taps/clicks
- Keep essential information visible
- Use expandable rows (not modals)
- Make actions one-tap when possible
- Persist state to avoid re-entry
- Design for "glanceable" information

❌ **DON'T**:
- Use modals that require multiple taps
- Hide critical information behind interactions
- Require navigation away from workout view
- Force users to re-enter data
- Create multi-step workflows for simple actions

**Implementation**: Current V1 uses expandable rows (good). Avoid introducing modals or multi-step flows.

---

### Finding #4: Balance Overview vs. Focus

**Evidence**: Comparative design evaluation showed users want both comprehensive workout overview AND focused exercise detail.

**Quantitative Data**:
- Design 1 (Expandable Rows): 45% preference - "see all exercises"
- Design 3 (Sequential): 40% preference - "focus on one exercise"
- Design 2 (Modal): 15% preference - rejected for hiding information

**User Quotes**:
- "I can see all the other workouts at all times" (Design 1 supporter)
- "I like to see the whole list so I can be flexible switching around exercise order" (Design 1)
- "Focuses on one workout at a time so it doesn't get too confusing or overwhelming" (Design 3)
- "Design 3 would be better for at home workouts to keep you on task and in sequence, while type 2 is a bit better for a commercial gym setting"

**Design Implications**:

✅ **DO**:
- Show full workout list (overview)
- Allow expansion for detailed view (focus)
- Maintain context when viewing details
- Support flexible exercise ordering
- Provide timeline for spatial awareness
- Allow quick navigation between exercises

❌ **DON'T**:
- Force sequential-only navigation
- Hide the workout list when viewing details
- Prevent users from reordering exercises
- Remove context when focusing on one exercise

**Implementation**: Current V1 combines both approaches—expandable rows (overview) + timeline (focus). This is optimal.

---

### Finding #5: Context-Dependent Usage Patterns

**Evidence**: Users exercise in different contexts with different needs.

**User Insights**:
- **Home workouts**: Need more guidance, prefer sequential structure
- **Commercial gym**: Need flexibility due to equipment availability
- **Novice users**: Need detailed instructions, form tips, terminology help
- **Expert users**: Want minimal text, quick reference, flexible ordering

**Design Implications**:

✅ **DO**:
- Support both guided and flexible workflows
- Provide detailed information but hide it by default
- Allow exercise reordering
- Include glossary for terminology
- Offer form tips in notes section
- Design for interruptions (equipment wait times)

❌ **DON'T**:
- Force a single workflow
- Assume all users are experts (or novices)
- Remove flexibility for simplicity
- Hide critical information from novices

**Implementation**: Current V1 supports both contexts. Future: Consider "guided mode" toggle.

---

## Heuristic Evaluation Insights

### Discoverability (Norman, 2013)

**Strengths Identified**:
- Clear navigation bars
- Expandable arrows indicate interactivity
- Sequential workout presentation

**Violations Identified**:
- V0 lacked progress indicators (fixed in V1)
- Exercise completion state was not visible

**Design Principles**:
- All actions must have clear visual indicators
- Interactive elements must look interactive
- Progress must always be visible
- No hidden features

---

### Simplicity (Nielsen's Heuristics)

**Strengths Identified**:
- Critical information (reps, sets) prominently displayed
- Visual demonstrations reduce cognitive load
- Clean, uncluttered interface

**Violations Identified**:
- Specialized terminology lacks immediate explanation
- Glossary requires navigation away from workout

**Design Principles**:
- Present only essential information during workouts
- Use large fonts for values, small fonts for labels
- Hide complexity until needed (expandable rows)
- Provide tooltips for specialized terms (e.g., RPE)

**Implementation**: Current V1 has RPE tooltips. Consider adding more inline help.

---

### Flexibility & Efficiency (Universal Design)

**Strengths Identified**:
- Font size differentiation (large values, small labels)
- Expandable rows serve both novice and expert users

**Gaps Identified**:
- No customizable shortcuts
- No preset options for frequent users
- No workout templates

**Design Principles**:
- Serve both novice and expert users
- Provide shortcuts for power users
- Allow customization without overwhelming novices
- Support different skill levels

**Future Considerations**: Workout templates, custom routines, saved preferences.

---

## User-Requested Features

### High Priority (Directly Requested in Evaluation)

1. **Completion Celebration Animation**
   - Quote: "I want to see when I complete all the exercises an animation should happen to celebrate"
   - Implementation: Trigger on final exercise completion
   - Suggested: Confetti, success message, encouraging text

2. **Green Checkmarks**
   - Quote: "give me that extra bit of dopamine"
   - Implementation: Change checkbox color to green when completed
   - Psychological benefit: Positive reinforcement

3. **Weight Tracking**
   - Quote: "help remember what your last weight was for a certain exercise"
   - Context: Bodybuilder participant, references "3x5 notepads"
   - Implementation: Store weight history per exercise in localStorage
   - Display: "Last time: 135 lbs" when viewing exercise

4. **Enhanced Exercise Descriptions**
   - Need: Novice users want more detailed form tips
   - Implementation: Expand notes section with:
     - Common mistakes
     - Form cues
     - Muscle groups targeted
     - Difficulty level

### Medium Priority (Implied Needs)

5. **Workout Templates**
   - Evidence: Users want to save and reuse routines
   - Implementation: Save custom workout combinations

6. **Exercise Search**
   - Evidence: Planning.txt mentions this
   - Implementation: Search/filter in Programs and Start tabs

7. **Better Glossary Integration**
   - Evidence: Heuristic evaluation identified navigation friction
   - Implementation: Inline tooltips, quick reference

### Low Priority (Nice to Have)

8. **Rest Timer**
   - Survey: Some users mentioned this
   - Implementation: Optional countdown between sets

9. **Workout History**
   - Evidence: Weight tracking implies history
   - Implementation: View past workout sessions

10. **Social Features**
    - Evidence: Low current sharing usage but high potential
    - Implementation: Improve sharing UX, add "Try this workout" landing page

---

## Design Patterns That Work

### ✅ Validated Patterns (Keep These)

1. **Expandable Rows**
   - Provides overview + detail
   - Minimal interaction
   - Clear visual feedback
   - 45% preference in evaluation

2. **Timeline Progress Indicator**
   - Spatial awareness of workout progress
   - Clickable for navigation
   - Adaptive layouts (1, 2, or 4+ exercises)
   - Universally praised in testing

3. **Checkbox Completion**
   - Simple, familiar interaction
   - Clear visual state
   - Persistent across sessions
   - 75% rated as most appreciated feature

4. **Large GIF Demonstrations**
   - Primary instruction method
   - Reduces cognitive load
   - Improves confidence and form
   - 4.5/5 effectiveness rating

5. **Inline Notes with Tooltips**
   - Provides context without clutter
   - RPE tooltip well-received
   - Helps novice users

6. **Share Button (Floating)**
   - Visible but not intrusive
   - Two-tap sharing
   - Web Share API + clipboard fallback
   - "Super easy" feedback

### ❌ Rejected Patterns (Avoid These)

1. **Modal Overlays**
   - Creates interaction friction
   - Hides context
   - Requires extra taps
   - 15% preference (lowest)
   - Quote: "I don't love pop up because it feels very separated"

2. **Sequential-Only Navigation**
   - Too restrictive for gym context
   - Doesn't support equipment availability
   - Limits user flexibility
   - Works only for home workouts

3. **Hidden Video Demonstrations**
   - Increases cognitive load
   - Requires extra interaction
   - Contradicts research findings
   - Users want videos visible by default

4. **Text-Primary Instructions**
   - Lower confidence (3/5 vs 4.5/5)
   - Worse form accuracy
   - Higher cognitive effort
   - Rejected in Wizard of Oz study

---

## Cognitive Load Principles

### Sources of Cognitive Load During Workouts

1. **Remembering exercise details** (sets, reps, weight)
2. **Maintaining proper form**
3. **Tracking progress through workout**
4. **Managing equipment availability**
5. **Dealing with distractions** (phone notifications, social media)

### How Interface Reduces Cognitive Load

1. **Externalize Memory**
   - Store workout details in interface
   - Track completion automatically
   - Show progress visually
   - Remember weights used

2. **Visual Demonstrations**
   - Reduce need to remember form
   - Provide immediate reference
   - Lower mental effort (2/5 vs 4/5 for verbal)

3. **Minimal Interaction**
   - One-tap actions
   - Persistent state
   - No re-entry of data
   - Glanceable information

4. **Clear Visual Hierarchy**
   - Large fonts for important values
   - Small fonts for labels
   - Color coding for state
   - Spatial organization (timeline)

---

## User Personas (Derived from Research)

### Persona 1: The Returning Gym-Goer
- **Frequency**: 4-6 times/week
- **Experience**: Intermediate
- **Needs**: Structure, progress tracking, flexibility
- **Pain Points**: Remembering details, equipment availability
- **Quote**: "I like to see the whole list so I can be flexible switching around exercise order"

### Persona 2: The Novice Exerciser
- **Frequency**: 2-3 times/week
- **Experience**: Beginner
- **Needs**: Visual guidance, form tips, terminology help
- **Pain Points**: Proper form, understanding exercises, confidence
- **Quote**: "The visuals of what the exercise is is so important and made it way easier"

### Persona 3: The Bodybuilder/Power User
- **Frequency**: 5-7 times/week
- **Experience**: Advanced
- **Needs**: Weight tracking, history, minimal UI
- **Pain Points**: Tracking progressive overload, remembering previous weights
- **Quote**: "help remember what your last weight was for a certain exercise"

### Persona 4: The Home Workout Enthusiast
- **Frequency**: 3-4 times/week
- **Experience**: Intermediate
- **Needs**: Guided structure, motivation, completion feedback
- **Pain Points**: Staying on task, motivation
- **Quote**: "Design 3 would be better for at home workouts to keep you on task and in sequence"

---

## Usability Testing Insights

### Think-Aloud Session Findings

**What Users Praised**:
1. Timeline feature: "really clear visual reference"
2. Easy scanning: "able to really easily scan through the list"
3. Flexible viewing: "I like that I can choose when I want to see the demos"
4. Checkbox feedback: "check off the boxes easily to remember"
5. Share simplicity: "literally took me two taps"

**What Users Requested**:
1. Completion animation: "animation should happen to celebrate"
2. Green checkmarks: "extra bit of dopamine"
3. Weight tracking: "remember what your last weight was"
4. Detailed descriptions: More form tips and context
5. Center selected exercise: Better visibility when expanded

**Confusion Points**:
1. Homepage navigation: Visual inconsistency noted
2. First-time use: No onboarding or tutorial
3. Glossary access: Not discoverable enough

---

## Design Decision Framework

When evaluating new features or changes, ask:

### 1. Does it reduce cognitive load during workouts?
- If yes: Strong candidate
- If no: Reconsider necessity

### 2. Does it require additional interactions?
- Minimize taps/clicks
- Avoid modals
- Keep actions simple

### 3. Does it serve both novice and expert users?
- Provide detail but hide by default
- Support multiple workflows
- Don't force one approach

### 4. Is it backed by research or user feedback?
- Prioritize validated needs
- Test assumptions
- Gather feedback early

### 5. Does it maintain visual clarity?
- Avoid clutter
- Use clear hierarchy
- Maintain consistency

---

## Metrics for Success

### User Experience Metrics
- **Cognitive Load**: Users report low mental effort (target: ≤2/5)
- **Confidence**: Users feel confident in execution (target: ≥4.5/5)
- **Form Accuracy**: Proper exercise execution (target: ≥4.5/5)
- **Satisfaction**: Users prefer this over alternatives (target: ≥90%)

### Behavioral Metrics
- **Completion Rate**: % of started workouts finished (target: ≥80%)
- **Return Rate**: Users come back regularly (target: ≥3x/week)
- **Sharing Rate**: Workouts shared with others (target: ≥10%)
- **Time on Task**: Minimal phone interaction (target: <30 sec/exercise)

### Feature Adoption
- **Progress Tracking**: % using checkboxes (target: ≥90%)
- **Visual Demos**: % expanding exercises (target: ≥70%)
- **Timeline**: % clicking timeline dots (target: ≥50%)
- **Share**: % using share feature (target: ≥20%)

---

## Research-Backed Design Principles

### 1. Visual-First Communication
**Principle**: Visual demonstrations are the most effective instruction method.
**Evidence**: Wizard of Oz study, 58.3% survey preference
**Application**: Make GIFs primary, text secondary

### 2. Externalize Memory
**Principle**: Don't make users remember what the computer can remember.
**Evidence**: 58.3% rely on memory alone (pain point)
**Application**: Track progress, store weights, persist state

### 3. Minimize Interaction Friction
**Principle**: Every extra tap is a barrier.
**Evidence**: Modal design rejected (15% preference)
**Application**: One-tap actions, no modals, expandable rows

### 4. Provide Multiple Views
**Principle**: Users need both overview and detail.
**Evidence**: 45% want overview, 40% want focus
**Application**: Expandable rows + timeline

### 5. Support Context Flexibility
**Principle**: Users exercise in different contexts with different needs.
**Evidence**: Home vs. gym, novice vs. expert
**Application**: Flexible ordering, detailed notes, multiple workflows

### 6. Celebrate Progress
**Principle**: Positive reinforcement increases motivation.
**Evidence**: User requests for celebrations, dopamine hits
**Application**: Animations, green checkmarks, encouraging messages

---

## References

### Research Methods
- Norman, D. A. (2013). *The design of everyday things*. MIT Press.
- Nielsen, J., & Molich, R. (1990). Heuristic evaluation of user interfaces.
- Constantine & Lockwood: Visibility Principle
- Ronald Mace: Universal Design Principles

### Study Participants
- Survey: 24 participants (diverse exercise frequencies)
- Wizard of Oz: 4 participants (2 pairs)
- Comparative Evaluation: 20 participants
- Think-Aloud: 3 participants (casual, regular, bodybuilder)

### Data Sources
- General Exercise Presentation Efficacy Survey
- Exercise Communication Assessment (Wizard of Oz)
- Comparative Design Evaluation Survey
- Think-Aloud Usability Testing Sessions
- Heuristic Evaluation of V0 interface

---

## Key Takeaways for Development

### When Adding Features
1. ✅ Validate against user research
2. ✅ Test with real users early
3. ✅ Measure cognitive load impact
4. ✅ Ensure it works for multiple personas
5. ✅ Keep interactions minimal

### When Making Design Decisions
1. ✅ Prioritize visual over text
2. ✅ Show progress clearly
3. ✅ Minimize required taps
4. ✅ Support flexibility
5. ✅ Provide context without clutter

### When Evaluating Success
1. ✅ Does it reduce cognitive load?
2. ✅ Do users prefer it?
3. ✅ Does it improve confidence?
4. ✅ Is it used regularly?
5. ✅ Does it support the core goal?

---

**Remember**: Every design decision should answer: "Does this help users focus on their workout instead of their phone?"

If the answer is no, reconsider the feature.
