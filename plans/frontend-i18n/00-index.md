# Plan: Full-Stack I18n Integration

> **Feature**: Add internationalization support to the scaffold (backend + frontend)
> **Status**: Planning Complete
> **Created**: 2026-05-17
> **Preflight**: ✅ PASSED (55 tests, build clean)
> **Ambiguities**: ✅ All 13 resolved

## Overview

Add full-stack i18n to the appscaffold generator. The backend gets a `webafx-i18n` plugin with JSON files (+ optional PostgreSQL DB source), Redis-cached translations API, and server-side translation examples. The frontend gets `GlobalLoaderProvider` (always), `I18nProvider` from `blendsdk/react` (when i18n enabled), a translation loader fetching from the API, and `useTranslations()` examples. The scaffold gains a new `i18nDb` boolean, follow-up prompt, CLI flags, and partials-based conditional template injection.

## Document Index

| # | Document | Description |
|---|----------|-------------|
| AR | [Ambiguity Register](00-ambiguity-register.md) | Zero-Ambiguity Gate decisions (audit trail) |
| 00 | [Index](00-index.md) | This document — overview and navigation |
| 01 | [Requirements](01-requirements.md) | Feature requirements, architecture, and scope |
| 99 | [Execution Plan](99-execution-plan.md) | Phases, sessions, and task checklist |

## Quick Reference

### Key Decisions

| Decision | Outcome | AR Ref |
|----------|---------|--------|
| DB translations prompt | Follow-up when i18n=true | AR #1 |
| CLI flags | `--i18n-db` / `--no-i18n-db` | AR #2 |
| Cache TTL | 0 (no expiry, manual invalidation) | AR #5 |
| Cache invalidation | Admin endpoint `GET /api/admin/translations/cache/clear` | AR #6 |
| GlobalLoaderProvider | Always included | AR #8 |
| `blendsdk` in webclient | Always added | AR #9 |
| Controller registration | Partials-based conditional injection | AR #11 |
| Cache clear behavior | Clear Redis + reload Translator | AR #12 |
| Sample en.json | Include plurals | AR #13 |

## Related Files

### New Files (created by plan)
- `scaffold/templates/webapi/src/controllers/translations-controller.ts`
- `scaffold/templates/webapi/resources/i18n/en.json`
- `scaffold/templates/codegen/resources/database/001-translations.sql`
- `scaffold/templates/webclient/src/system/i18n/loader.ts`
- 12 new partials in `scaffold/partials/`

### Modified Files
- `src/types.ts` — `ScaffoldAnswers`, `ScaffoldFlags`
- `src/prompts.ts` — follow-up prompt
- `src/index.ts` — CLI flags
- `src/generator.ts` — `buildTemplateVars()`, `buildFileList()`
- `scaffold/templates/webapi/src/index.ts` — controller placeholders
- `scaffold/partials/i18n-plugin-registration.txt` — DB source placeholder
- `scaffold/templates/webclient/package.json` — blendsdk dep
- `scaffold/templates/webclient/src/main.tsx` — provider wrappers
- `scaffold/templates/webclient/src/pages/Home.tsx` — translation examples
- `scaffold/templates/webclient/src/system/index.ts` — loader export
