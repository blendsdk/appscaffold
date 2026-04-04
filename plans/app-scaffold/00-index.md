# BlendSDK Application Scaffold Generator — Implementation Plan

> **Feature**: Reusable TypeScript scaffold generator for BlendSDK + FluentUI v9 monorepo applications
> **Status**: Planning Complete
> **Created**: 2026-04-04

## Overview

Build a professional, reusable application scaffold generator — a TypeScript project (mirroring the architecture of `blendsdk/blue-green`) that generates complete BlendSDK v5 monorepo applications with Turborepo, Vite + React + FluentUI v9 frontend, and optional blue-green deployment infrastructure.

The generator supports both interactive mode (readline prompts) and non-interactive mode (CLI flags), is bundled into a single zero-dependency `scaffold.js` via esbuild, and is installable via a one-liner `curl | bash` command.

## Document Index

| #  | Document                                             | Description                                   |
|----|------------------------------------------------------|-----------------------------------------------|
| 00 | [Index](00-index.md)                                 | This document — overview and navigation       |
| 01 | [Requirements](01-requirements.md)                   | Feature requirements and scope                |
| 02 | [Current State](02-current-state.md)                 | Analysis of reference implementations         |
| 03 | [Scaffold Core](03-scaffold-core.md)                 | TypeScript src/ — CLI, prompts, renderer, generator, writer |
| 04 | [Templates — Root & Shared](04-templates-root.md)    | Root config templates and shared package      |
| 05 | [Templates — WebAPI](05-templates-webapi.md)         | BlendSDK v5 backend templates                 |
| 06 | [Templates — WebClient](06-templates-webclient.md)   | Vite + React + FluentUI v9 frontend templates |
| 07 | [Templates — Codegen & Deploy](07-templates-codegen-deploy.md) | Codegen package and deployment integration |
| 08 | [Testing Strategy](08-testing-strategy.md)           | Test cases and verification                   |
| 99 | [Execution Plan](99-execution-plan.md)               | Phases, sessions, task checklist              |

## Quick Reference

### Usage Examples

```bash
# Interactive mode — one-liner install
curl -fsSL https://raw.githubusercontent.com/blendsdk/app-scaffold/master/install.sh | bash

# Non-interactive mode
curl -fsSL .../install.sh | bash -s -- --name CastingAppST --scope @castingappst --port 4000 --with-oidc --with-i18n
```

### Key Decisions

| Decision              | Outcome                                            |
|-----------------------|----------------------------------------------------|
| Script language       | TypeScript, bundled to single JS via esbuild       |
| Package manager       | Yarn (classic v1)                                  |
| Node.js               | >= 22 (pinned in .nvmrc)                           |
| BlendSDK              | v5 unified `blendsdk` package (^5.35.0)            |
| Frontend              | FluentUI v9 (`@fluentui/react-components`)         |
| Testing               | vitest everywhere (no jest)                        |
| Monorepo tool         | Turborepo + Yarn Workspaces                        |
| Codegen               | Always included                                    |
| Deployment            | blendsdk/blue-green (invoked as post-step)         |
| Validation            | zod (backend + frontend)                           |
| Routing               | React Router v7                                    |

## Related Files

**Scaffold project (this repo):**
- `src/index.ts` — Main entry point
- `src/types.ts` — Configuration types
- `src/prompts.ts` — Interactive Q&A
- `src/renderer.ts` — Template rendering engine
- `src/generator.ts` — File generation orchestrator
- `src/writer.ts` — File writer with conflict detection
- `scaffold/scaffold.js` — Built output (esbuild bundle)
- `scaffold/templates/` — All template files
- `scaffold/partials/` — Conditional template sections
- `install.sh` — Curl-based installer

**Generated project structure:**
- `packages/shared/` — Shared types
- `packages/webapi/` — BlendSDK v5 backend
- `packages/webclient/` — Vite + React + FluentUI v9
- `packages/codegen/` — Code generation
