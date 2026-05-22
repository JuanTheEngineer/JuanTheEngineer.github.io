#!/usr/bin/env node

/**
 * Add Cloudinary URLs to workouts.json
 * 
 * Reads migration-log.json and adds cloudinaryUrl field to exercises
 * that have successfully uploaded GIFs on Cloudinary.
 * 
 * Usage:
 *   node scripts/add-cloudinary-urls.js
 *   npm run add-cloudinary-urls
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Load JSON file
 */
function loadJSON(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filepath}:`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * Extract filename from gif path
 */
function getFilename(gifPath) {
  return basename(gifPath);
}

/**
 * Process exercise and add cloudinaryUrl if available
 */
function processExercise(exercise, cloudinaryMap, stats) {
  if (!exercise.gif) {
    return exercise;
  }
  
  const filename = getFilename(exercise.gif);
  const cloudinaryUrl = cloudinaryMap[filename];
  
  if (cloudinaryUrl && typeof cloudinaryUrl === 'string') {
    // Only add if not already present
    if (!exercise.cloudinaryUrl) {
      exercise.cloudinaryUrl = cloudinaryUrl;
      stats.added++;
      console.log(`   ✓ Added: ${filename}`);
    } else {
      stats.skipped++;
    }
  } else if (cloudinaryUrl && cloudinaryUrl.error) {
    stats.failed++;
    console.log(`   ⚠️  Skipped (upload failed): ${filename}`);
  } else {
    stats.notFound++;
  }
  
  // Process sub-exercise if exists
  if (exercise.subExercise) {
    exercise.subExercise = processExercise(exercise.subExercise, cloudinaryMap, stats);
  }
  
  // Process compound exercises if exist
  if (exercise.compoundExercises && Array.isArray(exercise.compoundExercises)) {
    exercise.compoundExercises = exercise.compoundExercises.map(
      ex => processExercise(ex, cloudinaryMap, stats)
    );
  }
  
  return exercise;
}

/**
 * Main function
 */
function addCloudinaryUrls() {
  console.log('🔗 Adding Cloudinary URLs to workouts.json...\n');
  
  // Load migration log
  console.log('📋 Loading migration-log.json...');
  const migrationLog = loadJSON(join(rootDir, 'migration-log.json'));
  console.log(`   ✓ Found ${Object.keys(migrationLog).length} entries\n`);
  
  // Count successful uploads
  const successfulUploads = Object.entries(migrationLog).filter(
    ([_, value]) => typeof value === 'string'
  );
  console.log(`   ✓ ${successfulUploads.length} successful uploads`);
  console.log(`   ⚠️  ${Object.keys(migrationLog).length - successfulUploads.length} failed uploads\n`);
  
  // Load workouts
  console.log('📦 Loading workouts.json...');
  const workouts = loadJSON(join(rootDir, 'workouts.json'));
  console.log(`   ✓ Found ${workouts.programs.length} programs\n`);
  
  // Process all exercises
  console.log('🔄 Processing exercises...');
  const stats = {
    added: 0,
    skipped: 0,
    failed: 0,
    notFound: 0
  };
  
  workouts.programs.forEach((program, index) => {
    console.log(`\n   Program ${index + 1}/${workouts.programs.length}: ${program.title}`);
    program.exercises = program.exercises.map(
      exercise => processExercise(exercise, migrationLog, stats)
    );
  });
  
  // Save updated workouts
  console.log('\n\n💾 Saving updated workouts.json...');
  writeFileSync(
    join(rootDir, 'workouts.json'),
    JSON.stringify(workouts, null, 2) + '\n',
    'utf-8'
  );
  console.log('   ✓ Saved successfully\n');
  
  // Print summary
  console.log('📊 Summary:');
  console.log(`   • Cloudinary URLs added: ${stats.added}`);
  console.log(`   • Already had URLs (skipped): ${stats.skipped}`);
  console.log(`   • Failed uploads (skipped): ${stats.failed}`);
  console.log(`   • Not in migration log: ${stats.notFound}`);
  console.log(`   • Total exercises processed: ${stats.added + stats.skipped + stats.failed + stats.notFound}\n`);
  
  if (stats.added > 0) {
    console.log('✨ Success! Run "npm run validate" to verify the changes.\n');
  } else {
    console.log('ℹ️  No new URLs added. All exercises already have Cloudinary URLs.\n');
  }
}

// Run the script
try {
  addCloudinaryUrls();
} catch (error) {
  console.error('❌ Unexpected error:');
  console.error(`   ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
