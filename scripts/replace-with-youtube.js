#!/usr/bin/env node
/**
 * YouTube to Cloudinary Replacement Script
 * 
 * Downloads YouTube videos, converts to optimized MP4, and uploads to Cloudinary.
 * 
 * Usage:
 *   node scripts/replace-with-youtube.js
 * 
 * Then follow the interactive prompts, or use config file:
 *   node scripts/replace-with-youtube.js --config replacements.json
 * 
 * Config file format:
 * [
 *   {
 *     "exerciseName": "FireHydrant",
 *     "youtubeUrl": "https://www.youtube.com/watch?v=...",
 *     "startTime": 5,
 *     "endTime": 15
 *   }
 * ]
 * 
 * Environment Variables:
 *   CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name
 *   CLOUDINARY_API_KEY - Your Cloudinary API key
 *   CLOUDINARY_API_SECRET - Your Cloudinary API secret
 */

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import readline from 'readline';

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
 * Check if required tools are installed
 */
function checkDependencies() {
  const required = ['yt-dlp', 'ffmpeg'];
  const missing = [];
  
  for (const tool of required) {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
    } catch (error) {
      missing.push(tool);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required tools:', missing.join(', '));
    console.error('\nInstall with:');
    if (missing.includes('yt-dlp')) {
      console.error('  brew install yt-dlp');
    }
    if (missing.includes('ffmpeg')) {
      console.error('  brew install ffmpeg');
    }
    process.exit(1);
  }
}

/**
 * Download YouTube video
 * @param {string} url - YouTube URL
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to downloaded file
 */
async function downloadYouTube(url, outputPath) {
  console.log(`  Downloading from YouTube...`);
  
  try {
    execSync(
      `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4 -o "${outputPath}" "${url}"`,
      { stdio: 'inherit' }
    );
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

/**
 * Trim and optimize video
 * @param {string} inputPath - Input video path
 * @param {string} outputPath - Output video path
 * @param {number} startTime - Start time in seconds (0 for beginning)
 * @param {number} endTime - End time in seconds (0 for full length)
 * @returns {Promise<string>} Path to processed file
 */
async function processVideo(inputPath, outputPath, startTime, endTime) {
  const useFullLength = endTime === 0 || endTime <= startTime;
  
  if (useFullLength) {
    console.log(`  Processing video (full length)...`);
  } else {
    console.log(`  Processing video (${startTime}s - ${endTime}s)...`);
  }
  
  try {
    let ffmpegCmd = `ffmpeg -i "${inputPath}" `;
    
    // Add trimming if not full length
    if (!useFullLength) {
      const duration = endTime - startTime;
      ffmpegCmd += `-ss ${startTime} -t ${duration} `;
    }
    
    // Scale, optimize for web, ensure dimensions divisible by 2
    ffmpegCmd += 
      `-vf "scale='min(800,iw)':'min(600,ih)':force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2" ` +
      `-c:v libx264 -preset slow -crf 23 -movflags +faststart ` +
      `-c:a aac -b:a 128k -y "${outputPath}"`;
    
    execSync(ffmpegCmd, { stdio: 'inherit' });
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to process video: ${error.message}`);
  }
}

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<string>} Cloudinary secure URL
 */
async function uploadToCloudinary(filePath, publicId) {
  console.log(`  Uploading to Cloudinary...`);
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'exercises',
      public_id: publicId,
      resource_type: 'video',
      overwrite: true
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
}

/**
 * Process a single replacement
 * @param {Object} replacement - Replacement config
 * @returns {Promise<Object>} Result object
 */
async function processReplacement(replacement) {
  const { exerciseName, youtubeUrl, startTime, endTime, notes, alternatives } = replacement;
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Processing: ${exerciseName}`);
  console.log(`${'='.repeat(70)}`);
  
  const tempDir = path.join(__dirname, '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const downloadPath = path.join(tempDir, `${exerciseName}_download.mp4`);
  const processedPath = path.join(tempDir, `${exerciseName}_processed.mp4`);
  
  try {
    // Download
    await downloadYouTube(youtubeUrl, downloadPath);
    
    // Process
    await processVideo(downloadPath, processedPath, startTime, endTime);
    
    // Check file size
    const stats = fs.statSync(processedPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`  File size: ${sizeMB} MB`);
    
    if (stats.size > 10485760) {
      console.warn(`  ⚠️  Warning: File is ${sizeMB} MB (over 10MB free tier limit)`);
    }
    
    // Upload
    const cloudinaryUrl = await uploadToCloudinary(processedPath, exerciseName);
    
    // Cleanup
    if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    
    console.log(`  ✓ Success: ${cloudinaryUrl}`);
    
    return {
      exerciseName,
      success: true,
      url: cloudinaryUrl,
      sizeMB: parseFloat(sizeMB),
      source: {
        youtubeUrl,
        startTime,
        endTime,
        uploadedAt: new Date().toISOString(),
        notes
      },
      alternatives: alternatives || []
    };
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(downloadPath)) fs.unlinkSync(downloadPath);
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    
    console.error(`  ✗ Failed: ${error.message}`);
    
    return {
      exerciseName,
      success: false,
      error: error.message
    };
  }
}

/**
 * Interactive prompt for single replacement
 */
async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
  
  console.log('\n📹 YouTube to Cloudinary Replacement Tool');
  console.log('═'.repeat(70));
  
  const exerciseName = await question('Exercise name (e.g., FireHydrant): ');
  const youtubeUrl = await question('YouTube URL: ');
  const startTime = parseFloat(await question('Start time (seconds): '));
  const endTime = parseFloat(await question('End time (seconds): '));
  
  rl.close();
  
  const result = await processReplacement({
    exerciseName,
    youtubeUrl,
    startTime,
    endTime
  });
  
  return [result];
}

/**
 * Batch mode from config file
 */
async function batchMode(configPath) {
  console.log('\n📹 YouTube to Cloudinary Batch Replacement');
  console.log('═'.repeat(70));
  console.log(`Config: ${configPath}\n`);
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // Filter out entries with placeholder URLs
  const validEntries = config.filter(entry => {
    const isPlaceholder = !entry.youtubeUrl || 
                         entry.youtubeUrl.includes('PASTE_') || 
                         entry.youtubeUrl.includes('YOUR_URL') ||
                         entry.youtubeUrl.trim() === '';
    
    if (isPlaceholder) {
      console.log(`⏭️  Skipping ${entry.exerciseName} - placeholder URL\n`);
      return false;
    }
    return true;
  });
  
  if (validEntries.length === 0) {
    console.log('❌ No valid entries found in config file');
    return [];
  }
  
  console.log(`Found ${validEntries.length} valid entries to process\n`);
  
  const results = [];
  
  for (const replacement of validEntries) {
    const result = await processReplacement(replacement);
    results.push(result);
  }
  
  return results;
}

/**
 * Save results to log file
 */
function saveResults(results, outputPath = 'replacement-log.json') {
  const projectRoot = path.join(__dirname, '..');
  const fullPath = path.join(projectRoot, outputPath);
  
  const log = {
    timestamp: new Date().toISOString(),
    results
  };
  
  fs.writeFileSync(fullPath, JSON.stringify(log, null, 2));
  console.log(`\n✓ Results saved to: ${outputPath}`);
}

/**
 * Update video-sources.json with source metadata
 */
function updateVideoSources(results) {
  const projectRoot = path.join(__dirname, '..');
  const sourcesPath = path.join(projectRoot, 'video-sources.json');
  
  // Load existing sources or create new
  let sources = {};
  if (fs.existsSync(sourcesPath)) {
    try {
      sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
    } catch (error) {
      console.warn('⚠️  Could not parse existing video-sources.json, creating new file');
    }
  }
  
  // Add successful replacements
  const successful = results.filter(r => r.success);
  for (const result of successful) {
    const existing = sources[result.exerciseName];
    
    // Create new entry with proper structure
    sources[result.exerciseName] = {
      primary: {
        cloudinaryUrl: result.url,
        source: {
          type: 'youtube',
          url: result.source.youtubeUrl,
          startTime: result.source.startTime,
          endTime: result.source.endTime,
          uploadedAt: result.source.uploadedAt,
          notes: result.source.notes || 'Uploaded via YouTube replacement script'
        },
        fileSize: `${result.sizeMB} MB`,
        duration: result.source.endTime > 0 ? result.source.endTime - result.source.startTime : null
      },
      // Add alternatives from config, plus preserve existing ones
      alternatives: [
        ...(result.alternatives || []).map(alt => ({
          ...alt,
          addedAt: alt.addedAt || new Date().toISOString()
        })),
        ...(existing?.alternatives || [])
      ],
      metadata: {
        lastUpdated: new Date().toISOString()
      }
    };
  }
  
  // Save updated sources
  fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2));
  console.log(`✓ Updated video-sources.json with ${successful.length} entries`);
}

/**
 * Print summary
 */
function printSummary(results) {
  console.log('\n' + '═'.repeat(70));
  console.log('SUMMARY');
  console.log('═'.repeat(70));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Total: ${results.length}`);
  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n✓ Successful uploads:');
    successful.forEach(r => {
      console.log(`  - ${r.exerciseName} (${r.sizeMB} MB)`);
      console.log(`    ${r.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n✗ Failed uploads:');
    failed.forEach(r => {
      console.log(`  - ${r.exerciseName}: ${r.error}`);
    });
  }
  
  console.log('═'.repeat(70));
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary environment variables not set');
    console.error('\nRequired:');
    console.error('  CLOUDINARY_CLOUD_NAME');
    console.error('  CLOUDINARY_API_KEY');
    console.error('  CLOUDINARY_API_SECRET');
    process.exit(1);
  }
  
  // Check dependencies
  checkDependencies();
  
  // Parse arguments
  const args = process.argv.slice(2);
  const configIndex = args.indexOf('--config');
  const configPath = configIndex !== -1 ? args[configIndex + 1] : null;
  
  // Run in appropriate mode
  (async () => {
    try {
      const results = configPath 
        ? await batchMode(configPath)
        : await interactiveMode();
      
      saveResults(results);
      updateVideoSources(results);
      printSummary(results);
      
      const hasFailures = results.some(r => !r.success);
      process.exit(hasFailures ? 1 : 0);
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  })();
}

export { processReplacement, downloadYouTube, processVideo, uploadToCloudinary };
