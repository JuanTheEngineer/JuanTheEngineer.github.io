#!/usr/bin/env node
/**
 * Update workouts.json with Cloudinary video URLs and alternatives
 * 
 * Reads from:
 * - replacement-log.json (successful uploads)
 * - video-sources.json (alternatives)
 * 
 * Updates:
 * - workouts.json (adds cloudinaryUrl and alternatives)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load data
const workouts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'workouts.json'), 'utf-8'));
const replacementLog = JSON.parse(fs.readFileSync(path.join(projectRoot, 'replacement-log.json'), 'utf-8'));
const videoSources = JSON.parse(fs.readFileSync(path.join(projectRoot, 'video-sources.json'), 'utf-8'));

// Get successful uploads
const successfulUploads = replacementLog.results.filter(r => r.success);

console.log('🎬 Updating workouts.json with video URLs and alternatives\n');
console.log(`Found ${successfulUploads.length} successful video uploads\n`);

let updatedCount = 0;
let alternativesAdded = 0;

// Update exercises
workouts.programs.forEach(program => {
  program.exercises.forEach(exercise => {
    // Find matching upload by checking gif filename
    const gifFilename = exercise.gif ? path.basename(exercise.gif) : null; // Keep extension!
    
    if (!gifFilename) return;
    
    // Check if we have a video for this exercise
    const gifBasename = path.basename(gifFilename, path.extname(gifFilename)); // Remove extension for upload matching
    const upload = successfulUploads.find(u => u.exerciseName === gifBasename);
    
    if (upload) {
      // Update cloudinaryUrl (legacy)
      exercise.cloudinaryUrl = upload.url;
      
      // Add new source field
      exercise.source = {
        type: 'cloudinary',
        url: upload.url,
        startTime: upload.source.startTime || 0,
        endTime: upload.source.endTime || 0,
        notes: upload.source.notes || 'Cloudinary hosted video'
      };
      
      updatedCount++;
      console.log(`✓ ${exercise.name}`);
      console.log(`  ${upload.url}`);
      
      // Check for alternatives in video-sources.json
      const videoSource = videoSources[gifFilename];
      if (videoSource && videoSource.alternatives && videoSource.alternatives.length > 0) {
        // Deduplicate alternatives by URL
        const uniqueAlternatives = [];
        const seenUrls = new Set();
        
        videoSource.alternatives.forEach(alt => {
          let altUrl, altNotes;
          
          // Handle old format (string) vs new format (object)
          if (typeof alt === 'string') {
            altUrl = alt;
            // For old format, only include if parent has high confidence
            if (videoSource.confidence && videoSource.confidence < 0.85) {
              return; // Skip low-confidence AI suggestions
            }
            // Enrich with metadata from video-sources.json
            altNotes = videoSource.videoTitle ? `${videoSource.videoTitle}` : 'AI suggested alternative';
          } else {
            altUrl = alt.url;
            altNotes = alt.notes;
          }
          
          if (!seenUrls.has(altUrl)) {
            seenUrls.add(altUrl);
            const altObj = {
              type: (typeof alt === 'object' && alt.type) ? alt.type : 'youtube',
              url: altUrl,
              startTime: 0,
              endTime: 0
            };
            
            // Add optional fields if present
            if (typeof alt === 'object') {
              if (alt.startTime !== undefined) altObj.startTime = alt.startTime;
              if (alt.endTime !== undefined) altObj.endTime = alt.endTime;
              if (alt.notes) altObj.notes = alt.notes;
            } else if (altNotes) {
              altObj.notes = altNotes;
            }
            
            uniqueAlternatives.push(altObj);
          }
        });
        
        if (uniqueAlternatives.length > 0) {
          exercise.alternatives = uniqueAlternatives;
          alternativesAdded++;
          console.log(`  + ${uniqueAlternatives.length} alternative(s)`);
        }
      }
      
      // Also check for primary video in video-sources (for exercises without uploads)
      if (!upload && videoSource && videoSource.youtubeUrl && videoSource.confidence >= 0.85) {
        // High-confidence AI suggestion without upload - add as alternatives
        const alternatives = [];
        
        // Add primary suggestion
        alternatives.push({
          type: 'youtube',
          url: videoSource.youtubeUrl,
          startTime: 0,
          endTime: 0,
          notes: videoSource.videoTitle || 'AI suggested primary'
        });
        
        // Add alternatives if they exist
        if (videoSource.alternatives && Array.isArray(videoSource.alternatives)) {
          videoSource.alternatives.forEach(altUrl => {
            if (typeof altUrl === 'string' && !alternatives.find(a => a.url === altUrl)) {
              alternatives.push({
                type: 'youtube',
                url: altUrl,
                startTime: 0,
                endTime: 0,
                notes: 'AI suggested alternative'
              });
            }
          });
        }
        
        if (alternatives.length > 0) {
          exercise.alternatives = alternatives;
          alternativesAdded++;
          console.log(`✓ ${exercise.name} (AI suggestions)`);
          console.log(`  + ${alternatives.length} alternative(s) from AI`);
          console.log('');
        }
      }
      console.log('');
    }
  });
});

// Save updated workouts.json
fs.writeFileSync(
  path.join(projectRoot, 'workouts.json'),
  JSON.stringify(workouts, null, 2)
);

console.log('═'.repeat(70));
console.log('SUMMARY');
console.log('═'.repeat(70));
console.log(`✓ Updated ${updatedCount} exercises with Cloudinary URLs`);
console.log(`✓ Added alternatives to ${alternativesAdded} exercises`);
console.log('\n✨ workouts.json updated successfully!');
