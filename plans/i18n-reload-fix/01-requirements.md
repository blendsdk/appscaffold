# Requirements: i18n Reload Fix

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

Fix the i18n translation reload mechanism so that:
1. The server-side cache clear endpoint actually re-reads JSON translation files from disk
2. The React frontend can force-reload translations for the current locale
3. A developer utility button exists to trigger the full reload flow

## Functional Requirements

### Must Have

- [ ] BlendSDK i18n plugin registers a reload function as a service (`${serviceName}:reload`)
- [ ] Reload function re-reads all configured translation sources from disk and atomically swaps the Translator catalog
- [ ] React `I18nProvider` exposes `reloadTranslations()` in the context value
- [ ] `reloadTranslations()` re-fetches translations for the current locale via the loader
- [ ] `useTranslations()` hook returns `reloadTranslations` alongside `t`, `locale`, `setLocale`, `ready`
- [ ] Scaffolded app `clearCache` endpoint calls the reload service before clearing Redis cache
- [ ] Webclient Home page has a "Reload Translations" button that triggers full reload flow

### Won't Have (Out of Scope)

- Pub/sub reload channel setup (already exists, requires infra)
- New locale support or translation file format changes
- Translator class internals changes (uses existing `setCatalog()`)
- Automatic file-watch reload (development-time convenience)

## Technical Requirements

### Compatibility

- Must work with existing `createI18nPlugin` API — new service is auto-registered, no config needed
- `reloadTranslations()` must be backward-compatible — existing `I18nContextValue` consumers still work
- Existing `setLocale()` behavior unchanged

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| Reload service name | Fixed name, dash-separated, configurable | Configurable `${serviceName}:reload` | Follows existing namespacing pattern | AR #1 |
| Endpoint design | Separate reload endpoint vs. combined | Combined in cache/clear | Simpler, one endpoint | AR #2 |
| React reload scope | Frontend-only vs. full-stack | Frontend-only re-fetch | Separation of concerns | AR #3 |

## Acceptance Criteria

1. [ ] Edit `en.json` → call `/api/translations/cache/clear` → next request returns updated translations
2. [ ] Click "Reload Translations" button → frontend shows updated strings
3. [ ] All existing functionality unaffected (setLocale, plural support, etc.)
4. [ ] BlendSDK builds cleanly
5. [ ] Appscaffold templates match the fixes
