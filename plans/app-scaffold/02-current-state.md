# Current State: BlendSDK Application Scaffold Generator

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementations

### Reference 1: blendsdk/blue-green

The primary architectural reference. A scaffold generator for blue-green deployment infrastructure.

**Key patterns to replicate:**

| Pattern | Implementation |
|---------|---------------|
| Entry point | `scaffold/scaffold.js` — single bundled file (esbuild) |
| Installer | `install.sh` — downloads tarball, extracts, runs scaffold.js |
| Templates | `scaffold/templates/` — real files with `{{PLACEHOLDER}}` markers |
| Partials | `scaffold/partials/` — conditional sections injected into templates |
| CLI parsing | Custom `parseArgs()` — no external deps |
| Prompts | `readline` module — `ask()`, `confirm()`, `choose()` helpers |
| Rendering | `render(template, vars)` — regex replace `{{KEY}}` → value |
| File writing | `writeFile()` with conflict detection, `--force`, `--dry-run` |
| Summary | `printSummary()` — file counts, config recap, next steps |
| Build | `esbuild.config.mjs` — bundles TypeScript to single JS file |
| Tests | Node.js built-in test runner (57 tests) |

**File structure:**
```
blendsdk/blue-green/
├── install.sh
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── src/deploy-cli/          # TypeScript source
├── scaffold/
│   ├── scaffold.js          # Built output (committed)
│   ├── templates/           # Template files
│   └── partials/            # Conditional sections
```

### Reference 2: CastingAppMT

The existing monorepo application being modernized. Provides domain context and architectural patterns.

**Structure:**
```
CastingAppMT/
├── package.json             # Lerna + Yarn Workspaces
├── lerna.json               # Version management (to be removed)
├── packages/
│   ├── shared/              # Shared types (auto-generated)
│   ├── webapi/              # BlendSDK v3.x backend
│   ├── webclient/           # Vite + React 18 + FluentUI v8
│   ├── codegen/             # Code generation
│   └── fui8/                # Custom FluentUI v8 components
```

**Key patterns to modernize:**

| CastingAppMT (v3) | Scaffold Output (v5) |
|-------------------|---------------------|
| Lerna + Yarn Workspaces | Turborepo + Yarn Workspaces |
| `@blendsdk/webafx` (scoped packages) | `blendsdk/webafx` (subpath exports) |
| FluentUI v8 (`@fluentui/react`) | FluentUI v9 (`@fluentui/react-components`) |
| Jest | vitest |
| `ts-node` + `nodemon` | `tsx watch` |
| yup + formik | zod |
| Custom routing | React Router v7 |
| `app.config.js` (CJS) | `.env.js` (ESM) |
| `blend-update.js` | Direct `blendsdk` from npm |
| `ncu` with exclusions | `ncu` with updated exclusions |

### Reference 3: BlendSDK v5 Documentation

**Package:** `blendsdk` (single npm package, v5.36.0)

**Subpath imports:**
- `blendsdk/webafx` — Web application framework (Express 5)
- `blendsdk/postgresql` — PostgreSQL database
- `blendsdk/expression` — Query expression builder
- `blendsdk/dbcore` — Database core abstractions
- `blendsdk/webafx-cache` — Redis caching
- `blendsdk/webafx-auth` — JWT/OIDC authentication
- `blendsdk/webafx-mailer` — Email sending
- `blendsdk/webafx-i18n` — Internationalization
- `blendsdk/i18n` — I18n core
- `blendsdk/codegen` — Code generation
- `blendsdk/stdlib` — Standard library utilities
- `blendsdk/cmdline` — CLI utilities

**Required peer dependencies by subpath:**

| Subpath | Peers |
|---------|-------|
| webafx | express, cookie-parser, cors, helmet |
| postgresql | pg, yesql |
| webafx-cache | ioredis |
| webafx-auth | jose |
| webafx-mailer | nodemailer |

## Gaps Identified

### Gap 1: No Reusable Scaffold Exists

**Current:** Each new BlendSDK application is created manually or by copying CastingAppMT and stripping domain logic.
**Required:** A single command that generates a clean, complete, modern monorepo.
**Fix:** Build the scaffold generator described in this plan.

### Gap 2: No Standard Project Template for v5

**Current:** CastingAppMT uses BlendSDK v3.x patterns. No v5 template exists.
**Required:** Templates using `blendsdk` unified package with subpath imports, ESM, modern TypeScript.
**Fix:** Template files in `scaffold/templates/` using v5 patterns from documentation.

### Gap 3: No Deployment Integration

**Current:** Deployment is set up manually per project.
**Required:** Scaffold should offer to install blue-green deployment infrastructure.
**Fix:** Post-scaffold step that invokes `blendsdk/blue-green` install.sh.

## Dependencies

### Internal Dependencies

- None — this is a standalone generator project

### External Dependencies (Development Only)

| Package | Purpose |
|---------|---------|
| `typescript` | TypeScript compiler |
| `esbuild` | Bundle to single scaffold.js |
| `@types/node` | Node.js type definitions |
| `vitest` | Unit testing |

### Runtime Dependencies

- None (zero dependencies — Node.js built-ins only)

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| BlendSDK v5 API changes | Low | Medium | Pin to ^5.35.0, document in templates |
| FluentUI v9 breaking changes | Low | Low | Pin to specific version range |
| blue-green install.sh changes | Low | Low | Invoke as external — not our concern |
| Template maintenance burden | Medium | Medium | Keep templates minimal, test generation |
