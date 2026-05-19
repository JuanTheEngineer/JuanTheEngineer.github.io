/**
 * Global test setup
 * Runs before all tests
 */
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Set test environment variables
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.CLOUDINARY_API_KEY = 'test-key';
  process.env.CLOUDINARY_API_SECRET = 'test-secret';
  
  // Suppress console logs during tests (optional)
  // global.console = {
  //   ...console,
  //   log: () => {},
  //   warn: () => {},
  //   error: () => {}
  // };
});

afterAll(() => {
  // Cleanup after all tests
});
