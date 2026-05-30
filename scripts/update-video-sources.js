#!/usr/bin/env node
/**
 * Update video-sources.json from migration-log.json
 * Adds source tracking for already uploaded GIFs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Read migration log
const migrationLogPath = path.join(projectRoot, 'migration-log.json');
if (!fs.existsSync(migrationLogPath)) {
  console.error('❌ migration-log.json not found');
  process.exit(1);
}

const migrationLog = JSON.parse(fs.readFileSync(migrationLogPath, 'utf-8'));

// Read existing video-sources.json
const sourcesPath = path.join(projectRoot, 'video-sources.json');
let sources = {};
if (fs.existsSync(sourcesPath)) {
  sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
}

// Add GIF sources
let addedCount = 0;
for (const [filename, value] of Object.entries(migrationLog)) {
  if (typeof value === 'string' && value.includes('cloudinary.com')) {
    const exerciseName = path.basename(filename, path.extname(filename));
    
    // Only add if not already tracked
    if (!sources[exerciseName]) {
      sources[exerciseName] = {
        cloudinaryUrl: value,
        source: {
          originalFile: filename,
          uploadedAt: new Date().toISOString()
        },
        type: 'original-gif'
      };
      addedCount++;
    }
  }
}

// Save
fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2));
console.log(`✓ Added ${addedCount} GIF sources to video-sources.json`);
console.log(`✓ Total entries: ${Object.keys(sources).length}`);
