# Juan's Workout Database

A comprehensive fitness platform providing workout programs with exercise demonstrations. The website offers both a modern mobile-first experience and a classic desktop version.

## 🚀 Live Website

- **Main Site (V1)**: Modern mobile-first Onsen UI application
- **Legacy Site (V0)**: Classic desktop website available at `/v0/`

## 📱 Architecture

### V1 - Modern Mobile App (Main Site)
- **Framework**: Onsen UI (mobile-first SPA)
- **Architecture**: Navigator → Tabbar → Pages hierarchy
- **Features**:
  - Advanced workout tracking with localStorage persistence
  - Interactive timeline visualization with adaptive layouts
  - Exercise completion animations and progress indicators
  - Expandable exercise details with GIF demonstrations
  - Share functionality and reset progress options
  - RPE (Rate of Perceived Exertion) tooltips
  - Responsive design optimized for mobile devices

### V0 - Classic Desktop Version
- **Framework**: Static HTML/CSS/JavaScript
- **Architecture**: Traditional multi-page website
- **Features**: Basic navigation and exercise browsing
- **Access**: Via subtle link on main site or direct URL `/v0/`

## 🗂️ Project Structure

```
/
├── index.html              # V1 Onsen UI mobile app (main site)
├── workouts.json          # Exercise data with GIF references
├── plans.json             # Workout program categories and organization
├── glossary.json          # Exercise terminology definitions
├── gifs/                  # Exercise demonstration GIFs (82 files)
├── v0/                    # Legacy desktop website
│   ├── index.html         # V0 homepage
│   ├── programs.html      # Program listings
│   ├── start.html         # Program selection
│   ├── glossary.html      # Exercise definitions
│   ├── style.css          # V0 styling
│   └── bluemicro/         # Additional V0 components
├── onsen_demo/            # Development/demo files
├── _site/                 # Jekyll build output
└── README.md              # This file
```

## 🎨 Design System

### V1 Color Palette
```css
--primary-blue: #4586F1;
--primary-dark-blue: #093175;
--primary-light-blue: #65A9ED;
--primary-very-light-blue: #C5DDFA;
--accent-white: #FFFFFF;
--accent-light-gray: #f4f4f4;
--accent-gray: #e0e0e0;
--accent-dark: #333333;
```

### Key UI Components
- **Toolbar**: Dark blue header (`#2E6BC7`) with white text
- **Timeline**: Adaptive dot visualization (1, 2, or 4+ exercise layouts)
- **Progress Bar**: Animated with shimmer effect
- **Exercise Cards**: Expandable with completion checkmarks
- **Hero Section**: Gradient blue background with motivational messaging

## 💾 Data Structure

### Workouts.json
Contains exercise programs with:
- Program metadata (id, title, requirements)
- Exercise arrays with name, GIF path, reps, sets, notes
- Sub-exercise support for compound movements
- RPE (Rate of Perceived Exertion) integration

### Plans.json
Organizes programs into categories:
- Main categories: Strength, Agility, Running, Other
- Sub-plans with descriptions
- Program ID references linking to workouts.json

### Glossary.json
Exercise terminology with definitions for user education.

## 🛠️ Development

### Local Development
```bash
# Serve the website locally
python3 -m http.server 4000

# Access at http://127.0.0.1:4000/
# V0 version at http://127.0.0.1:4000/v0/
```

### Adding New Exercises
1. Create/obtain exercise demonstration GIF
2. Place GIF in `gifs/` directory
3. Add exercise entry to appropriate program in `workouts.json`
4. Include: name, gif path, reps, sets, notes, repUnits

### Adding New Programs
1. Design program structure with exercises
2. Add program object to `workouts.json` programs array
3. Reference program ID in appropriate category in `plans.json`
4. Ensure all referenced GIFs exist

## 🎯 Features

### V1 Advanced Features
- **Progress Persistence**: Workout progress saved to localStorage
- **Interactive Timeline**: Click dots to navigate between exercises
- **Completion Animations**: Blue flash and flying motivational text
- **Smart Reset**: Progress reset with confirmation dialog
- **Adaptive Layouts**: Different timeline layouts based on exercise count
- **Exercise Expansion**: Detailed view with GIFs, metrics, and notes
- **Share Functionality**: Web Share API with clipboard fallback
- **RPE Integration**: Tooltips explaining Rate of Perceived Exertion
- **Sub-Exercise Support**: Complex movements with multiple parts

### Navigation
- **Cross-Platform**: Seamless switching between V1 and V0
- **SPA Navigation**: Proper Onsen UI navigator with back button support
- **Tab State Management**: Maintains navigation state across page transitions

## 🔧 Technical Details

### Onsen UI Implementation
- **Proper Architecture**: Navigator containing tabbar (not nested incorrectly)
- **Page Lifecycle**: Uses proper init, show, hide, destroy events
- **Data Passing**: Navigator options instead of sessionStorage hacks
- **Native Components**: ons-back-button, ons-tabbar, ons-page templates

### Performance Optimizations
- **Lazy Loading**: Content loaded on page initialization
- **Efficient Rendering**: Dynamic DOM manipulation for exercise lists
- **Smooth Animations**: CSS transitions with proper timing functions
- **Responsive Images**: GIFs optimized for mobile viewing

## 📚 Content Management

### Exercise Database
- **82 Exercise GIFs**: Comprehensive movement demonstrations
- **Multiple Categories**: Strength, Agility, Running, Special workouts
- **Detailed Instructions**: Reps, sets, weights, and technique notes
- **Progressive Difficulty**: Programs designed for skill progression

### User Experience
- **Mobile-First**: Optimized for touch interaction and mobile screens
- **Intuitive Navigation**: Clear tab structure with visual feedback
- **Progress Tracking**: Visual indicators and completion celebrations
- **Educational Content**: Glossary terms and RPE explanations

## 🚀 Deployment

### GitHub Pages
- **Automatic Deployment**: Pushes to main branch trigger rebuilds
- **Jekyll Processing**: Static site generation with GitHub Pages
- **Custom Domain**: Can be configured for custom URLs
- **HTTPS**: Secure serving via GitHub Pages infrastructure

### File Organization
- **Root Level**: V1 application files for main site access
- **V0 Directory**: Complete legacy site preservation
- **Asset Management**: Centralized GIF storage with relative path references
- **JSON Data**: Structured data files for easy content management

## 🎊 Version History

### V1 (Current - September 2025)
- Complete Onsen UI architectural transformation
- Advanced workout tracking and progress persistence
- Mobile-first responsive design with animations
- Standards-compliant SPA implementation

### V0 (Legacy)
- Original Jekyll-based static website
- Desktop-optimized layout and navigation
- Basic exercise browsing and program listings
- Preserved for users preferring classic experience

---

**Created by Juan the Engineer** | [GitHub](https://github.com/JuanTheEngineer)

*No more excuses! Your comprehensive fitness companion.*