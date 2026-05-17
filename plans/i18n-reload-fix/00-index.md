# i18n Reload Fix Implementation Plan

> **Feature**: Fix i18n translation reload — cache clear must re-read JSON files from disk, add reload button to frontend
> **Status**: Planning Complete
> **Created**: 2026-05-17
> **Type**: Bug Fix

## Overview

The i18n translation system has a critical bug: calling the cache clear endpoint (`/api/translations/cache/clear`) only clears the Redis cache but does NOT reload the in-memory Translator catalog from disk. This means editing JSON translation files has no effect until the server is restarted.

Additionally, the React `I18nProvider` has no way to force-reload translations for the current locale — `setLocale()` no-ops when called with the same locale. A `reloadTranslations()` function is needed, along with a UI button to trigger the full reload flow.

The fix spans three codebases: BlendSDK v5 (framework), the scaffolded test app (`test1`), and the appscaffold templates.

## Document Index

| # | Document | Description |
|---|----------|-------------|
| AR | [Ambiguity Register](00-ambiguity-register.md) | Zero-Ambiguity Gate decisions (audit trail) |
| 00 | [Index](00-index.md) | This document — overview and navigation |
| 01 | [Requirements](01-requirements.md) | Feature requirements and scope |
| 02 | [Current State](02-current-state.md) | Analysis of current implementation and bugs |
| 03 | [BlendSDK Fixes](03-blendsdk-fixes.md) | Technical spec for BlendSDK changes |
| 04 | [Scaffold App Fixes](04-scaffold-app-fixes.md) | Technical spec for scaffolded app + template changes |
| 07 | [Testing Strategy](07-testing-strategy.md) | Test cases and verification |
| 99 | [Execution Plan](99-execution-plan.md) | Phases, sessions, and task checklist |

## Quick Reference

### Usage Examples

**Server-side — controller can now reload translations:**
```typescript
const reload = await req.services.get<() => Promise<void>>('i18n:reload');
await reload();
await cache.deletePattern('i18n:*');
```

**Client-side — React component can force reload:**
```tsx
const { t, reloadTranslations } = useTranslations();

const handleReload = async () => {
    await fetch('/api/translations/cache/clear');
    reloadTranslations();
};
```

### Key Decisions

| Decision | Outcome | AR Ref |
|----------|---------|--------|
| Reload service name | `${serviceName}:reload` (configurable) | AR #1 |
| Cache/clear behavior | Does BOTH — reload sources + clear Redis | AR #2 |
| React reload scope | Frontend only re-fetches (caller handles backend) | AR #3 |
| Reload button style | Developer utility, `appearance="outline"` | AR #4 |
| Reload feedback | GlobalLoader handles it (no extra UI) | AR #5 |
| Test1 patching approach | Patch dist + fix blendsdk-v5 source | AR #6 |

## Related Files

### BlendSDK v5 (`/home/gevik/workdir/github/TrueSoftware/blendsdk-v5`)
- `packages/webafx-i18n/src/i18n-plugin.ts` — register reload service
- `packages/react/src/i18n/i18n-context.tsx` — add `reloadTranslations`
- `packages/react/src/i18n/i18n-types.ts` — update types

### Scaffolded App (`/home/gevik/workdir/github/scaffold-tests/test1`)
- `packages/webapi/src/controllers/translations-controller.ts` — fix clearCache
- `packages/webclient/src/pages/Home.tsx` — add reload button

### Appscaffold Templates (`/home/gevik/workdir/github/appscaffold`)
- `scaffold/templates/webapi/src/controllers/translations-controller.ts` — fix template
- `scaffold/templates/webclient/src/pages/Home.tsx` — fix template
