# Program Interface Documentation (program.html)

## Overview

The `program.html` file implements a sophisticated individual workout program interface featuring timeline-based progress tracking, expandable exercise details, persistent state management, and adaptive UI layouts. This component serves as the detailed view for specific workout programs selected from the main application.

## Architecture Overview

### Core Components
1. **Timeline Progress System** - Visual workout progression tracking
2. **Expandable Exercise Interface** - Detailed exercise demonstrations
3. **Progress Persistence** - localStorage-based state management
4. **Adaptive Layouts** - Responsive design for varying exercise counts
5. **Smart Navigation** - Context-aware back button behavior

## Color System & Design Language

### CSS Custom Properties
```css
:root {
  /* Primary Brand Colors */
  --primary-blue: #4586F1;
  --primary-dark-blue: #093175;
  --primary-light-blue: #65A9ED;
  --primary-very-light-blue: #C5DDFA;

  /* Semantic Colors */
  --text-primary: var(--primary-dark-blue);
  --text-secondary: var(--accent-dark);
  --text-light: var(--accent-white);

  /* Background Colors */
  --bg-primary: var(--accent-white);
  --bg-secondary: var(--accent-light-gray);
  --bg-brand: var(--primary-blue);
}
```

This system ensures visual consistency with the main application while providing program-specific theming.

## Header & Navigation System

### Toolbar Configuration
```html
<ons-toolbar>
  <div class="left" style="display: flex; align-items: center; padding-left: 8px;">
    <ons-button modifier="quiet" onclick="goBack()" style="
      color: rgba(255,255,255,0.9);
      font-size: 1.8em;
      padding: 12px 16px;
    ">‹</ons-button>
  </div>
  <div class="center" id="program-title">Program Details</div>
</ons-toolbar>
```

### Smart Back Navigation
The back button implements context-aware navigation based on the source tab:

```javascript
function goBack() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromTab = urlParams.get('from');
  const referrer = document.referrer;
  const isFromMainApp = referrer.includes('index.html') || referrer.includes('start.html');

  if (window.history.length > 1 && isFromMainApp) {
    window.history.back(); // Use browser history when available
  } else {
    // Direct navigation with sessionStorage for proper tab selection
    if (fromTab === 'start') {
      window.location.href = 'start.html'; // Return to separate start page
    } else if (fromTab === 'programs') {
      sessionStorage.setItem('targetTab', 'programs');
      window.location.href = 'index.html'; // Return to main app Programs tab
    } else {
      window.location.href = 'index.html'; // Default fallback
    }
  }
}
```

**Navigation Logic**:
- **Browser History Available**: Use native back navigation
- **Direct Access**: Route to appropriate tab using sessionStorage
- **Source Tracking**: Maintain context from originating tab

## Progress Tracking System

### Overall Progress Indicator
```html
<div class="progress-indicator">
  <div class="progress-indicator-inner">
    <div id="progress-bar" class="progress-bar" style="width: 0%;"></div>
  </div>
</div>
```

**Features**:
- **Visual progress bar** with animated filling
- **Shimmer effect** for visual appeal
- **Sticky positioning** for constant visibility

```css
.progress-bar::after {
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## Timeline System Deep Dive

### Adaptive Timeline Layouts

The timeline system automatically adapts based on the number of exercises in a program:

#### Standard Timeline (3+ exercises)
```css
.timeline::before {
  content: "";
  position: absolute;
  height: 4px;
  background: var(--accent-gray);
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
```

#### Single Exercise Layout
```css
.timeline.single-exercise {
  justify-content: center;
}
.timeline.single-exercise::before {
  display: none; /* Hide connecting line */
}
```

**Features for Single Exercise**:
- Centered single dot
- No connecting line
- Timeline completely hidden for cleaner interface

#### Two Exercise Layout
```css
.timeline.two-exercises {
  justify-content: center;
  gap: 100px;
}
.timeline.two-exercises::before {
  width: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
```

### Timeline Dot States

#### Interactive Timeline Dots
```javascript
program.exercises.forEach((ex, index) => {
  const dot = document.createElement('div');
  dot.className = 'timeline-dot';
  dot.onclick = function() {
    const exerciseElement = document.querySelector(`.exercise-item[data-index="${index}"]`);
    if (exerciseElement) {
      toggleExercise(exerciseElement);
    }
  };
});
```

#### Visual States
```css
.timeline-dot {
  width: 18px; height: 18px;
  background: var(--bg-primary);
  border: 2px solid var(--accent-gray);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.timeline-dot.active {
  width: 22px; height: 22px;
  background: var(--primary-blue);
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(69, 134, 241, 0.3);
}

.timeline-dot.completed {
  background: var(--primary-dark-blue);
  border-color: var(--primary-dark-blue);
}

.timeline-dot.completed::after {
  content: "✔";
  color: var(--text-light);
  font-size: 9px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

**State Management**:
- **Default**: Gray border, white background
- **Active**: Blue background, larger size, glow effect
- **Completed**: Dark blue background with checkmark
- **Interactive**: Hover effects and click handlers

### Timeline Initialization Logic

```javascript
// Apply adaptive timeline classes based on exercise count
timelineContainer.classList.remove('single-exercise', 'two-exercises', 'few-exercises');

if (exerciseCount === 1) {
  timelineContainerWrapper.style.display = 'none'; // Hide completely
} else {
  timelineContainerWrapper.style.display = 'block';

  if (exerciseCount === 2) {
    timelineContainer.classList.add('two-exercises');
  } else if (exerciseCount <= 4) {
    timelineContainer.classList.add('few-exercises');
  }
}
```

## Exercise Interface System

### Program Header Information
```html
<div style="padding: 15px;">
  <div style="display: flex; align-items: center; margin-bottom: 10px;">
    <div class="share-button" style="/* Share button styles */">
      <svg><!-- Share icon --></svg>
    </div>
    <h1 id="program-name" style="/* Title styles */"></h1>
  </div>
  <div id="program-requirements" style="/* Requirements styles */"></div>
</div>
```

### Expandable Exercise Items

#### Exercise Structure
```javascript
// Create exercise item container
const exerciseItem = document.createElement('div');
exerciseItem.className = 'exercise-item';
exerciseItem.setAttribute('data-index', index);

// Exercise header with toggle functionality
const exerciseHeader = document.createElement('div');
exerciseHeader.className = 'exercise-header';
exerciseHeader.onclick = function() { toggleExercise(this.parentNode); };
```

#### Toggle Mechanism with Auto-Scroll
```javascript
function toggleExercise(element) {
  const index = parseInt(element.getAttribute('data-index'));
  const content = element.querySelector('.exercise-content');
  const chevron = element.querySelector('.chevron');

  content.classList.toggle('active');
  chevron.classList.toggle('up');
  chevron.classList.toggle('down');

  // Auto-scroll for better UX
  if (content.classList.contains('active')) {
    setTimeout(() => {
      const progressIndicator = document.querySelector('.progress-indicator');
      const progressHeight = progressIndicator ? progressIndicator.offsetHeight : 0;
      const toolbarHeight = document.querySelector('.toolbar').offsetHeight;
      const targetScrollPosition = element.offsetTop - (toolbarHeight + progressHeight + 5);

      window.scrollTo({
        top: Math.max(0, targetScrollPosition),
        behavior: 'smooth'
      });
    }, 100);
  }
}
```

**Auto-scroll Features**:
- **Precise positioning**: Aligns exercise header with bottom of progress bar
- **Smooth animation**: Uses CSS smooth scrolling
- **Viewport awareness**: Prevents scrolling beyond viewport limits

### Exercise Content Details

#### Exercise Metrics Display
```javascript
// Create exercise details
const exerciseDetails = document.createElement('div');
exerciseDetails.className = 'exercise-details';

// Reps metric
const repsMetric = document.createElement('div');
repsMetric.innerHTML = `
  <p class="metric-value">${exercise.reps}</p>
  <p class="metric-label">${exercise.repUnits || 'reps'}</p>
`;

// Sets metric
const setsMetric = document.createElement('div');
setsMetric.innerHTML = `
  <p class="metric-value">${exercise.sets}</p>
  <p class="metric-label">sets</p>
`;
```

#### Exercise Media Integration
```javascript
// Create exercise GIF
const exerciseGif = document.createElement('img');
exerciseGif.className = 'exercise-gif';
exerciseGif.src = "../" + exercise.gif;
exerciseGif.alt = exercise.name;
```

#### Note System with RPE Detection
```javascript
// Enhanced note processing
if (exercise.note && exercise.note.includes("Rate of Perceived Exertion")) {
  const noteParts = exercise.note.split("Rate of Perceived Exertion:");
  exerciseNotes.innerHTML = "Note: Rate of Perceived Exertion:" + noteParts[1] +
    '<span class="tooltip-icon" data-tooltip="RPE scale explanation">?</span>';
} else {
  exerciseNotes.textContent = exercise.note ? 'Note: ' + exercise.note : '';
}
```

**RPE Tooltip Integration**:
```css
.tooltip-icon:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  background: var(--primary-dark-blue);
  color: var(--text-light);
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
}
```

### Sub-Exercise Support

The system supports compound exercises with multiple parts:

```javascript
// Handle subExercise if present
if (exercise.subExercise) {
  const subHeader = document.createElement('h4');
  subHeader.textContent = 'Part 2:';

  const subDetails = document.createElement('div');
  // Create metrics for sub-exercise

  const subGif = document.createElement('img');
  subGif.src = "../" + exercise.subExercise.gif;

  // Append all sub-exercise elements
  exerciseContent.appendChild(subHeader);
  exerciseContent.appendChild(subDetails);
  exerciseContent.appendChild(subGif);
}
```

## Completion Tracking System

### Exercise Completion Toggle
```javascript
function toggleCompleted(element) {
  const index = parseInt(element.getAttribute('data-index'));
  element.classList.toggle('completed');

  // Update completion state
  completedExercises[index] = element.classList.contains('completed');

  // Update timeline dot
  const dots = document.querySelectorAll('.timeline .timeline-dot');
  if (completedExercises[index]) {
    dots[index].classList.add('completed');
  } else {
    dots[index].classList.remove('completed');
  }

  updateProgressIndicators();
  saveProgress(); // Persist to localStorage
}
```

### Progress Calculation
```javascript
function updateProgressIndicators() {
  const totalExercises = program.exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercentage = (completedCount / totalExercises) * 100;

  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = progressPercentage + '%';

  // Celebration animation at 100%
  if (progressPercentage === 100) {
    setTimeout(() => celebrateCompletion(), 500);
  }
}
```

### Completion Celebration
```javascript
function celebrateCompletion() {
  const programName = document.getElementById('program-name');
  programName.style.animation = 'completePulse 1s ease-out';

  ons.notification.alert({
    message: 'Workout Complete! Great job!',
    title: 'Congratulations!'
  });

  setTimeout(() => {
    programName.style.animation = '';
  }, 1000);
}
```

## State Persistence System

### localStorage Integration
```javascript
// Save progress to localStorage
function saveProgress() {
  localStorage.setItem(`workout_progress_${programId}`, JSON.stringify(completedExercises));
}

// Load saved progress
function loadSavedProgress() {
  const savedProgress = localStorage.getItem(`workout_progress_${programId}`);
  if (savedProgress) {
    try {
      completedExercises = JSON.parse(savedProgress);
    } catch (e) {
      console.error('Error loading saved progress:', e);
      completedExercises = {};
    }
  }
}

// Clear saved progress
function clearSavedProgress() {
  localStorage.removeItem(`workout_progress_${programId}`);
}
```

### Progress Reset System

#### Smart Reset Button
The reset button appears only when there's progress to reset and when scrolled to the bottom area:

```javascript
// Track reset button visibility state
let hasProgress = false;
let isScrolledToBottom = false;

function checkForProgress() {
  const hasCompletedExercises = Object.values(completedExercises).some(Boolean);
  const hasActiveExercise = currentOpenExerciseIndex >= 0;
  return hasCompletedExercises || hasActiveExercise;
}

function updateResetButtonVisibility() {
  const resetSection = document.getElementById('reset-section');
  const shouldShow = hasProgress && isScrolledToBottom;

  if (shouldShow && resetSection.style.display === 'none') {
    resetSection.style.display = 'block';
    setTimeout(() => {
      resetSection.style.opacity = '1';
    }, 10);
  } else if (!shouldShow && resetSection.style.display === 'block') {
    resetSection.style.opacity = '0';
    setTimeout(() => {
      if (!shouldShow) {
        resetSection.style.display = 'none';
      }
    }, 300);
  }
}
```

#### Scroll-Based Visibility
```javascript
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    const wasScrolledToBottom = isScrolledToBottom;
    isScrolledToBottom = scrollPercentage > 0.6; // Bottom 40% of page

    if (wasScrolledToBottom !== isScrolledToBottom) {
      updateResetButtonVisibility();
    }
  }, 100);
});
```

#### Reset Functionality
```javascript
function resetWorkoutProgress() {
  // Clear completion state
  completedExercises = {};

  // Remove completed classes from exercises
  const allExercises = document.querySelectorAll('.exercise-item');
  allExercises.forEach(exercise => {
    exercise.classList.remove('completed');
  });

  // Remove completed classes from timeline dots
  const dots = document.querySelectorAll('.timeline .timeline-dot');
  dots.forEach(dot => {
    dot.classList.remove('completed');
  });

  updateProgressIndicators();
  clearSavedProgress();

  ons.notification.alert('Workout progress has been reset!');
}
```

## Share Functionality

### Native Sharing Integration
```javascript
const shareButton = document.querySelector('.share-button');
shareButton.onclick = function() {
  const shareUrl = window.location.href;
  const programTitle = program.title;

  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: programTitle,
      url: shareUrl
    }).catch(error => console.error('Error sharing:', error));
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        ons.notification.alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        ons.notification.alert('Could not copy link');
      });
  }
};
```

## Error Handling & Edge Cases

### Data Loading Error Management
```javascript
fetch('workouts.json')
  .then(response => response.json())
  .then(data => {
    const program = data.programs.find(p => p.id === programId);

    if (!program) {
      document.getElementById('program-name').textContent = 'Program Not Found';
      return;
    }

    // Continue with program loading...
  })
  .catch(error => {
    console.error('Error loading workouts.json:', error);
    document.getElementById('program-name').textContent = 'Error Loading Program';
  });
```

### Null Reference Protection
```javascript
// Safe element access
const progressIndicator = document.querySelector('.progress-indicator');
const progressHeight = progressIndicator ? progressIndicator.offsetHeight : 0;

// Safe array access
if (dots[index]) {
  dots[index].classList.add('completed');
}
```

## Responsive Design Features

### Mobile-Optimized Layouts
```css
@media (max-width: 480px) {
  .exercise-title {
    font-size: 1em;
  }

  .metric-value {
    font-size: 1.8em;
  }

  .exercise-details {
    padding: 12px;
  }
}
```

### Touch-Friendly Interactions
- **Large touch targets**: Exercise headers, timeline dots, completion buttons
- **Hover state alternatives**: Touch-appropriate feedback
- **Smooth animations**: CSS transitions for state changes

## Performance Optimizations

### Efficient DOM Management
- **Event delegation**: Single event listeners for multiple elements
- **Lazy content loading**: Exercise details loaded on expand
- **Memory cleanup**: Proper event listener management

### Animation Performance
```css
.timeline-dot {
  transition: all 0.3s ease;
  will-change: transform; /* GPU acceleration hint */
}

.exercise-content {
  transition: max-height 0.3s ease-out;
  overflow: hidden;
}
```

This comprehensive program interface provides users with an intuitive, feature-rich workout experience while maintaining performance and accessibility standards across mobile devices.