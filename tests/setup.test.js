/**
 * Test to verify Vitest setup is working
 */
import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true);
  });
  
  it('should have test environment variables set', () => {
    expect(process.env.CLOUDINARY_CLOUD_NAME).toBe('test-cloud');
    expect(process.env.CLOUDINARY_API_KEY).toBe('test-key');
    expect(process.env.CLOUDINARY_API_SECRET).toBe('test-secret');
  });
  
  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
  });
});
