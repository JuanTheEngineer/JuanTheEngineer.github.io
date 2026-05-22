#!/usr/bin/env node

/**
 * Workout Schema Validator
 * 
 * Validates workouts.json against JSON Schema definitions.
 * Uses Ajv (Another JSON Schema Validator) for validation.
 * 
 * Usage:
 *   npm run validate
 *   node scripts/validate-workouts.js
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Initialize Ajv with strict mode and all errors
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
  strictSchema: true,
  strictNumbers: true,
  strictTypes: true,
  strictTuples: true,
  strictRequired: true
});

// Add format validation (uri, date-time, etc.)
addFormats(ajv);

/**
 * Load JSON file with error handling
 */
function loadJSON(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filepath}:`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * Format validation errors for human readability
 */
function formatErrors(errors) {
  if (!errors || errors.length === 0) return '';
  
  return errors.map(err => {
    const path = err.instancePath || 'root';
    const message = err.message || 'Unknown error';
    const params = err.params ? JSON.stringify(err.params) : '';
    
    return `   • ${path}: ${message} ${params}`;
  }).join('\n');
}

/**
 * Main validation function
 */
function validateWorkouts() {
  console.log('🔍 Validating workout schemas...\n');
  
  // Load schemas
  console.log('📋 Loading schemas...');
  const exerciseSchema = loadJSON(join(rootDir, 'schemas/exercise.schema.json'));
  const programSchema = loadJSON(join(rootDir, 'schemas/program.schema.json'));
  const workoutsSchema = loadJSON(join(rootDir, 'schemas/workouts.schema.json'));
  
  // Add schemas to Ajv
  ajv.addSchema(exerciseSchema, 'exercise.json');
  ajv.addSchema(programSchema, 'program.json');
  ajv.addSchema(workoutsSchema, 'workouts.json');
  
  console.log('   ✓ exercise.schema.json');
  console.log('   ✓ program.schema.json');
  console.log('   ✓ workouts.schema.json\n');
  
  // Load workouts data
  console.log('📦 Loading workouts.json...');
  const workouts = loadJSON(join(rootDir, 'workouts.json'));
  console.log(`   ✓ Found ${workouts.programs?.length || 0} programs\n`);
  
  // Validate workouts against schema
  console.log('✅ Validating workouts.json...');
  const validate = ajv.getSchema('workouts.json');
  const valid = validate(workouts);
  
  if (valid) {
    console.log('   ✓ All validations passed!\n');
    
    // Print summary statistics
    const totalExercises = workouts.programs.reduce((sum, program) => {
      return sum + (program.exercises?.length || 0);
    }, 0);
    
    console.log('📊 Summary:');
    console.log(`   • Programs: ${workouts.programs.length}`);
    console.log(`   • Total Exercises: ${totalExercises}`);
    console.log(`   • Avg Exercises per Program: ${(totalExercises / workouts.programs.length).toFixed(1)}`);
    
    // Check for optional fields usage
    const programsWithCloudinary = workouts.programs.reduce((sum, program) => {
      const hasCloudinary = program.exercises.some(ex => ex.cloudinaryUrl);
      return sum + (hasCloudinary ? 1 : 0);
    }, 0);
    
    if (programsWithCloudinary > 0) {
      console.log(`   • Programs with Cloudinary URLs: ${programsWithCloudinary}`);
    }
    
    console.log('\n✨ Validation complete! Your workouts.json is valid.\n');
    process.exit(0);
  } else {
    console.error('   ❌ Validation failed!\n');
    console.error('🚨 Errors found:\n');
    console.error(formatErrors(validate.errors));
    console.error('\n');
    process.exit(1);
  }
}

// Run validation
try {
  validateWorkouts();
} catch (error) {
  console.error('❌ Unexpected error during validation:');
  console.error(`   ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}
