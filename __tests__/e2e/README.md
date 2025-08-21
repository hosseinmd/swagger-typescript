# End-to-End Tests for swag-ts CLI

This directory contains comprehensive end-to-end tests that validate the `swag-ts` CLI binary by actually running it and verifying the generated output.

## Running the Tests

```bash
# Run E2E tests only
yarn test:e2e

# Run snapshot tests only
yarn test:snapshots

# Run all E2E tests (both regular and snapshot)
yarn test:e2e:all

# Run all tests including E2E
yarn test
```

## Test Coverage

The E2E tests cover:

1. **Configuration Tests**

   - Default configuration usage
   - Custom configuration files
   - Missing configuration error handling

2. **Input Source Tests**

   - Remote OpenAPI v3 URL fetching
   - Local mode with existing files
   - Local mode error handling

3. **Feature Tests**

   - React hooks generation
   - JSON file preservation (keepJson option)

4. **Error Handling Tests**

   - Invalid URL handling
   - Network error scenarios

5. **File Generation Validation**

   - Generated file structure
   - Content validation
   - TypeScript syntax verification

6. **Snapshot Testing**
   - Regression testing for generated file content
   - Consistent output validation across versions
   - File size and structure monitoring

## Test Files

- `bin.e2e.test.mjs` - Main E2E test suite with snapshot validation
- `bin.snapshot.test.mjs` - Dedicated snapshot tests for generated files
- `test-config.json` - Test configuration for Petstore API
- `snapshot-config.json` - Configuration for snapshot tests (auto-generated)
- `output/` - Generated output directory (created during tests)
- `snapshot-output/` - Generated output directory for snapshot tests
- `__snapshots__/` - Jest snapshot files for regression testing

## Test Configuration

The tests use the Petstore OpenAPI specification from:

- URL: `https://petstore3.swagger.io/api/v3/openapi.json`
- Language: TypeScript
- Features: React hooks, JSON preservation

## Test Timeout

Each test has a 30-second timeout to handle network operations and code generation.

## Cleanup

Tests automatically clean up generated files after each test run.

## Snapshot Testing

The snapshot tests capture the exact content of generated files and store them in the `__snapshots__/` directory. These snapshots serve as a baseline for future test runs to detect any unintended changes in the generated code.

### When to Update Snapshots

Update snapshots when you intentionally change the code generation logic:

```bash
# Update snapshots for snapshot tests
yarn test:snapshots -u

# Update snapshots for E2E tests
yarn test:e2e -u

# Update all snapshots
yarn test:e2e:all -u
```

### What Gets Snapshots

- **Generated TypeScript files**: services.ts, types.ts, hooks.ts, config.ts
- **Configuration files**: httpRequest.ts, hooksConfig.ts
- **OpenAPI specification**: swagger.json (normalized)
- **File metrics**: Line counts, character counts, structure validation

### Snapshot Benefits

- **Regression Detection**: Automatically catch unintended changes
- **Code Review**: Easily see what changed in generated output during PRs
- **Version Consistency**: Ensure output remains consistent across tool versions
- **Structure Validation**: Monitor file sizes and structural changes over time
