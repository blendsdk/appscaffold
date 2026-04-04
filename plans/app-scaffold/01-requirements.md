# Requirements: BlendSDK Application Scaffold Generator

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

A professional, reusable TypeScript application that generates complete BlendSDK v5 monorepo projects. The scaffold generator follows the same architecture as `blendsdk/blue-green` — a TypeScript source that compiles to a single bundled `scaffold.js` via esbuild, installable via `curl | bash`.

## Functional Requirements

### Must Have

- [ ] Interactive mode with readline-based prompts (project name, scope, ports, features)
- [ ] Non-interactive mode with CLI flags (`--name`, `--scope`, `--port`, etc.)
- [ ] Generate Turborepo + Yarn Workspaces monorepo structure
- [ ] Generate `packages/shared` — shared types and constants (ESM, TypeScript)
- [ ] Generate `packages/webapi` — BlendSDK v5 backend (Express 5, ESM, Node 22+)
- [ ] Generate `packages/webclient` — Vite + React 18 + FluentUI v9 + TypeScript
- [ ] Generate `packages/codegen` — BlendSDK code generation package (always included)
- [ ] Conditional OIDC authentication plugin (provider-agnostic)
- [ ] Conditional i18n (internationalization) support
- [ ] Conditional email service (nodemailer + Mailpit for dev)
- [ ] Conditional file upload support
- [ ] Docker Compose for dev: PostgreSQL 16, Redis 7, Mailpit (conditional)
- [ ] `ncu` script for dependency updates in root package.json
- [ ] Health endpoint with dependency checks (DB + Redis)
- [ ] Blue-green deployment integration (invoke `blendsdk/blue-green` install.sh)
- [ ] `deploy-package.sh` for building deployment tgz artifact
- [ ] `.gitignore` files at all levels (scaffold repo + generated project + sub-packages)
- [ ] `.editorconfig`, `.prettierrc`, `.nvmrc` in generated project
- [ ] `--force` flag to overwrite existing files
- [ ] `--dry-run` flag to preview without writing
- [ ] Conflict detection (skip existing files unless `--force`)
- [ ] Summary output showing generated files and next steps
- [ ] `install.sh` curl-based installer (downloads repo, runs scaffold.js)

### Should Have

- [ ] `--help` flag with usage documentation
- [ ] Colored terminal output (ANSI codes, no external deps)
- [ ] Validation of user inputs (port ranges, valid package names)
- [ ] `vitest` configuration in all generated packages
- [ ] React Router v7 setup in webclient
- [ ] zod validation in both webapi and webclient

### Won't Have (Out of Scope)

- Domain-specific business logic (actors, castings, projects, etc.)
- Custom FluentUI component library (separate project)
- Database schemas or migration scripts
- CI/CD workflows (handled by blue-green scaffold)
- `blend-update.js` (using public `blendsdk` from npm)
- Lerna configuration
- Jest configuration

## Technical Requirements

### Performance

- Scaffold generation should complete in < 5 seconds (excluding yarn install)
- esbuild bundle should be < 500KB

### Compatibility

- Node.js >= 22.0.0
- Works on Linux and macOS
- Bash-compatible shell for `install.sh`

### Architecture

- Zero external runtime dependencies (Node.js built-ins only: fs, path, readline)
- esbuild for bundling (dev dependency only)
- Template files stored as separate files (not embedded strings)
- `{{PLACEHOLDER}}` template syntax (same as blue-green)
- Partials system for conditional sections

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Script language | Bash, Node.js (CJS), TypeScript | TypeScript + esbuild | Type-safe, testable, maintainable, matches blue-green |
| Template engine | Handlebars, EJS, custom | Custom `{{PLACEHOLDER}}` | Zero dependencies, simple, proven in blue-green |
| Codegen package | Optional, always | Always included | User confirmed apps will heavily use codegen |
| Package manager | npm, yarn, pnpm | Yarn (classic v1) | Consistency with existing projects |
| Frontend framework | Next.js, Remix, Vite+React | Vite + React | Lightweight, fast, matches existing pattern |

## Acceptance Criteria

1. [ ] Running `node scaffold.js` in interactive mode generates a complete, valid monorepo
2. [ ] Running `node scaffold.js --name X --scope @x` in non-interactive mode generates the same
3. [ ] Generated project passes `yarn install` without errors
4. [ ] Generated project passes `yarn build` (Turborepo builds all packages)
5. [ ] Generated webapi starts and responds on `/health`
6. [ ] Generated webclient starts via `vite` and renders FluentUI v9 app
7. [ ] Generated codegen package has correct BlendSDK imports
8. [ ] All scaffold unit tests pass via `vitest`
9. [ ] `install.sh` successfully downloads and runs the scaffold
10. [ ] Blue-green scaffold is invoked when user opts in
11. [ ] `.gitignore` files correctly exclude build artifacts at all levels
