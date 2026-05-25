#!/usr/bin/env node
/**
 * Build exercises.json - canonical library of unique exercises
 * 
 * Reads from:
 * - workouts.json (extracts unique exercises)
 * - video-sources.json (enriches with metadata)
 * 
 * Outputs:
 * - exercises.json (canonical library)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load data
const workouts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'workouts.json'), 'utf-8'));
const videoSources = JSON.parse(fs.readFileSync(path.join(projectRoot, 'video-sources.json'), 'utf-8'));

console.log('🏗️  Building exercises.json library\n');

/**
 * Convert exercise name to ID (kebab-case)
 * Removes prefixes like "Exercise 1:", "Warm Up 1:", "Strength 1:"
 */
function nameToId(name) {
  return name
    .replace(/^(Exercise|Warm Up|Strength|Stretch|Cool Down)\s*\d*[:\s-]+/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Clean exercise name (remove prefix like "Exercise 1:", "Warm Up 2:")
 */
function cleanName(name) {
  if (!name) return name;
  // Only strip if the prefix is followed by a colon and there's content after
  const stripped = name.replace(/^(Exercise|Warm Up|Strength|Stretch|Cool Down)\s*\d+\s*:\s*/i, '').trim();
  // If stripping resulted in empty or just numbers, keep original
  if (!stripped || /^\d+$/.test(stripped)) return name;
  return stripped;
}

/**
 * Detect media type from URL
 */
function detectMediaInfo(url) {
  const info = { type: 'url', mediaType: 'image', format: 'unknown' };
  
  if (!url) return info;
  
  // Cloudinary
  if (url.includes('cloudinary.com')) {
    info.type = 'cloudinary';
    if (url.includes('/video/')) {
      info.mediaType = 'video';
    } else if (url.includes('/image/')) {
      info.mediaType = 'image';
    }
  }
  // YouTube
  else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    info.type = 'youtube';
    info.mediaType = 'video';
    info.format = 'youtube';
  }
  // TikTok
  else if (url.includes('tiktok.com')) {
    info.type = 'tiktok';
    info.mediaType = 'video';
    info.format = 'tiktok';
  }
  // Vimeo
  else if (url.includes('vimeo.com')) {
    info.type = 'vimeo';
    info.mediaType = 'video';
    info.format = 'vimeo';
  }
  // Local file
  else if (url.startsWith('gifs/') || url.startsWith('./') || !url.startsWith('http')) {
    info.type = 'local';
  }
  
  // Detect format from extension
  const extMatch = url.match(/\.(gif|mp4|webp|jpg|jpeg|png|webm|mov)(\?|$)/i);
  if (extMatch) {
    const ext = extMatch[1].toLowerCase();
    info.format = ext;
    if (['mp4', 'webm', 'mov'].includes(ext)) info.mediaType = 'video';
    else if (['gif', 'webp', 'jpg', 'jpeg', 'png'].includes(ext)) info.mediaType = 'image';
    // Note: GIFs are technically images but display as video
    if (ext === 'gif') info.mediaType = 'video'; // GIFs animate
  }
  
  return info;
}

/**
 * Build a media source from a URL with metadata
 */
function buildSource(url, options = {}) {
  if (!url) return null;
  
  const info = detectMediaInfo(url);
  
  const source = {
    type: info.type,
    mediaType: info.mediaType,
    format: info.format,
    url: url,
    startTime: options.startTime || 0,
    endTime: options.endTime || 0,
    isPrimary: options.isPrimary || false
  };
  
  if (options.notes) source.notes = options.notes;
  if (options.metadata) source.metadata = options.metadata;
  
  return source;
}

// Build exercise library
const exerciseMap = new Map();

workouts.programs.forEach(program => {
  program.exercises.forEach(exercise => {
    // Skip compound exercise containers (handled separately)
    if (exercise.compoundExercises) {
      exercise.compoundExercises.forEach(sub => processExercise(sub, exercise.name));
      return;
    }
    
    processExercise(exercise);
    
    // Process sub-exercises
    if (exercise.subExercise) {
      processExercise(exercise.subExercise, exercise.name);
    }
  });
});

function processExercise(exercise, parentName) {
  if (!exercise.gif) return;
  
  // Use gif filename as the canonical key (without extension)
  const gifBase = path.basename(exercise.gif, path.extname(exercise.gif));
  const id = gifBase.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  if (!id) return;
  
  // Get or create exercise entry
  if (!exerciseMap.has(id)) {
    const displayName = exercise.name ? cleanName(exercise.name) : (parentName ? cleanName(parentName) : gifBase);
    
    exerciseMap.set(id, {
      id,
      name: displayName,
      aliases: new Set(),
      sources: [],
      sourceUrls: new Set(), // Track unique URLs
      recommendations: {
        reps: exercise.reps,
        sets: exercise.sets,
        repUnits: exercise.repUnits,
        note: exercise.note
      }
    });
  }
  
  const entry = exerciseMap.get(id);
  
  // Track aliases (different names used for same exercise)
  if (exercise.name) {
    const cleaned = cleanName(exercise.name);
    if (cleaned !== entry.name) {
      entry.aliases.add(cleaned);
    }
  }
  
  // Add primary source (cloudinaryUrl preferred, then gif)
  const primaryUrl = exercise.cloudinaryUrl || exercise.gif;
  if (primaryUrl && !entry.sourceUrls.has(primaryUrl)) {
    entry.sourceUrls.add(primaryUrl);
    const source = buildSource(primaryUrl, {
      isPrimary: entry.sources.filter(s => s.isPrimary).length === 0,
      startTime: exercise.startTime || 0,
      endTime: exercise.endTime || 0
    });
    if (source) entry.sources.push(source);
  }
  
  // Add local gif as fallback if cloudinaryUrl was used
  if (exercise.cloudinaryUrl && exercise.gif && !entry.sourceUrls.has(exercise.gif)) {
    entry.sourceUrls.add(exercise.gif);
    const source = buildSource(exercise.gif, {
      notes: 'Local fallback'
    });
    if (source) entry.sources.push(source);
  }
  
  // Add alternatives
  if (exercise.alternatives && Array.isArray(exercise.alternatives)) {
    exercise.alternatives.forEach(alt => {
      if (alt.url && !entry.sourceUrls.has(alt.url)) {
        entry.sourceUrls.add(alt.url);
        const source = buildSource(alt.url, {
          startTime: alt.startTime || 0,
          endTime: alt.endTime || 0,
          notes: alt.notes
        });
        // Override type if explicitly set
        if (alt.type) source.type = alt.type;
        if (source) entry.sources.push(source);
      }
    });
  }
  
  // Enrich with metadata from video-sources.json
  const videoSourceKey = path.basename(exercise.gif);
  const videoSource = videoSources[videoSourceKey];
  
  if (videoSource) {
    // Add primary YouTube suggestion if not already present
    if (videoSource.youtubeUrl && !entry.sourceUrls.has(videoSource.youtubeUrl)) {
      entry.sourceUrls.add(videoSource.youtubeUrl);
      const source = buildSource(videoSource.youtubeUrl, {
        notes: videoSource.videoTitle,
        metadata: {
          title: videoSource.videoTitle,
          channel: videoSource.videoChannel,
          duration: videoSource.videoDuration,
          views: videoSource.videoViews,
          confidence: videoSource.confidence
        }
      });
      if (source) entry.sources.push(source);
    }
    
    // Add old-format alternatives (string URLs) with metadata enrichment
    if (videoSource.alternatives && Array.isArray(videoSource.alternatives)) {
      videoSource.alternatives.forEach(alt => {
        const altUrl = typeof alt === 'string' ? alt : alt.url;
        if (altUrl && !entry.sourceUrls.has(altUrl)) {
          entry.sourceUrls.add(altUrl);
          const source = buildSource(altUrl, {
            notes: typeof alt === 'object' ? alt.notes : 'AI suggested alternative',
            startTime: typeof alt === 'object' ? (alt.startTime || 0) : 0,
            endTime: typeof alt === 'object' ? (alt.endTime || 0) : 0
          });
          if (source) entry.sources.push(source);
        }
      });
    }
  }
}

// Convert map to array, finalize structure
const exercises = Array.from(exerciseMap.values()).map(entry => {
  const result = {
    id: entry.id,
    name: entry.name
  };
  
  if (entry.aliases.size > 0) {
    result.aliases = Array.from(entry.aliases);
  }
  
  result.sources = entry.sources;
  
  // Only include recommendations if any field is set
  const recs = entry.recommendations;
  const hasRecs = recs.reps || recs.sets || recs.repUnits || recs.note;
  if (hasRecs) {
    result.recommendations = {};
    if (recs.reps) result.recommendations.reps = recs.reps;
    if (recs.sets) result.recommendations.sets = recs.sets;
    if (recs.repUnits) result.recommendations.repUnits = recs.repUnits;
    if (recs.note) result.recommendations.note = recs.note;
  }
  
  return result;
}).sort((a, b) => a.name.localeCompare(b.name));

// Build final library
const library = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  exercises
};

// Write to file
fs.writeFileSync(
  path.join(projectRoot, 'exercises.json'),
  JSON.stringify(library, null, 2)
);

// Statistics
const totalSources = exercises.reduce((sum, ex) => sum + ex.sources.length, 0);
const sourceTypes = {};
exercises.forEach(ex => {
  ex.sources.forEach(s => {
    sourceTypes[s.type] = (sourceTypes[s.type] || 0) + 1;
  });
});

console.log('═'.repeat(70));
console.log('SUMMARY');
console.log('═'.repeat(70));
console.log(`✓ Built exercises.json with ${exercises.length} unique exercises`);
console.log(`✓ Total media sources: ${totalSources}`);
console.log(`✓ Avg sources per exercise: ${(totalSources / exercises.length).toFixed(1)}`);
console.log('\nSource type breakdown:');
Object.entries(sourceTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});
console.log('\n✨ exercises.json created successfully!');
