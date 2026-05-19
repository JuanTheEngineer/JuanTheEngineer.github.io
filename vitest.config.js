import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js', 'scripts/**/*.js'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.config.js'
      ]
    }
  }
});
