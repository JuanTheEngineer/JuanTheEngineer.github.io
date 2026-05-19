# Testing Infrastructure

This project uses [Vitest](https://vitest.dev/) as the testing framework.

## Setup

Install dependencies:

```bash
npm install
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.js           # Global test setup (runs before all tests)
├── setup.test.js      # Tests to verify Vitest is working
├── upload-script.test.js    # Tests for Cloudinary upload script
├── image-urls.test.js       # Tests for URL helper functions
└── ui-integration.test.js   # Tests for UI integration
```

## Writing Tests

Example test file:

```javascript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory after running:

```bash
npm run test:coverage
```

Open `coverage/index.html` in a browser to view the detailed coverage report.

## Environment Variables

Test environment variables are set in `tests/setup.js`:

- `CLOUDINARY_CLOUD_NAME`: Test cloud name
- `CLOUDINARY_API_KEY`: Test API key
- `CLOUDINARY_API_SECRET`: Test API secret

These are mock values for testing and should not be used in production.
