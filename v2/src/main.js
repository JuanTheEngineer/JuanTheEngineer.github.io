// Action App V2 - Entry point
import './styles/main.css';
import { renderMedia } from './components/MediaPlayer.js';

const app = document.getElementById('app');

// Sample sources to demo all media types
const demoSources = [
  {
    label: 'Cloudinary GIF',
    source: {
      type: 'cloudinary',
      mediaType: 'video',
      format: 'gif',
      url: 'https://res.cloudinary.com/djhmqm9jy/image/upload/v1779208391/exercises/DeclinePistols.gif'
    }
  },
  {
    label: 'Cloudinary MP4 (autoplay, loop, muted)',
    source: {
      type: 'cloudinary',
      mediaType: 'video',
      format: 'mp4',
      url: 'https://res.cloudinary.com/djhmqm9jy/video/upload/v1779229133/exercises/FireHydrant.mp4'
    }
  },
  {
    label: 'YouTube (click-to-play)',
    source: {
      type: 'youtube',
      mediaType: 'video',
      format: 'youtube',
      url: 'https://www.youtube.com/watch?v=IRkRgk2Gc1E',
      notes: 'Fire Hydrant demonstration'
    }
  },
  {
    label: 'YouTube Shorts (click-to-play)',
    source: {
      type: 'youtube',
      mediaType: 'video',
      format: 'youtube',
      url: 'https://www.youtube.com/shorts/9Rrz2R2Y6AQ'
    }
  }
];

app.innerHTML = `
  <header class="px-6 pt-12 pb-4">
    <h1 class="text-3xl font-bold tracking-tight">MediaPlayer Demo</h1>
    <p class="text-slate-400 mt-1 text-sm">Testing all source types</p>
  </header>

  <main class="flex-1 px-6 pb-24 space-y-6">
    ${demoSources.map((demo, i) => `
      <section class="space-y-2 animate-slide-up" style="animation-delay: ${i * 50}ms">
        <h2 class="text-sm font-medium text-slate-300">${demo.label}</h2>
        <div data-media-slot="${i}"></div>
      </section>
    `).join('')}
  </main>
`;

// Render each demo source
demoSources.forEach((demo, i) => {
  const slot = app.querySelector(`[data-media-slot="${i}"]`);
  if (slot) renderMedia(slot, demo.source);
});

console.log('🚀 Action App V2 — MediaPlayer demo loaded');
