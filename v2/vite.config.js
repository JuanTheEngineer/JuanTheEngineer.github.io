import { defineConfig } from 'vite';

export default defineConfig({
  // Build to ../v2-dist when running `npm run build`
  // (so it doesn't conflict with the v2 source)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild'
  },
  // Base path for GitHub Pages deployment under /v2/
  // Will be served at https://juantheengineer.github.io/v2/
  base: './',
  server: {
    port: 5173,
    open: true
  }
});
