# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based GitHub Pages website for an exercise database called "Juan's Exercise Database". The site provides workout programs with exercise demonstrations via GIFs, targeted at helping users find and follow structured fitness routines.

## Architecture

- **Frontend**: Static HTML/CSS/JavaScript website using Jekyll theme (jekyll-theme-slate)
- **Content Management**: JSON-based data storage for workouts and programs
- **Media Processing**: Python-based YouTube-to-GIF conversion pipeline
- **Deployment**: GitHub Pages hosting

## Key Components

- `index.html` - Main homepage with site introduction
- `programs.html` - Lists all available workout programs
- `start.html` - Program selection interface
- `glossary.html` - Exercise terminology and definitions
- `workouts.json` - Structured exercise data with GIF references
- `plans.json` - Workout program definitions
- `style.css` - Custom styling for the site
- `gifs/` - Directory containing exercise demonstration GIFs

## Development Commands

### Local Jekyll Development
```bash
# Install Jekyll (if not already installed)
gem install jekyll bundler

# Serve site locally (if Gemfile exists)
bundle exec jekyll serve

# Alternative: serve with Jekyll directly
jekyll serve

# View at http://localhost:4000
```

### GIF Generation Pipeline
```bash
# Generate exercise GIFs from YouTube videos
python3 youtube_to_gif_v2.py <video_url> <start_time> <end_time> <aspect_ratio> <output_folder> --user

# Run with predefined parameters
./run_gif_maker.sh
```

### Python Dependencies
The GIF generation script requires:
- `pytube` - YouTube video downloading
- `moviepy` - Video processing
- `PIL` - Image manipulation
- `yt_dlp` - Alternative YouTube downloader
- `ffmpeg` - Video conversion backend

## Site Structure

### Navigation Pages
- Home (`index.html`) - Welcome and introduction
- Start (`start.html`) - Program selection by workout type
- Programs (`programs.html`) - Alphabetical program listing
- Glossary (`glossary.html`) - Exercise definitions

### Data Structure
- Each program in `workouts.json` contains:
  - Program metadata (title, requirements, etc.)
  - Exercise array with name, GIF path, reps, sets, and notes
- Programs are categorized by body part and difficulty level

## Content Management

### Adding New Exercises
1. Create/obtain exercise demonstration GIF
2. Place GIF in `gifs/` directory
3. Add exercise entry to appropriate program in `workouts.json`
4. Include: name, gif path, reps, sets, notes, repUnits

### Adding New Programs
1. Design program structure with exercises
2. Add program object to `workouts.json` programs array
3. Ensure all referenced GIFs exist in `gifs/` directory
4. Update navigation/filtering logic if needed

## Deployment

- Automatic deployment via GitHub Pages when pushing to main branch
- Site available at: https://juantheengineer.github.io/
- Jekyll processing happens automatically on GitHub

## File Organization

- Root directory contains main HTML pages and assets
- `gifs/` contains all exercise demonstration GIFs
- `bluemicro/` contains additional components or templates
- `onsen_demo/` contains demo or prototype components
- `_notes/` contains development notes and asset metadata