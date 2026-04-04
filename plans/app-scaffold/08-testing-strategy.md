# Testing Strategy: BlendSDK Application Scaffold Generator

> **Document**: 08-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

- Unit tests: Core modules (renderer, generator, writer) — high coverage
- Integration test: Full scaffold generation in temp directory
- No E2E tests needed (this is a code generator, not a running service)

### Test Framework

- **vitest** — ESM-native, fast, TypeScript support built-in
- Tests live in `src/__tests__/`

## Test Categories

### Unit Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `renderer.test.ts` | Template rendering engine | High |
| `generator.test.ts` | File list building, template variable construction | High |
| `writer.test.ts` | File writing, conflict detection, dry-run | High |

### Unit Test Details

#### `renderer.test.ts`

| Test Case | Description |
|-----------|-------------|
| Replaces single placeholder | `{{NAME}}` → `MyApp` |
| Replaces multiple placeholders | Multiple `{{X}}` in same template |
| Leaves unmatched placeholders | `{{UNKNOWN}}` stays as-is (may be bash/YAML vars) |
| Handles empty template | Returns empty string |
| Handles template with no placeholders | Returns original content |
| Handles empty vars | Returns template unchanged |
| Handles repeated placeholder | Same key used multiple times |

#### `generator.test.ts`

| Test Case | Description |
|-----------|-------------|
| Builds correct template vars from minimal answers | Name, scope, ports |
| Builds correct template vars with all features enabled | OIDC, i18n, mailer, file upload |
| Builds correct file list — minimal (no optionals) | Core files only |
| Builds correct file list — all features enabled | Includes OIDC, i18n, mailer partials |
| File list always includes codegen | Codegen is never optional |
| Template vars derive PROJECT_NAME_LOWER correctly | Handles spaces, special chars |
| Template vars include correct partial content for OIDC | OIDC plugin import and registration |
| Template vars include correct partial content for mailer | Mailer import, Docker Mailpit service |

#### `writer.test.ts`

| Test Case | Description |
|-----------|-------------|
| Creates new file successfully | Returns 'created' |
| Creates parent directories | Nested paths work |
| Skips existing file (no force) | Returns 'skipped' |
| Overwrites existing file (force) | Returns 'overwritten' |
| Dry-run mode never writes | Returns 'dry-run', file doesn't exist |
| Sets executable permission | Shell scripts are chmod +x |

### Integration Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `integration.test.ts` | Full scaffold generation in temp dir | High |

#### `integration.test.ts`

| Test Case | Description |
|-----------|-------------|
| Generates complete project with minimal config | All core files exist |
| Generates project with all features enabled | All optional files exist |
| Generated root package.json is valid JSON | Parseable, has correct fields |
| Generated turbo.json is valid JSON | Parseable, has correct tasks |
| Generated webapi package.json has blendsdk | Dependency present |
| Generated webclient package.json has FluentUI v9 | `@fluentui/react-components` present |
| Generated codegen package.json has blendsdk | Dependency present |
| Generated .gitignore files exist at all levels | Root, shared, webapi, webclient, codegen |
| Generated webapi index.ts has correct port | Port matches user input |
| Generated vite.config.ts has correct proxy target | Proxy points to backend port |
| Placeholder replacement works end-to-end | No `{{` remaining in output (except intentional ones) |

## Test Data

### Fixtures

```typescript
// Minimal answers for testing
const MINIMAL_ANSWERS: ScaffoldAnswers = {
  name: 'TestApp',
  scope: '@testapp',
  description: 'Test application',
  backendPort: '4000',
  frontendPort: '5173',
  dbName: 'testapp',
  dbPort: '5432',
  redisPort: '6379',
  oidc: false,
  i18n: false,
  mailer: false,
  fileUpload: false,
  blueGreen: false,
};

// Full-featured answers for testing
const FULL_ANSWERS: ScaffoldAnswers = {
  ...MINIMAL_ANSWERS,
  oidc: true,
  i18n: true,
  mailer: true,
  fileUpload: true,
  blueGreen: false, // Don't invoke external installer in tests
};
```

### Mock Requirements

- No mocks needed for renderer (pure function)
- No mocks needed for generator (reads files from templates/)
- Writer tests use `os.tmpdir()` for isolated file operations
- Integration tests use `os.tmpdir()` for full generation

## Verification Checklist

- [ ] All unit tests pass via `vitest run`
- [ ] Integration test generates complete project
- [ ] No test files exceed 200 lines
- [ ] Tests are organized by module
- [ ] Each test has a descriptive name
