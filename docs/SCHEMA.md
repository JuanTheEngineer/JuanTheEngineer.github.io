# Workout Schema Documentation

## Overview

This project uses **JSON Schema** to define and validate the structure of workout data. The schema ensures data consistency, catches errors early, and serves as living documentation for the data model.

## Why JSON Schema?

- ✅ **Validation**: Catch data errors before they reach production
- ✅ **Documentation**: Self-documenting data structure
- ✅ **IDE Support**: Autocomplete and validation in editors
- ✅ **Type Safety**: Without TypeScript overhead
- ✅ **Agile-Friendly**: Easy to evolve as requirements change

## Schema Files

All schemas are located in the `schemas/` directory:

```
schemas/
├── exercise.schema.json    # Individual exercise definition
├── program.schema.json     # Workout program (composable unit)
└── workouts.schema.json    # Root schema for workouts.json
```

## Data Model

### Hierarchy

```
Workouts (Root)
└── Programs (Array)
    └── Exercises (Array)
        ├── Sub-Exercise (Optional, for supersets)
        └── Compound Exercises (Optional, for complex sets)
```

### Key Concepts

1. **Programs are the composable unit**: Programs are what users save, display, and share—not individual exercises.
2. **Exercises are flexible**: Support string-based reps/sets (e.g., "10-12", "AMRAP", "Varies") to match real-world workout notation.
3. **Nested structures**: Support supersets (subExercise) and compound sets (compoundExercises array).
4. **Media flexibility**: Support local paths (gif) and CDN URLs (cloudinaryUrl).

## Schema Definitions

### Exercise Schema

**File**: `schemas/exercise.schema.json`

An exercise represents a single movement within a workout program.

**Required Fields**:
- `name` (string): Display name (e.g., "Exercise 1: DB Squat Jumps")
- `gif` (string): Local path to media file (e.g., "gifs/FireHydrant.gif")
- `reps` (string): Number of repetitions (flexible format)
- `sets` (string): Number of sets (flexible format)
- `repUnits` (enum): Unit of measurement ("reps", "secs", "min", "yd", "rep")

**Optional Fields**:
- `cloudinaryUrl` (string, uri): CDN URL for the exercise media
- `mediaType` (enum): Type of media ("gif", "video", "image")
- `note` (string): Additional instructions or form tips
- `subExercise` (Exercise): Nested exercise for supersets
- `compoundExercises` (array): Array of exercises for complex compound sets

**Example**:
```json
{
  "name": "Exercise 1: DB Squat Jumps",
  "gif": "gifs/DBSquatJumps.gif",
  "cloudinaryUrl": "https://res.cloudinary.com/.../DBSquatJumps.gif",
  "reps": "4",
  "sets": "6",
  "note": "Weight: 10 lbs",
  "repUnits": "reps"
}
```

**Superset Example**:
```json
{
  "name": "Exercise 2: DB RDL & Split Squats",
  "gif": "gifs/DBRDLs.gif",
  "reps": "10",
  "sets": "4",
  "note": "Meant to be a Super Set.",
  "repUnits": "reps",
  "subExercise": {
    "gif": "gifs/SplitSquats.gif",
    "reps": "12",
    "sets": "4",
    "note": "Controlled on the way down. Meant to be a Super Set.",
    "repUnits": "reps"
  }
}
```

**Compound Set Example**:
```json
{
  "name": "Exercise 3: KB Swings, Box Depth Drops, Broad Jumps",
  "compoundExercises": [
    {
      "reps": "4",
      "repUnits": "reps",
      "sets": "10",
      "gif": "gifs/KBSwings.gif",
      "note": "Squat on each rep. Meant to be a Super Set."
    },
    {
      "reps": "2",
      "repUnits": "reps",
      "sets": "4",
      "gif": "gifs/BoxDepthDrop.gif",
      "note": "You may add a vertical drop. Meant to be a Super Set."
    },
    {
      "reps": "1",
      "repUnits": "rep",
      "sets": "4",
      "gif": "gifs/BroadJumps.gif",
      "note": "Jump as far as you can. Meant to be a Super Set."
    }
  ]
}
```

### Program Schema

**File**: `schemas/program.schema.json`

A program is a complete workout routine—the composable unit for saving, displaying, and sharing.

**Required Fields**:
- `id` (string, kebab-case): Unique identifier (e.g., "agility_lower_1-1")
- `title` (string): Display title (e.g., "Agility Lower Body Program 1.1")
- `requirements` (string): Equipment or prerequisites
- `exercises` (array): Array of Exercise objects

**Optional Fields**:
- `description` (string): Detailed description
- `category` (string): Program category (e.g., "agility", "ppl", "strength")
- `difficulty` (enum): "beginner", "intermediate", "advanced"
- `duration` (integer): Estimated duration in minutes
- `tags` (array): Tags for search and filtering
- `author` (string): Author or creator
- `createdAt` (string, date-time): ISO 8601 timestamp
- `updatedAt` (string, date-time): ISO 8601 timestamp

**Example**:
```json
{
  "id": "agility_lower_1-1",
  "title": "Agility Lower Body Program 1.1",
  "requirements": "Dumbbells, Exercise Band, Swiss Ball, Trap Bar",
  "category": "agility",
  "difficulty": "intermediate",
  "duration": 60,
  "tags": ["lower-body", "agility", "strength"],
  "exercises": [
    {
      "name": "Warm Up 1: Decline Pistols",
      "gif": "gifs/DeclinePistols.gif",
      "reps": "10",
      "sets": "4",
      "note": "Two seconds down, one second up.",
      "repUnits": "reps"
    }
  ]
}
```

### Workouts Schema

**File**: `schemas/workouts.schema.json`

The root schema for `workouts.json`—a collection of workout programs.

**Required Fields**:
- `programs` (array): Array of Program objects

**Optional Fields**:
- `version` (string): Schema version for future migrations (e.g., "1.0.0")

**Example**:
```json
{
  "version": "1.0.0",
  "programs": [
    {
      "id": "agility_lower_1-1",
      "title": "Agility Lower Body Program 1.1",
      "requirements": "Dumbbells, Exercise Band",
      "exercises": [...]
    },
    {
      "id": "ppl_push_day_1-0",
      "title": "PPL 3-Day Rotation: Push Day 1",
      "requirements": "Barbells, Bench, Dumbbells",
      "exercises": [...]
    }
  ]
}
```

## Validation

### Running Validation

Validate your `workouts.json` file:

```bash
npm run validate
```

This will:
1. Load all schema files
2. Validate `workouts.json` against the schemas
3. Report any errors with detailed messages
4. Display summary statistics

### Pre-Commit Validation

Automatically validate before committing:

```bash
npm run precommit
```

Or add to your git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run validate
```

### Example Output

**Success**:
```
🔍 Validating workout schemas...

📋 Loading schemas...
   ✓ exercise.schema.json
   ✓ program.schema.json
   ✓ workouts.schema.json

📦 Loading workouts.json...
   ✓ Found 12 programs

✅ Validating workouts.json...
   ✓ All validations passed!

📊 Summary:
   • Programs: 12
   • Total Exercises: 96
   • Avg Exercises per Program: 8.0

✨ Validation complete! Your workouts.json is valid.
```

**Failure**:
```
🔍 Validating workout schemas...

📋 Loading schemas...
   ✓ exercise.schema.json
   ✓ program.schema.json
   ✓ workouts.schema.json

📦 Loading workouts.json...
   ✓ Found 12 programs

✅ Validating workouts.json...
   ❌ Validation failed!

🚨 Errors found:

   • /programs/0/exercises/2: must have required property 'repUnits'
   • /programs/1/id: must match pattern "^[a-z0-9_-]+$"
   • /programs/3/exercises/0/gif: must match pattern "^gifs/[A-Za-z0-9_-]+\.(gif|jpg|png)$"
```

## Design Decisions

### Why String-Based Reps/Sets?

Real-world workouts use flexible notation:
- "10-12" (range)
- "AMRAP" (as many reps as possible)
- "100 Total" (cumulative)
- "Varies" (depends on fatigue)
- "15 → 1" (decrementing)

Using strings preserves this flexibility while remaining human-readable.

### Why Programs as Composable Units?

Users think in terms of **complete workouts**, not individual exercises:
- "I want to do the Agility Lower Body workout"
- "Share this Push Day routine with my friend"
- "Save my PPL program for later"

Programs are the natural unit for saving, displaying, and sharing.

### Why Support Nested Exercises?

Real workouts include:
- **Supersets**: Two exercises back-to-back (subExercise)
- **Compound Sets**: Three or more exercises in sequence (compoundExercises)

The schema supports both patterns without forcing a single approach.

### Why Both `gif` and `cloudinaryUrl`?

- **Migration Path**: Existing data uses local `gif` paths
- **Future-Proof**: New data can use `cloudinaryUrl` for CDN delivery
- **Flexibility**: Support both during transition period
- **Fallback**: If CDN fails, fall back to local path

## Evolution & Migration

### Adding New Fields

To add optional fields:

1. Update the schema file (e.g., `exercise.schema.json`)
2. Add the field to the `properties` object
3. Do NOT add to `required` array (unless truly required)
4. Run validation to ensure existing data still passes

**Example**: Adding `difficulty` to exercises:

```json
{
  "properties": {
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard"],
      "description": "Exercise difficulty level"
    }
  }
}
```

### Schema Versioning

When making breaking changes:

1. Increment the `version` field in `workouts.json`
2. Create a migration script to update existing data
3. Document the changes in this file

**Example Migration**:
```javascript
// scripts/migrate-v1-to-v2.js
// Migrates from version 1.0.0 to 2.0.0
// Breaking change: repUnits now required for all exercises
```

## Best Practices

### For Developers

1. **Always validate before committing**: Run `npm run validate`
2. **Keep schemas in sync**: Update schemas when data structure changes
3. **Use descriptive field names**: Prefer clarity over brevity
4. **Add examples**: Include examples in schema descriptions
5. **Document breaking changes**: Update this file when schemas change

### For Data Entry

1. **Follow the schema**: Use the validation script to catch errors
2. **Use consistent naming**: Follow existing patterns (e.g., PascalCase for GIF names)
3. **Provide complete data**: Fill in all required fields
4. **Add helpful notes**: Use the `note` field for form tips and instructions
5. **Test with validation**: Run validation after adding new programs

## IDE Integration

### VS Code

Add to `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["workouts.json"],
      "url": "./schemas/workouts.schema.json"
    }
  ]
}
```

This enables:
- ✅ Autocomplete for field names
- ✅ Inline validation errors
- ✅ Hover documentation
- ✅ Schema-aware formatting

## Troubleshooting

### Common Validation Errors

**Error**: `must have required property 'repUnits'`
- **Fix**: Add `"repUnits": "reps"` (or "secs", "min", "yd", "rep")

**Error**: `must match pattern "^gifs/[A-Za-z0-9_-]+\.(gif|jpg|png)$"`
- **Fix**: Ensure gif path starts with "gifs/" and has valid extension

**Error**: `must match pattern "^[a-z0-9_-]+$"`
- **Fix**: Program IDs must be lowercase kebab-case (e.g., "agility_lower_1-1")

**Error**: `must be string`
- **Fix**: Ensure reps/sets are strings, not numbers (e.g., "10" not 10)

### Getting Help

- Check the schema files in `schemas/` for field definitions
- Run `npm run validate` for detailed error messages
- Review examples in this document
- Check existing programs in `workouts.json` for patterns

## Future Enhancements

Potential schema improvements for V2:

- [ ] Add `videoUrl` field for video demonstrations
- [ ] Add `muscleGroups` array for filtering
- [ ] Add `equipment` array (structured, not string)
- [ ] Add `restTime` field for rest periods
- [ ] Add `tempo` field for eccentric/concentric timing
- [ ] Add `progressionPath` for exercise variations
- [ ] Add `personalRecords` for tracking PRs
- [ ] Add `workoutHistory` for session tracking

---

## Summary

This schema system provides:
- ✅ **Data validation** to catch errors early
- ✅ **Living documentation** that stays in sync with code
- ✅ **IDE support** for better developer experience
- ✅ **Flexibility** to evolve as requirements change
- ✅ **Type safety** without TypeScript overhead

**Remember**: The schema serves the data, not the other way around. Keep it flexible, keep it simple, and evolve it as the project grows.
