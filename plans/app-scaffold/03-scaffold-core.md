# Scaffold Core: TypeScript Source

> **Document**: 03-scaffold-core.md
> **Parent**: [Index](00-index.md)

## Overview

The scaffold core is the TypeScript source code that powers the generator. It consists of six modules, each with a single responsibility, bundled into a single `scaffold.js` via esbuild.

## Architecture

```
src/
├── index.ts          # Main entry: orchestrates the full flow
├── types.ts          # TypeScript interfaces and constants
├── prompts.ts        # Interactive readline-based Q&A
├── renderer.ts       # Template rendering engine ({{PLACEHOLDER}})
├── generator.ts      # File generation orchestrator (builds file list, assembles content)
├── writer.ts         # File writer with conflict detection
└── __tests__/
    ├── renderer.test.ts
    ├── generator.test.ts
    └── writer.test.ts
```

## Implementation Details

### Module: `types.ts`

Defines all configuration types, defaults, and constants.

```typescript
/** User answers from interactive prompts or CLI flags */
export interface ScaffoldAnswers {
  name: string;            // Project name (e.g., "CastingAppST")
  scope: string;           // Package scope (e.g., "@castingappst")
  description: string;     // Project description
  backendPort: string;     // Backend port (e.g., "4000")
  frontendPort: string;    // Frontend dev port (e.g., "5173")
  dbName: string;          // Database name
  dbPort: string;          // Database host port mapping
  redisPort: string;       // Redis host port mapping
  oidc: boolean;           // Include OIDC auth plugin
  i18n: boolean;           // Include i18n support
  mailer: boolean;         // Include email service
  fileUpload: boolean;     // Include file upload support
  blueGreen: boolean;      // Run blue-green scaffold after
}

/** CLI flags parsed from command-line arguments */
export interface ScaffoldFlags {
  name?: string;
  scope?: string;
  description?: string;
  port?: string;
  frontendPort?: string;
  dbName?: string;
  dbPort?: string;
  redisPort?: string;
  oidc?: boolean;
  i18n?: boolean;
  mailer?: boolean;
  fileUpload?: boolean;
  blueGreen?: boolean;
  force?: boolean;
  dryRun?: boolean;
  help?: boolean;
}

/** Template variables for rendering */
export interface TemplateVars {
  [key: string]: string;
}

/** File generation result */
export interface FileResult {
  dest: string;
  status: 'created' | 'overwritten' | 'skipped' | 'dry-run';
}

/** Default values */
export const DEFAULTS = {
  backendPort: '4000',
  frontendPort: '5173',
  dbPort: '5432',
  redisPort: '6379',
} as const;
```

### Module: `prompts.ts`

Interactive readline-based prompts. Uses only Node.js `readline` module.

**Functions:**
- `createRL(): readline.Interface` — Creates readline interface
- `ask(rl, question, defaultValue?): Promise<string>` — Text input with default
- `confirm(rl, question, defaultYes?): Promise<boolean>` — Yes/no confirmation
- `choose(rl, question, options, defaultIndex?): Promise<number>` — Multiple choice
- `runInteractivePrompts(): Promise<ScaffoldAnswers>` — Full interactive flow
- `answersFromFlags(flags): ScaffoldAnswers` — Build answers from CLI flags

**Interactive flow:**
```
── Project Configuration ─────────────────────
  Project name [dirname]:
  Package scope [@lowercase-name]:
  Description []:

── Backend Configuration ─────────────────────
  Backend port [4000]:
  Database name [lowercase-name]:
  Database host port [5432]:
  Redis host port [6379]:

── Frontend Configuration ────────────────────
  Frontend dev port [5173]:

── Features ──────────────────────────────────
  Include OIDC authentication? [Y/n]:
  Include i18n (internationalization)? [Y/n]:
  Include email service (mailer)? [y/N]:
  Include file upload support? [y/N]:

── Deployment ────────────────────────────────
  Install blue-green deployment scaffold? [Y/n]:
```

### Module: `renderer.ts`

Template rendering engine. Replaces `{{PLACEHOLDER}}` markers with values.

**Functions:**
- `render(template, vars): string` — Replace `{{KEY}}` placeholders with values
- `readTemplate(relativePath): string` — Read template file from templates directory
- `readPartial(filename): string` — Read partial file from partials directory

### Module: `generator.ts`

Orchestrates file generation. Builds the file list based on answers, reads templates, injects partials, and renders content.

**Functions:**
- `buildTemplateVars(answers): TemplateVars` — Build variable map from user answers
- `buildFileList(answers): FileEntry[]` — Determine which files to generate
- `generateAllFiles(answers, options): FileResult[]` — Orchestrate full generation

**Key template variables:**

| Variable | Example Value |
|----------|---------------|
| `PROJECT_NAME` | `CastingAppST` |
| `PROJECT_NAME_LOWER` | `castingappst` |
| `PACKAGE_SCOPE` | `@castingappst` |
| `DESCRIPTION` | `Casting Application Single Tenant` |
| `BACKEND_PORT` | `4000` |
| `FRONTEND_PORT` | `5173` |
| `DB_NAME` | `castingappst` |
| `DB_PORT` | `5432` |
| `REDIS_PORT` | `6379` |
| `WEBAPI_DEPS_PARTIAL` | Conditional peer deps |
| `WEBAPI_PLUGINS_PARTIAL` | Conditional plugin imports |
| `DOCKER_SERVICES_PARTIAL` | Conditional Docker services |
| `NCU_EXCLUDES` | Package exclusion list for ncu |

### Module: `writer.ts`

File writer with conflict detection, force, and dry-run support.

**Functions:**
- `writeFile(destPath, content, executable?, options): FileResult` — Write single file
- `ensureDir(dirPath): void` — Create directory recursively

### Module: `index.ts`

Main entry point. Orchestrates: parseArgs → prompts/flags → generate → summary → blue-green.

**Flow:**
1. Parse CLI args
2. If `--help`, print usage and exit
3. If non-interactive (has `--name`), build answers from flags
4. Else, run interactive prompts
5. Generate all files
6. Print summary
7. If `blueGreen` is true, invoke blue-green install.sh

## Build Configuration

### `esbuild.config.mjs`

```javascript
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: 'scaffold/scaffold.js',
  banner: { js: '#!/usr/bin/env node' },
  minify: false,  // Keep readable for debugging
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "scaffold"]
}
```

## Error Handling

| Error Case | Handling Strategy |
|------------|-------------------|
| Template file not found | Throw with clear path message |
| Invalid port number | Validate in prompts, reject and re-ask |
| Invalid package name | Validate scope format, reject and re-ask |
| Write permission denied | Catch EACCES, report to user |
| blue-green install fails | Report failure, scaffold output is still valid |

## Testing Requirements

- Unit tests for `renderer.ts` — placeholder replacement, missing vars, edge cases
- Unit tests for `generator.ts` — file list building, template variable construction
- Unit tests for `writer.ts` — conflict detection, dry-run, force mode
- Integration test — generate a project in a temp directory, verify structure
