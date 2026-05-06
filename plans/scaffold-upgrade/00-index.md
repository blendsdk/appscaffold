# Scaffold Template Upgrade Implementation Plan

> **Feature**: Upgrade scaffold template — React 19, install prompt, mailer default
> **Status**: Planning Complete
> **Created**: 2025-05-06
> **CodeOps Version**: 1.0.0

## Overview

This plan upgrades the BlendSDK appscaffold project template in three areas:

1. **React 18 → React 19** — Update the webclient template's React and type dependencies
2. **Install script post-scaffold prompt** — Add a Y/n prompt in install.sh to run `yarn install && yarn ncu` after scaffolding, with a yarn preflight check
3. **Mailer default to true** — Change the email service (mailer) option from opt-in to opt-out in both interactive and non-interactive modes

## Document Index

| # | Document | Description |
|---|----------|-------------|
| AR | [Ambiguity Register](00-ambiguity-register.md) | Zero-Ambiguity Gate decisions (audit trail) |
| 00 | [Index](00-index.md) | This document — overview and navigation |
| 01 | [Requirements](01-requirements.md) | Feature requirements and scope |
| 02 | [Current State](02-current-state.md) | Analysis of current implementation |
| 03 | [Changes Specification](03-changes-spec.md) | Technical specification for all changes |
| 07 | [Testing Strategy](07-testing-strategy.md) | Test cases and verification |
| 99 | [Execution Plan](99-execution-plan.md) | Phases, sessions, and task checklist |

## Key Decisions

| Decision | Outcome | AR Ref |
|----------|---------|--------|
| Update Next Steps in scaffold.js | Yes — show `yarn install && yarn ncu` | AR #1 |
| Install prompt command style | Single chain `yarn install && yarn ncu` | AR #2 |
| Yarn preflight check | Yes — warn and skip prompt if missing | AR #3 |
| Mailer default scope | Both interactive and non-interactive | AR #4 |

## Related Files

- `scaffold/templates/webclient/package.json` — React versions
- `src/prompts.ts` — Mailer default in prompts
- `src/index.ts` — Help text and Next Steps
- `install.sh` — Post-scaffold prompt
- `scaffold/scaffold.js` — Rebuilt output
