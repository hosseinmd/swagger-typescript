# End-to-End Tests for swag-ts CLI

This directory contains comprehensive end-to-end tests that validate the `swag-ts` CLI binary by actually running it and verifying the generated output.

## Structure

All E2E tests follow a consistent naming pattern for better organization:

- **Test files**: `{testname}.test.mjs`
- **Config files**: `{testname}.config.json`
- **Output directories**: `outputs/{testname}/` (git-ignored)
- **Snapshots**: `__snapshots__/{testname}.test.mjs.snap`

## Test Suites

| Test Name       | Config File                 | Description                                   |
| --------------- | --------------------------- | --------------------------------------------- |
| `local-openapi` | `local-openapi.config.json` | Tests generation from local OpenAPI JSON file |
| `petstore3`     | `petstore3.config.json`     | Tests Petstore3 API with enum handling        |
| `slack-api`     | `slack-api.config.json`     | Tests Slack API with infinite query support   |
| `kotlin-wms`    | `kotlin-wms.config.json`    | Tests Kotlin generation for WMS API           |

## Running the Tests

```bash
# Run all E2E tests
npm test __tests__/e2e/

# Run specific test
npm test __tests__/e2e/local-openapi.test.mjs

# Update snapshots
npm test __tests__/e2e/ --updateSnapshot

# Run with test name pattern
npm test __tests__/e2e/ --testNamePattern="should generate"
```

## Output Management

- All test outputs are written to the `outputs/` directory
- The `outputs/` directory is git-ignored to keep the repository clean
- Each test has its own subdirectory within `outputs/`
- Output directories are automatically cleaned before and after each test

## Test Coverage

The E2E tests cover:

1. **TypeScript Generation**

   - React hooks generation
   - TypeScript type definitions
   - Service layer generation
   - Configuration file creation

2. **Kotlin Generation**

   - Kotlin class generation
   - Package structure handling
   - API client generation

3. **Configuration Validation**

   - Local file input
   - Remote URL fetching
   - Custom output directories
   - Language-specific options

4. **Feature Tests**

   - React hooks (`reactHooks: true`)
   - JSON preservation (`keepJson: true`)
   - Enum handling (`generateEnumAsType`)
   - Infinite query support (`useInfiniteQuery`)

5. **Error Handling**
   - Invalid configuration files
   - Network connectivity issues
   - Missing dependencies

## Snapshot Testing

The snapshot tests capture the exact content of generated files and serve as regression tests:

### Generated Files Captured

- **TypeScript files**: `services.ts`, `types.ts`, `hooks.ts`, `config.ts`
- **Configuration files**: `httpRequest.ts`, `hooksConfig.ts`
- **OpenAPI specification**: `swagger.json` (normalized)

### When to Update Snapshots

Update snapshots when you intentionally change the code generation logic:

```bash
# Update specific test snapshots
npm test __tests__/e2e/local-openapi.test.mjs -u

# Update all e2e snapshots
npm test __tests__/e2e/ -u
```

### Snapshot Benefits

- **Regression Detection**: Automatically catch unintended changes
- **Code Review**: Easily see what changed in generated output during PRs
- **Version Consistency**: Ensure output remains consistent across versions
- **Quality Assurance**: Validate generated code structure and content

## Test Configuration Examples

### TypeScript with React Hooks

```json
{
  "$schema": "../../schema/v6.json",
  "url": "https://petstore3.swagger.io/api/v3/openapi.json",
  "dir": "./__tests__/e2e/outputs/petstore3",
  "language": "typescript",
  "keepJson": true,
  "reactHooks": true,
  "generateEnumAsType": false
}
```

### Kotlin Generation

```json
{
  "$schema": "../../schema/v6.json",
  "url": "https://api.example.com/openapi.json",
  "dir": "./__tests__/e2e/outputs/kotlin-wms",
  "language": "kotlin",
  "kotlinPackage": "com.example.api",
  "ignore": {
    "headerParams": ["Accept", "Content-Type"]
  }
}
```

## Test Utilities

The `utils.mjs` file provides shared utilities for all tests:

- `cleanOutputDir(configPath)` - Clean up output directories
- `generate(configPath)` - Run CLI and capture generated files
- `runCommand(args)` - Execute CLI with custom arguments
