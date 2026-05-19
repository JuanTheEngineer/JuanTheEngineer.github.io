#!/usr/bin/env node
/**
 * Cloudinary Upload Script
 * 
 * Uploads all GIF files from the gifs/ directory to Cloudinary CDN.
 * Creates a migration log mapping local filenames to Cloudinary URLs.
 * 
 * Usage:
 *   node scripts/upload-to-cloudinary.js
 * 
 * Environment Variables:
 *   CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name
 *   CLOUDINARY_API_KEY - Your Cloudinary API key
 *   CLOUDINARY_API_SECRET - Your Cloudinary API secret
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a single GIF to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} publicId - Cloudinary public ID (filename without extension)
 * @returns {Promise<string>} Cloudinary secure URL
 */
export async function uploadGif(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'exercises',
      public_id: publicId,
      resource_type: 'image',
      overwrite: false
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload ${publicId}: ${error.message}`);
  }
}

/**
 * Upload all GIFs from gifs/ directory
 * @returns {Promise<Object>} Migration log mapping filenames to URLs
 */
export async function uploadAllGifs() {
  const projectRoot = path.join(__dirname, '..');
  const gifsDir = path.join(projectRoot, 'gifs');
  
  // Check if gifs directory exists
  if (!fs.existsSync(gifsDir)) {
    throw new Error(`GIFs directory not found: ${gifsDir}`);
  }
  
  // Get all GIF files
  const files = fs.readdirSync(gifsDir).filter(f => f.endsWith('.gif'));
  
  if (files.length === 0) {
    throw new Error('No GIF files found in gifs/ directory');
  }
  
  console.log(`Found ${files.length} GIF files to upload\n`);
  
  const migrationLog = {};
  let successCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    const filePath = path.join(gifsDir, file);
    const publicId = path.basename(file, '.gif');
    
    try {
      console.log(`Uploading: ${file}...`);
      const url = await uploadGif(filePath, publicId);
      migrationLog[file] = url;
      successCount++;
      console.log(`✓ Success: ${url}\n`);
    } catch (error) {
      console.error(`✗ Failed: ${file} - ${error.message}\n`);
      migrationLog[file] = { error: error.message };
      failCount++;
    }
  }
  
  console.log('═'.repeat(70));
  console.log('UPLOAD SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total files: ${files.length}`);
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log('═'.repeat(70));
  
  return migrationLog;
}

/**
 * Save migration log to JSON file
 * @param {Object} log - Migration log object
 * @param {string} outputPath - Output file path
 */
export function saveMigrationLog(log, outputPath = 'migration-log.json') {
  const projectRoot = path.join(__dirname, '..');
  const fullPath = path.join(projectRoot, outputPath);
  
  fs.writeFileSync(fullPath, JSON.stringify(log, null, 2));
  console.log(`\n✓ Migration log saved to: ${outputPath}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for required environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Error: CLOUDINARY_CLOUD_NAME environment variable not set');
    console.error('\nSet it with: export CLOUDINARY_CLOUD_NAME="your-cloud-name"');
    process.exit(1);
  }
  
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Error: CLOUDINARY_API_KEY environment variable not set');
    console.error('\nSet it with: export CLOUDINARY_API_KEY="your-api-key"');
    process.exit(1);
  }
  
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: CLOUDINARY_API_SECRET environment variable not set');
    console.error('\nSet it with: export CLOUDINARY_API_SECRET="your-api-secret"');
    process.exit(1);
  }
  
  console.log('═'.repeat(70));
  console.log('CLOUDINARY GIF UPLOAD');
  console.log('═'.repeat(70));
  console.log(`Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log('═'.repeat(70));
  console.log('');
  
  uploadAllGifs()
    .then(log => {
      saveMigrationLog(log);
      
      // Check if all uploads succeeded
      const failedUploads = Object.entries(log).filter(([_, value]) => 
        typeof value === 'object' && value.error
      );
      
      if (failedUploads.length > 0) {
        console.error('\n⚠️  Some uploads failed. Check migration-log.json for details.');
        process.exit(1);
      }
      
      console.log('\n✅ All uploads completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Upload failed:', error.message);
      process.exit(1);
    });
}
