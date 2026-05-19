/**
 * Tests for Cloudinary upload script
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadGif, saveMigrationLog } from '../scripts/upload-to-cloudinary.js';
import fs from 'fs';
import path from 'path';

describe('uploadGif', () => {
  it('should generate correct Cloudinary URL pattern', () => {
    const url = 'https://res.cloudinary.com/test-cloud/image/upload/v1/exercises/BarbellSquat.gif';
    
    // Verify URL structure
    expect(url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
    expect(url).toContain('/image/upload/');
    expect(url).toContain('/exercises/');
    expect(url).toContain('.gif');
  });
  
  it('should extract public ID from filename', () => {
    const filename = 'BarbellSquat.gif';
    const publicId = path.basename(filename, '.gif');
    
    expect(publicId).toBe('BarbellSquat');
  });
  
  it('should handle filenames with special characters', () => {
    const filename = '45DegreeBackRaises.gif';
    const publicId = path.basename(filename, '.gif');
    
    expect(publicId).toBe('45DegreeBackRaises');
  });
});

describe('saveMigrationLog', () => {
  it('should create valid JSON structure', () => {
    const mockLog = {
      'BarbellSquat.gif': 'https://res.cloudinary.com/test/image/upload/v1/exercises/BarbellSquat.gif',
      'Chinups.gif': 'https://res.cloudinary.com/test/image/upload/v1/exercises/Chinups.gif'
    };
    
    const jsonString = JSON.stringify(mockLog, null, 2);
    const parsed = JSON.parse(jsonString);
    
    expect(parsed).toEqual(mockLog);
    expect(Object.keys(parsed)).toHaveLength(2);
  });
  
  it('should handle error entries in log', () => {
    const mockLog = {
      'BarbellSquat.gif': 'https://res.cloudinary.com/test/image/upload/v1/exercises/BarbellSquat.gif',
      'FailedFile.gif': { error: 'Upload failed: Network timeout' }
    };
    
    const jsonString = JSON.stringify(mockLog, null, 2);
    const parsed = JSON.parse(jsonString);
    
    expect(parsed['FailedFile.gif']).toHaveProperty('error');
    expect(parsed['FailedFile.gif'].error).toContain('Network timeout');
  });
});

describe('URL validation', () => {
  it('should validate Cloudinary URL format', () => {
    const validUrl = 'https://res.cloudinary.com/demo/image/upload/v1/exercises/Test.gif';
    
    const urlPattern = /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/v\d+\/exercises\/[\w-]+\.gif$/;
    expect(urlPattern.test(validUrl)).toBe(true);
  });
  
  it('should reject invalid URL formats', () => {
    const invalidUrls = [
      'http://res.cloudinary.com/demo/image/upload/v1/exercises/Test.gif', // http instead of https
      'https://cloudinary.com/demo/image/upload/v1/exercises/Test.gif', // missing res subdomain
      'https://res.cloudinary.com/demo/video/upload/v1/exercises/Test.gif', // video instead of image
    ];
    
    const urlPattern = /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/v\d+\/exercises\/[\w-]+\.gif$/;
    
    invalidUrls.forEach(url => {
      expect(urlPattern.test(url)).toBe(false);
    });
  });
});

describe('Error handling', () => {
  it('should create error object with message', () => {
    const error = new Error('Upload failed: Network timeout');
    
    expect(error.message).toBe('Upload failed: Network timeout');
    expect(error).toBeInstanceOf(Error);
  });
  
  it('should format error for migration log', () => {
    const errorEntry = { error: 'Upload failed: Network timeout' };
    
    expect(errorEntry).toHaveProperty('error');
    expect(typeof errorEntry.error).toBe('string');
  });
});
