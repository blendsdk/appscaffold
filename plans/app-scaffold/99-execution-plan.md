# Execution Plan: BlendSDK Application Scaffold Generator

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-04-04 01:36
> **Progress**: 11/24 tasks (46%)

## Overview

Build a professional TypeScript scaffold generator that creates complete BlendSDK v5 monorepo applications. Architecture mirrors `blendsdk/blue-green`.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title                          | Sessions | Est. Time |
|-------|--------------------------------|----------|-----------|
| 1     | Project Bootstrap              | 1        | 30 min    |
| 2     | Scaffold Core (TypeScript src) | 2        | 90 min    |
| 3     | Template Files                 | 2        | 90 min    |
| 4     | Partials & Conditionals        | 1        | 45 min    |
| 5     | Build & Install                | 1        | 30 min    |
| 6     | Testing                        | 1        | 45 min    |
| 7     | Verification                   | 1        | 30 min    |

**Total: 9 sessions, ~6 hours**

---

## Phase 1: Project Bootstrap

### Session 1.1: Initialize scaffold project

**Reference**: [03-scaffold-core.md](03-scaffold-core.md)
**Objective**: Set up the scaffold project with TypeScript, esbuild, vitest, and directory structure.

**Tasks**:

| #     | Task                                              | File                        |
|-------|---------------------------------------------------|-----------------------------|
| 1.1.1 | Create scaffold project package.json              | `package.json`              |
| 1.1.2 | Create tsconfig.json                              | `tsconfig.json`             |
| 1.1.3 | Create esbuild.config.mjs                         | `esbuild.config.mjs`        |
| 1.1.4 | Create .gitignore for scaffold project            | `.gitignore`                |
| 1.1.5 | Create scaffold directory structure               | `scaffold/`, `src/`         |

**Deliverables**:
- [ ] Scaffold project compiles with `tsc --noEmit`
- [ ] esbuild config is valid
- [ ] Directory structure exists

**Verify**: `tsc --noEmit`

---

## Phase 2: Scaffold Core (TypeScript Source)

### Session 2.1: Types, Renderer, Writer

**Reference**: [03-scaffold-core.md](03-scaffold-core.md)
**Objective**: Implement the core utility modules.

**Tasks**:

| #     | Task                                              | File                        |
|-------|---------------------------------------------------|-----------------------------|
| 2.1.1 | Create types.ts (interfaces, defaults, constants) | `src/types.ts`              |
| 2.1.2 | Create renderer.ts (template rendering engine)    | `src/renderer.ts`           |
| 2.1.3 | Create writer.ts (file writer with conflict detection) | `src/writer.ts`        |

**Deliverables**:
- [ ] Types defined for ScaffoldAnswers, ScaffoldFlags, TemplateVars, FileResult
- [ ] Renderer handles {{PLACEHOLDER}} replacement
- [ ] Writer handles create, skip, overwrite, dry-run

**Verify**: `tsc --noEmit`

### Session 2.2: Prompts, Generator, Index

**Reference**: [03-scaffold-core.md](03-scaffold-core.md)
**Objective**: Implement prompts, file generation orchestration, and main entry point.

**Tasks**:

| #     | Task                                              | File                        |
|-------|---------------------------------------------------|-----------------------------|
| 2.2.1 | Create prompts.ts (interactive Q&A + CLI flags)   | `src/prompts.ts`            |
| 2.2.2 | Create generator.ts (file list, template vars, orchestration) | `src/generator.ts` |
| 2.2.3 | Create index.ts (main entry point)                | `src/index.ts`              |

**Deliverables**:
- [ ] Interactive prompts work via readline
- [ ] CLI flags parsed correctly
- [ ] Generator builds file list and template variables
- [ ] Main entry orchestrates full flow

**Verify**: `tsc --noEmit`

---

## Phase 3: Template Files

### Session 3.1: Root, Shared, Codegen Templates

**Reference**: [04-templates-root.md](04-templates-root.md), [07-templates-codegen-deploy.md](07-templates-codegen-deploy.md)
**Objective**: Create all template files for root config, shared package, and codegen package.

**Tasks**:

| #     | Task                                              | File                                    |
|-------|---------------------------------------------------|-----------------------------------------|
| 3.1.1 | Create root templates (package.json, turbo.json, tsconfig.base.json, .nvmrc, .editorconfig, .prettierrc, .gitignore, README.md) | `scaffold/templates/root/` |
| 3.1.2 | Create shared package templates (package.json, tsconfig.json, src/) | `scaffold/templates/shared/` |
| 3.1.3 | Create codegen package templates (package.json, tsconfig.json, src/) | `scaffold/templates/codegen/` |

**Deliverables**:
- [ ] All root config templates with {{PLACEHOLDER}} markers
- [ ] Shared package template with correct structure
- [ ] Codegen package template with BlendSDK v5 imports

**Verify**: Templates contain valid placeholder syntax

### Session 3.2: WebAPI and WebClient Templates

**Reference**: [05-templates-webapi.md](05-templates-webapi.md), [06-templates-webclient.md](06-templates-webclient.md)
**Objective**: Create all template files for webapi and webclient packages.

**Tasks**:

| #     | Task                                              | File                                    |
|-------|---------------------------------------------------|-----------------------------------------|
| 3.2.1 | Create webapi templates (package.json, tsconfig, .env.js, src/, docker/, config/) | `scaffold/templates/webapi/` |
| 3.2.2 | Create webclient templates (package.json, tsconfig, vite.config, index.html, src/) | `scaffold/templates/webclient/` |
| 3.2.3 | Create deploy-package.sh template                 | `scaffold/templates/root/deploy-package.sh` |

**Deliverables**:
- [ ] WebAPI template with BlendSDK v5 WebApplication
- [ ] WebClient template with FluentUI v9, React Router v7
- [ ] Docker Compose template for dev (PostgreSQL 16, Redis 7)
- [ ] deploy-package.sh for blue-green integration

**Verify**: Templates contain valid placeholder syntax

---

## Phase 4: Partials & Conditionals

### Session 4.1: Conditional Partials

**Reference**: [05-templates-webapi.md](05-templates-webapi.md)
**Objective**: Create conditional partials for OIDC, i18n, mailer, and file upload.

**Tasks**:

| #     | Task                                              | File                                    |
|-------|---------------------------------------------------|-----------------------------------------|
| 4.1.1 | Create OIDC auth plugin partial                   | `scaffold/partials/oidc-auth-plugin.ts` |
| 4.1.2 | Create i18n plugin partial                        | `scaffold/partials/i18n-plugin.txt`     |
| 4.1.3 | Create mailer plugin partial + Docker Mailpit     | `scaffold/partials/mailer-*.txt`        |
| 4.1.4 | Create dependency partials (conditional package.json entries) | `scaffold/partials/deps-*.txt` |
| 4.1.5 | Wire partials into generator.ts buildTemplateVars | `src/generator.ts`                      |

**Deliverables**:
- [ ] OIDC plugin is provider-agnostic
- [ ] All partials inject correctly into templates
- [ ] Conditional Docker services (Mailpit) work

**Verify**: `tsc --noEmit`

---

## Phase 5: Build & Install

### Session 5.1: esbuild Bundle and Install Script

**Reference**: [07-templates-codegen-deploy.md](07-templates-codegen-deploy.md)
**Objective**: Bundle scaffold.js via esbuild and create install.sh.

**Tasks**:

| #     | Task                                              | File                        |
|-------|---------------------------------------------------|-----------------------------|
| 5.1.1 | Install dev dependencies and build scaffold.js    | `scaffold/scaffold.js`      |
| 5.1.2 | Create install.sh                                 | `install.sh`                |
| 5.1.3 | Create scaffold/package.json (node engine requirement) | `scaffold/package.json` |

**Deliverables**:
- [ ] `scaffold/scaffold.js` is a single bundled file
- [ ] `install.sh` downloads and runs scaffold.js
- [ ] Bundle is < 500KB

**Verify**: `node scaffold/scaffold.js --help`

---

## Phase 6: Testing

### Session 6.1: Unit and Integration Tests

**Reference**: [08-testing-strategy.md](08-testing-strategy.md)
**Objective**: Write all tests using vitest.

**Tasks**:

| #     | Task                                              | File                                 |
|-------|---------------------------------------------------|--------------------------------------|
| 6.1.1 | Create renderer.test.ts                           | `src/__tests__/renderer.test.ts`     |
| 6.1.2 | Create generator.test.ts                          | `src/__tests__/generator.test.ts`    |
| 6.1.3 | Create writer.test.ts                             | `src/__tests__/writer.test.ts`       |
| 6.1.4 | Create integration.test.ts                        | `src/__tests__/integration.test.ts`  |

**Deliverables**:
- [ ] All unit tests pass
- [ ] Integration test generates valid project in temp dir
- [ ] No test file exceeds 200 lines

**Verify**: `npx vitest run`

---

## Phase 7: Verification

### Session 7.1: End-to-End Verification

**Objective**: Generate a real project and verify it works.

**Tasks**:

| #     | Task                                              | File                        |
|-------|---------------------------------------------------|-----------------------------|
| 7.1.1 | Run scaffold in non-interactive mode to generate test project | `/tmp/test-scaffold/` |
| 7.1.2 | Verify generated project: yarn install, yarn build | — |
| 7.1.3 | Create project README.md for the scaffold itself  | `README.md`                 |

**Deliverables**:
- [ ] Generated project installs without errors
- [ ] Generated project builds without errors
- [ ] Scaffold README documents usage

**Verify**: Generated project passes `yarn install && yarn build`

---

## Task Checklist (All Phases)

### Phase 1: Project Bootstrap
- [x] 1.1.1 Create scaffold project package.json ✅ (completed: 2026-04-04 01:32)
- [x] 1.1.2 Create tsconfig.json ✅ (completed: 2026-04-04 01:32)
- [x] 1.1.3 Create esbuild.config.mjs ✅ (completed: 2026-04-04 01:32)
- [x] 1.1.4 Create .gitignore for scaffold project ✅ (completed: 2026-04-04 01:32)
- [x] 1.1.5 Create scaffold directory structure ✅ (completed: 2026-04-04 01:32)

### Phase 2: Scaffold Core
- [x] 2.1.1 Create types.ts ✅ (completed: 2026-04-04 01:36)
- [x] 2.1.2 Create renderer.ts ✅ (completed: 2026-04-04 01:37)
- [x] 2.1.3 Create writer.ts ✅ (completed: 2026-04-04 01:37)
- [x] 2.2.1 Create prompts.ts ✅ (completed: 2026-04-04 01:38)
- [x] 2.2.2 Create generator.ts ✅ (completed: 2026-04-04 01:38)
- [x] 2.2.3 Create index.ts ✅ (completed: 2026-04-04 01:39)

### Phase 3: Template Files
- [ ] 3.1.1 Create root templates
- [ ] 3.1.2 Create shared package templates
- [ ] 3.1.3 Create codegen package templates
- [ ] 3.2.1 Create webapi templates
- [ ] 3.2.2 Create webclient templates
- [ ] 3.2.3 Create deploy-package.sh template

### Phase 4: Partials & Conditionals
- [ ] 4.1.1 Create OIDC auth plugin partial
- [ ] 4.1.2 Create i18n plugin partial
- [ ] 4.1.3 Create mailer plugin partial + Docker Mailpit
- [ ] 4.1.4 Create dependency partials
- [ ] 4.1.5 Wire partials into generator.ts

### Phase 5: Build & Install
- [ ] 5.1.1 Build scaffold.js via esbuild
- [ ] 5.1.2 Create install.sh
- [ ] 5.1.3 Create scaffold/package.json

### Phase 6: Testing
- [ ] 6.1.1 Create renderer.test.ts
- [ ] 6.1.2 Create generator.test.ts
- [ ] 6.1.3 Create writer.test.ts
- [ ] 6.1.4 Create integration.test.ts

### Phase 7: Verification
- [ ] 7.1.1 Run scaffold to generate test project
- [ ] 7.1.2 Verify generated project builds
- [ ] 7.1.3 Create scaffold README.md

---

## Session Protocol

### Starting a Session

1. Reference this plan: "Implement Phase X, Session X.X per `plans/app-scaffold/99-execution-plan.md`"

### Ending a Session

1. Verify: `tsc --noEmit && npx vitest run` (when tests exist)
2. Handle commit per active commit mode
3. Compact the conversation with `/compact`

### Between Sessions

1. Review completed tasks in this checklist
2. Mark completed items with [x]
3. Start new conversation for next session
4. Run `exec_plan app-scaffold` to continue

---

## Dependencies

```
Phase 1 (Bootstrap)
    ↓
Phase 2 (Core src/)
    ↓
Phase 3 (Templates)
    ↓
Phase 4 (Partials) ← depends on Phase 2 + 3
    ↓
Phase 5 (Build)    ← depends on Phase 2 + 3 + 4
    ↓
Phase 6 (Testing)  ← depends on Phase 2 + 3 + 4
    ↓
Phase 7 (Verification) ← depends on all above
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ All verification passing (`tsc --noEmit && npx vitest run`)
3. ✅ No warnings/errors
4. ✅ Documentation updated (README.md)
5. ✅ `node scaffold/scaffold.js --help` works
6. ✅ Generated project installs and builds successfully
7. ✅ **Post-completion:** Ask user to re-analyze project and update `.clinerules/project.md`
