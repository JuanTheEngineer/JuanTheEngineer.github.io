/**
 * Tests for Image URL Helper Functions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCloudinaryUrl,
  getResponsiveUrl,
  getFallbackUrl,
  getExerciseImageUrl,
  parseCloudinaryUrl,
  formatCloudinaryUrl
} from '../src/utils/image-urls.js';

describe('generateCloudinaryUrl', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  });
  
  it('should generate basic URL without transformations', () => {
    const url = generateCloudinaryUrl('BarbellSquat');
    expect(url).toBe('https://res.cloudinary.com/test-cloud/image/upload/v1/exercises/BarbellSquat.gif');
  });
  
  it('should include width transformation', () => {
    const url = generateCloudinaryUrl('BarbellSquat', { width: 400 });
    expect(url).toContain('w_400');
    expect(url).toBe('https://res.cloudinary.com/test-cloud/image/upload/w_400/v1/exercises/BarbellSquat.gif');
  });
  
  it('should include DPR transformation', () => {
    const url = generateCloudinaryUrl('BarbellSquat', { dpr: 2 });
    expect(url).toContain('dpr_2');
  });
  
  it('should include auto DPR transformation', () => {
    const url = generateCloudinaryUrl('BarbellSquat', { dpr: 'auto' });
    expect(url).toContain('dpr_auto');
  });
  
  it('should include format transformation', () => {
    const url = generateCloudinaryUrl('BarbellSquat', { format: 'auto' });
    expect(url).toContain('f_auto');
  });
  
  it('should include quality transformation', () => {
    const url = generateCloudinaryUrl('BarbellSquat', { quality: 80 });
    expect(url).toContain('q_80');
  });
  
  it('should combine multiple transformations', () => {
    const url = generateCloudinaryUrl('BarbellSquat', {
      width: 800,
      dpr: 'auto',
      format: 'auto',
      quality: 85
    });
    expect(url).toContain('w_800');
    expect(url).toContain('dpr_auto');
    expect(url).toContain('f_auto');
    expect(url).toContain('q_85');
  });
  
  it('should return fallback for null exercise name', () => {
    const url = generateCloudinaryUrl(null);
    expect(url).toBe(getFallbackUrl());
  });
  
  it('should return fallback for undefined exercise name', () => {
    const url = generateCloudinaryUrl(undefined);
    expect(url).toBe(getFallbackUrl());
  });
  
  it('should return fallback for empty string', () => {
    const url = generateCloudinaryUrl('');
    expect(url).toBe(getFallbackUrl());
  });
});

describe('getResponsiveUrl', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  });
  
  it('should generate responsive URL with default width', () => {
    const url = getResponsiveUrl('BarbellSquat');
    expect(url).toContain('w_800');
    expect(url).toContain('dpr_auto');
    expect(url).toContain('f_auto');
  });
  
  it('should generate responsive URL with custom width', () => {
    const url = getResponsiveUrl('BarbellSquat', 640);
    expect(url).toContain('w_640');
    expect(url).toContain('dpr_auto');
    expect(url).toContain('f_auto');
  });
});

describe('getFallbackUrl', () => {
  it('should return placeholder URL', () => {
    const url = getFallbackUrl();
    expect(url).toBe('https://via.placeholder.com/800x600?text=Exercise+Image+Unavailable');
  });
});

describe('getExerciseImageUrl', () => {
  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  });
  
  it('should extract exercise name from local GIF path', () => {
    const exercise = { name: 'Squat', gif: 'gifs/BarbellSquat.gif' };
    const url = getExerciseImageUrl(exercise);
    expect(url).toContain('BarbellSquat.gif');
  });
  
  it('should return Cloudinary URL as-is if already migrated', () => {
    const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif';
    const exercise = { name: 'Squat', gif: cloudinaryUrl };
    const url = getExerciseImageUrl(exercise);
    expect(url).toBe(cloudinaryUrl);
  });
  
  it('should return fallback for null exercise', () => {
    const url = getExerciseImageUrl(null);
    expect(url).toBe(getFallbackUrl());
  });
  
  it('should return fallback for exercise without name', () => {
    const exercise = { gif: 'gifs/BarbellSquat.gif' };
    const url = getExerciseImageUrl(exercise);
    expect(url).toBe(getFallbackUrl());
  });
  
  it('should return fallback for invalid gif path', () => {
    const exercise = { name: 'Squat', gif: '' };
    const url = getExerciseImageUrl(exercise);
    expect(url).toBe(getFallbackUrl());
  });
});

describe('parseCloudinaryUrl', () => {
  it('should parse basic Cloudinary URL', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif';
    const parsed = parseCloudinaryUrl(url);
    
    expect(parsed).toEqual({
      cloudName: 'demo',
      resourceType: 'image',
      transformations: '',
      version: 1,
      folder: 'exercises',
      publicId: 'BarbellSquat',
      extension: 'gif'
    });
  });
  
  it('should parse URL with transformations', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/w_800,dpr_auto,f_auto/v1/exercises/BarbellSquat.gif';
    const parsed = parseCloudinaryUrl(url);
    
    expect(parsed.transformations).toBe('w_800,dpr_auto,f_auto');
    expect(parsed.publicId).toBe('BarbellSquat');
  });
  
  it('should parse URL without folder', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/BarbellSquat.gif';
    const parsed = parseCloudinaryUrl(url);
    
    expect(parsed.folder).toBe('');
    expect(parsed.publicId).toBe('BarbellSquat');
  });
  
  it('should return null for invalid URL', () => {
    const parsed = parseCloudinaryUrl('https://example.com/image.gif');
    expect(parsed).toBeNull();
  });
  
  it('should return null for null input', () => {
    const parsed = parseCloudinaryUrl(null);
    expect(parsed).toBeNull();
  });
  
  it('should return null for non-string input', () => {
    const parsed = parseCloudinaryUrl(123);
    expect(parsed).toBeNull();
  });
});

describe('formatCloudinaryUrl', () => {
  it('should format basic components', () => {
    const components = {
      cloudName: 'demo',
      resourceType: 'image',
      transformations: '',
      version: 1,
      folder: 'exercises',
      publicId: 'BarbellSquat',
      extension: 'gif'
    };
    
    const url = formatCloudinaryUrl(components);
    expect(url).toBe('https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif');
  });
  
  it('should format components with transformations', () => {
    const components = {
      cloudName: 'demo',
      resourceType: 'image',
      transformations: 'w_800,dpr_auto',
      version: 1,
      folder: 'exercises',
      publicId: 'BarbellSquat',
      extension: 'gif'
    };
    
    const url = formatCloudinaryUrl(components);
    expect(url).toContain('w_800,dpr_auto');
  });
  
  it('should throw error for missing cloudName', () => {
    const components = { publicId: 'BarbellSquat' };
    expect(() => formatCloudinaryUrl(components)).toThrow('Invalid components');
  });
  
  it('should throw error for missing publicId', () => {
    const components = { cloudName: 'demo' };
    expect(() => formatCloudinaryUrl(components)).toThrow('Invalid components');
  });
});

describe('URL round-trip', () => {
  it('should parse and format back to same URL', () => {
    const originalUrl = 'https://res.cloudinary.com/demo/image/upload/w_800,dpr_auto/v1/exercises/BarbellSquat.gif';
    const parsed = parseCloudinaryUrl(originalUrl);
    const formatted = formatCloudinaryUrl(parsed);
    
    expect(formatted).toBe(originalUrl);
  });
  
  it('should handle URL without transformations', () => {
    const originalUrl = 'https://res.cloudinary.com/demo/image/upload/v1/exercises/BarbellSquat.gif';
    const parsed = parseCloudinaryUrl(originalUrl);
    const formatted = formatCloudinaryUrl(parsed);
    
    expect(formatted).toBe(originalUrl);
  });
});
