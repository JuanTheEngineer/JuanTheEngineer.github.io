# Requirements Document

## Introduction

This feature migrates 82 exercise GIF files from the local git repository to Cloudinary CDN. The migration reduces repository size by ~50MB, improves image loading performance through CDN delivery and automatic optimization, and establishes infrastructure for future video support. The implementation follows the 150-150-CR commit discipline with comprehensive testing using Vitest.

## Glossary

- **Migration_Script**: The Node.js script that uploads exercise GIF files from local storage to Cloudinary CDN
- **Image_URL_Helper**: The JavaScript module that generates Cloudinary URLs with transformations and fallback logic
- **Workout_Database**: The workouts.json file containing exercise programs and GIF references
- **Exercise_GIF**: An animated GIF file demonstrating proper exercise form (82 total files, ~50MB)
- **Cloudinary_CDN**: The cloud-based content delivery network that hosts and optimizes exercise media
- **UI_Component**: The HTML/JavaScript code that displays exercise images to users
- **Performance_Monitor**: The module that tracks image loading times and errors
- **Fallback_Image**: The placeholder image displayed when a Cloudinary image fails to load
- **Testing_Infrastructure**: The Vitest framework and test files that validate functionality

## Requirements

### Requirement 1: Testing Infrastructure Setup

**User Story:** As a developer, I want a testing framework in place, so that I can validate the Cloudinary migration with automated tests.

#### Acceptance Criteria

1. THE Testing_Infrastructure SHALL use Vitest as the test runner
2. THE Testing_Infrastructure SHALL include a configuration file defining test environment settings
3. THE Testing_Infrastructure SHALL provide test execution commands for single-run and watch modes
4. THE Testing_Infrastructure SHALL include setup files for test initialization
5. THE Testing_Infrastructure SHALL be documented in the project README

### Requirement 2: Cloudinary Upload Script

**User Story:** As a developer, I want an automated upload script, so that I can migrate all 82 exercise GIFs to Cloudinary efficiently.

#### Acceptance Criteria

1. THE Migration_Script SHALL accept Cloudinary API credentials from environment variables
2. WHEN the Migration_Script is executed, THE Migration_Script SHALL upload all GIF files from the gifs directory to Cloudinary
3. THE Migration_Script SHALL organize uploaded files in a folder named "exercises" on Cloudinary
4. WHEN an upload completes, THE Migration_Script SHALL log the Cloudinary URL for each file
5. THE Migration_Script SHALL create a migration log file mapping local filenames to Cloudinary URLs
6. IF an upload fails, THEN THE Migration_Script SHALL log the error and continue with remaining files
7. THE Migration_Script SHALL include tests validating URL generation and error handling logic

### Requirement 3: Image URL Helper Functions

**User Story:** As a developer, I want URL helper functions, so that I can generate Cloudinary URLs with transformations and fallback logic.

#### Acceptance Criteria

1. THE Image_URL_Helper SHALL generate Cloudinary URLs from exercise names
2. THE Image_URL_Helper SHALL support responsive image transformations with width and DPR parameters
3. THE Image_URL_Helper SHALL support automatic format conversion using the f_auto parameter
4. THE Image_URL_Helper SHALL return a Fallback_Image URL when the exercise name is null or undefined
5. THE Image_URL_Helper SHALL return a Fallback_Image URL when the Cloudinary URL is invalid
6. FOR ALL valid exercise names, THE Image_URL_Helper SHALL generate URLs matching the pattern https://res.cloudinary.com/{cloud_name}/image/upload/v1/exercises/{exercise_name}.gif
7. THE Image_URL_Helper SHALL include tests covering URL generation, transformations, and fallback scenarios

### Requirement 4: Cloudinary Media Upload

**User Story:** As a developer, I want all exercise GIFs uploaded to Cloudinary, so that they are available via CDN before updating application references.

#### Acceptance Criteria

1. THE Migration_Script SHALL upload all 82 Exercise_GIF files to the Cloudinary_CDN
2. WHEN the upload completes, THE Migration_Script SHALL create a migration log file containing all Cloudinary URLs
3. THE migration log file SHALL map each local filename to its corresponding Cloudinary URL
4. THE Migration_Script SHALL verify that all 82 files were uploaded successfully
5. IF any upload fails, THEN THE Migration_Script SHALL report which files failed and why

### Requirement 5: Incremental Workout Database Migration

**User Story:** As a developer, I want to migrate workout database references incrementally, so that I can test the change safely before completing the full migration.

#### Acceptance Criteria

1. THE Workout_Database SHALL be updated in two commits following the 150-150-CR rule
2. THE first commit SHALL update GIF references for the first 20 exercises to use Cloudinary URLs
3. THE second commit SHALL update GIF references for the remaining 62 exercises to use Cloudinary URLs
4. FOR ALL exercises in the Workout_Database, THE gif field SHALL contain a valid Cloudinary URL after migration
5. THE Workout_Database SHALL remain valid JSON after each commit
6. WHEN an exercise is loaded, THE application SHALL display the GIF from Cloudinary_CDN

### Requirement 6: UI Integration with Helper Functions

**User Story:** As a user, I want exercise images to load from Cloudinary with fallback support, so that I always see a demonstration even if the CDN fails.

#### Acceptance Criteria

1. THE UI_Component SHALL use the Image_URL_Helper to generate all exercise image URLs
2. WHEN an exercise image fails to load, THE UI_Component SHALL display the Fallback_Image
3. THE UI_Component SHALL implement lazy loading for exercise images
4. THE UI_Component SHALL use responsive image URLs with appropriate width and DPR transformations
5. THE UI_Component SHALL log image loading errors to the console for debugging
6. THE UI_Component SHALL include tests validating fallback behavior and URL generation integration

### Requirement 7: Local GIF File Removal

**User Story:** As a developer, I want local GIF files removed from the repository, so that the repository size is reduced by ~50MB.

#### Acceptance Criteria

1. WHEN all Workout_Database references use Cloudinary URLs, THE Migration_Script SHALL delete all files in the gifs directory
2. THE git repository size SHALL be reduced by approximately 50MB after the deletion commit
3. THE application SHALL continue to display all exercise images after local files are removed
4. THE deletion SHALL be performed in a separate commit following the 150-150-CR rule

### Requirement 8: Performance Monitoring

**User Story:** As a developer, I want to monitor image loading performance, so that I can identify and resolve performance issues.

#### Acceptance Criteria

1. THE Performance_Monitor SHALL track image load times for each exercise GIF
2. THE Performance_Monitor SHALL track image loading errors with error messages
3. WHEN an image load time exceeds 3 seconds, THE Performance_Monitor SHALL log a warning
4. THE Performance_Monitor SHALL calculate and report average image load time
5. THE Performance_Monitor SHALL report the percentage of successful image loads
6. THE Performance_Monitor SHALL include tests validating timing calculations and error tracking

### Requirement 9: Cloudinary URL Parser and Pretty Printer

**User Story:** As a developer, I want to parse and format Cloudinary URLs, so that I can validate URL structure and generate human-readable representations.

#### Acceptance Criteria

1. WHEN a valid Cloudinary URL is provided, THE Image_URL_Helper SHALL parse it into a structured object containing cloud_name, resource_type, transformations, version, and public_id
2. WHEN an invalid Cloudinary URL is provided, THE Image_URL_Helper SHALL return a descriptive error
3. THE Image_URL_Helper SHALL format structured Cloudinary URL objects back into valid URL strings
4. FOR ALL valid Cloudinary URL objects, parsing then formatting then parsing SHALL produce an equivalent object (round-trip property)
5. THE Image_URL_Helper SHALL include tests validating the round-trip property with at least 100 randomly generated valid Cloudinary URLs

### Requirement 10: Migration Rollback Support

**User Story:** As a developer, I want rollback capability, so that I can revert to local GIFs if the Cloudinary migration fails.

#### Acceptance Criteria

1. THE Migration_Script SHALL create a backup of the original Workout_Database before any modifications
2. THE Migration_Script SHALL provide a rollback command that restores the Workout_Database from backup
3. WHEN the rollback command is executed, THE Workout_Database SHALL be restored to its pre-migration state
4. THE rollback command SHALL verify that local GIF files still exist before restoring references
5. IF local GIF files are missing, THEN THE rollback command SHALL report an error and provide instructions for manual recovery
