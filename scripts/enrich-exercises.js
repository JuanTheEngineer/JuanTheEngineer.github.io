#!/usr/bin/env node
/**
 * Exercise Data Enrichment Pipeline
 *
 * For each exercise:
 *   1. AI-generates an expert form note (250-300 chars) via OpenAI
 *   2. Searches YouTube for 3-5 short demo videos
 *   3. Grabs metadata (title, channel) for creator credit
 *   4. Writes everything back to exercises.json
 *
 * Only fills gaps — does NOT overwrite existing notes or demos.
 *
 * Usage:
 *   node scripts/enrich-exercises.js                    # enrich all exercises
 *   node scripts/enrich-exercises.js --only-missing     # only exercises missing notes/demos
 *   node scripts/enrich-exercises.js --dry-run          # preview without writing
 *
 * Requires in .env:
 *   OPENAI_API_KEY=sk-...
 *   YOUTUBE_API_KEY=AIza...
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const EXERCISES_PATH = join(ROOT, 'exercises.json');

// --- Config ---
const OPENAI_API_KEY = getEnv('OPENAI_API_KEY');
const YOUTUBE_API_KEY = getEnv('YOUTUBE_API_KEY');
const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_MISSING = process.argv.includes('--only-missing');
const MAX_YOUTUBE_RESULTS = 4;
const NOTE_MAX_CHARS = 300;

// --- Load data ---
const data = JSON.parse(readFileSync(EXERCISES_PATH, 'utf8'));
const exercises = data.exercises;

console.log(`\n🏋️  Exercise Enrichment Pipeline`);
console.log(`   ${exercises.length} exercises | ${DRY_RUN ? 'DRY RUN' : 'LIVE'} | ${ONLY_MISSING ? 'missing only' : 'all'}\n`);

// --- Main ---
async function main() {
  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const rec = ex.recommendations || {};
    const hasDemos = (ex.demos || []).length > 0;
    const hasNote = !!rec.note;

    // Skip if only-missing and exercise is already complete
    if (ONLY_MISSING && hasDemos && hasNote) {
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${exercises.length}] ${ex.name} (${ex.id})`);

    try {
      // Step 1: Generate expert note if missing
      if (!hasNote) {
        const note = await generateNote(ex.name);
        if (note) {
          if (!ex.recommendations) ex.recommendations = {};
          ex.recommendations.note = note;
          console.log(`   ✓ Note: "${note.substring(0, 60)}..."`);
        }
      } else {
        console.log(`   · Note exists, skipping`);
      }

      // Step 2: Search YouTube for demos if missing or few
      const existingDemoCount = (ex.demos || []).length;
      if (existingDemoCount < 2) {
        const videos = await searchYouTube(ex.name, MAX_YOUTUBE_RESULTS);
        if (videos.length > 0) {
          if (!ex.demos) ex.demos = [];
          // Don't add duplicates or previously rejected URLs
          const existingUrls = new Set(ex.demos.map(d => d.url));
          const rejectedUrls = new Set((ex.rejectedDemos || []).map(r => r.url));
          let added = 0;
          for (const vid of videos) {
            if (!existingUrls.has(vid.url) && !rejectedUrls.has(vid.url)) {
              ex.demos.push(vid);
              existingUrls.add(vid.url);
              added++;
            }
          }
          console.log(`   ✓ Added ${added} YouTube demos (${videos.length} found, ${rejectedUrls.size} rejected skipped)`);
        } else {
          console.log(`   ⚠ No YouTube results`);
        }
      } else {
        console.log(`   · ${existingDemoCount} demos exist, skipping`);
      }

      enriched++;
    } catch (err) {
      console.log(`   ✗ Error: ${err.message}`);
      errors++;
    }

    // Rate limiting: small delay between exercises
    await sleep(300);
  }

  // Save
  if (!DRY_RUN) {
    data.lastUpdated = new Date().toISOString();
    writeFileSync(EXERCISES_PATH, JSON.stringify(data, null, 2) + '\n');
    console.log(`\n✅ Saved to exercises.json`);
  } else {
    console.log(`\n🔍 Dry run — no changes written`);
  }

  console.log(`\n   Enriched: ${enriched} | Skipped: ${skipped} | Errors: ${errors}\n`);
}

// --- OpenAI: Generate expert form note ---
async function generateNote(exerciseName) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an elite strength and conditioning coach. Given an exercise name, write a concise form cue (${NOTE_MAX_CHARS} characters MAX). Focus on:
- The #1 most common mistake and how to fix it
- Key body position or breathing cue
- What the user should feel if doing it right

Be direct, practical, no fluff. Write as if coaching someone mid-set. Do NOT start with the exercise name.`
        },
        { role: 'user', content: exerciseName }
      ],
      temperature: 0.4,
      max_tokens: 150
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.substring(0, 100)}`);
  }

  const json = await res.json();
  let note = json.choices[0]?.message?.content?.trim() || '';
  // Trim to max chars
  if (note.length > NOTE_MAX_CHARS) note = note.substring(0, NOTE_MAX_CHARS - 3) + '...';
  return note;
}

// --- YouTube: Search for demo videos ---
async function searchYouTube(exerciseName, maxResults = 4) {
  const query = `${exerciseName} exercise form demo`;
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: String(maxResults),
    videoDuration: 'short', // under 4 minutes
    relevanceLanguage: 'en',
    safeSearch: 'strict',
    key: YOUTUBE_API_KEY
  });

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube ${res.status}: ${err.substring(0, 100)}`);
  }

  const json = await res.json();
  const items = json.items || [];

  return items.map(item => ({
    type: 'youtube',
    mediaType: 'video',
    format: 'youtube',
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    startTime: 0,
    endTime: 0,
    isPrimary: false,
    notes: item.snippet.title || '',
    metadata: {
      title: item.snippet.title || '',
      channel: item.snippet.channelTitle || '',
      publishedAt: item.snippet.publishedAt || '',
      thumbnail: item.snippet.thumbnails?.high?.url || ''
    }
  }));
}

// --- Helpers ---
function getEnv(key) {
  // Check process.env first
  if (process.env[key]) return process.env[key];
  // Read from .env file
  try {
    const envFile = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of envFile.split('\n')) {
      const [k, ...vParts] = line.split('=');
      if (k.trim() === key) return vParts.join('=').trim();
    }
  } catch {}
  console.error(`❌ Missing env var: ${key}`);
  console.error(`   Add it to .env: ${key}=your-key-here`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});
