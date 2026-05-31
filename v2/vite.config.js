import { defineConfig } from 'vite';

export default defineConfig({
  // Build to repo root /docs folder for GitHub Pages
  // GitHub Pages can serve from /docs on main branch
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild'
  },
  // Relative base path — works for both root domain and subdirectory
  base: './',
  server: {
    port: 5173,
    open: true
  }
});
