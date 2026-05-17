# Current State: i18n Reload Fix

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

### What Exists

The i18n system spans three layers: BlendSDK framework, server-side (webapi), and client-side (webclient).

**BlendSDK `webafx-i18n` plugin (`i18n-plugin.ts`):**
- `createI18nPlugin()` loads JSON translation files at startup via `loadAllSources()`
- Creates a `Translator` instance with the merged catalog
- Registers the `Translator` as a singleton service (name: `"i18n"`)
- Has a private `reloadSources()` function that can re-read files and atomically swap the catalog via `translator.setCatalog()`
- Supports optional pub/sub reload via `reloadChannel` config, but this requires infrastructure setup

**BlendSDK React `I18nProvider` (`i18n-context.tsx`):**
- Loads translations via a user-supplied `loader` function on mount
- Wraps them in a client-side `Translator` instance
- Exposes `t()`, `locale`, `setLocale()`, and `ready` via context
- `setLocale()` has a same-locale guard: `if (newLocale === latestLocaleRef.current) return;`
- No `reloadTranslations()` function exists

**Scaffolded app webapi (`translations-controller.ts`):**
- `GET /api/translations/:locale` — serves translations from Redis cache, falling back to in-memory Translator
- `GET /api/translations/cache/clear` — clears Redis cache with `cache.deletePattern('i18n:*')`
- Does NOT reload Translator's in-memory catalog

**Scaffolded app webclient (`Home.tsx`):**
- Uses `useTranslations()` hook for `t()` function
- No reload button exists

### Relevant Files

| File | Purpose | Changes Needed |
|------|---------|---------------|
| `blendsdk-v5/packages/webafx-i18n/src/i18n-plugin.ts` | i18n plugin factory | Register reload service |
| `blendsdk-v5/packages/react/src/i18n/i18n-types.ts` | React i18n types | Add `reloadTranslations` to `I18nContextValue` |
| `blendsdk-v5/packages/react/src/i18n/i18n-context.tsx` | React i18n provider | Implement `reloadTranslations` |
| `test1/packages/webapi/src/controllers/translations-controller.ts` | Translations API | Call reload service in `clearCache` |
| `test1/packages/webclient/src/pages/Home.tsx` | Home page | Add reload button |
| `appscaffold/scaffold/templates/webapi/src/controllers/translations-controller.ts` | Template | Mirror controller fix |
| `appscaffold/scaffold/templates/webclient/src/pages/Home.tsx` | Template | Mirror button addition |

## Gaps Identified

### Gap 1: No reload mechanism accessible to controllers

**Current Behavior:** The `reloadSources()` function is private inside `i18n-plugin.ts`. No service is registered for it. Controllers cannot trigger a source reload.

**Required Behavior:** A reload function must be accessible via the service container so controllers (and any other code) can trigger a full source reload.

**Fix Required:** Register an `${serviceName}:reload` service in the i18n plugin factory that closures over `config.sources`, `translator`, and `logger` to call `reloadSources()`.

### Gap 2: No same-locale re-fetch in React

**Current Behavior:** `setLocale()` no-ops when called with the current locale. There's no way to force a re-fetch.

**Required Behavior:** A `reloadTranslations()` function that calls `loadTranslations(currentLocale)` bypassing the same-locale guard.

**Fix Required:** Add `reloadTranslations` to `I18nContextValue` and implement it in `I18nProvider`.

### Gap 3: Cache clear doesn't reload sources

**Current Behavior:** `clearCache()` only clears Redis. The Translator still holds stale data loaded at startup.

**Required Behavior:** `clearCache()` must first reload sources from disk, then clear Redis.

**Fix Required:** Use the new `i18n:reload` service in the controller.

## Dependencies

### Internal Dependencies

- Gap 3 (controller fix) depends on Gap 1 (reload service) being implemented first
- Gap 2 (React reload) is independent of server-side changes

### External Dependencies

- None — all changes are within BlendSDK and the scaffolded app

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Patching dist files may miss source map updates | Low | Low | Source maps are non-critical for this fix; blendsdk-v5 source is also fixed |
| Breaking existing I18nContextValue consumers | Low | Medium | `reloadTranslations` is additive — existing destructured consumers unaffected |
| Concurrent reload requests | Low | Low | `reloadSources()` already handles this with atomic catalog swap |
