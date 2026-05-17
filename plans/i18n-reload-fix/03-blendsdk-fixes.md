# BlendSDK Fixes: i18n Reload Fix

> **Document**: 03-blendsdk-fixes.md
> **Parent**: [Index](00-index.md)

## Overview

Two changes in BlendSDK v5 to enable the i18n reload mechanism:
1. Register a reload function as a service in the i18n plugin
2. Add `reloadTranslations()` to the React i18n context

## Change 1: i18n Plugin — Register Reload Service

### File: `packages/webafx-i18n/src/i18n-plugin.ts`

> **Decision per AR #1:** Reload service name follows `${serviceName}:reload` pattern.

### Current Architecture

The `reloadSources()` function exists as a private function inside `i18n-plugin.ts`. It has the right logic — re-reads all sources and calls `translator.setCatalog()` — but is only accessible via the optional pub/sub channel.

### Proposed Change

After registering the Translator as a singleton service (Step 3), add Step 3b: register a reload function as a singleton service.

### Implementation

In `createI18nPlugin()`, after the Translator service registration (line ~68), add:

```typescript
// --- Step 3b: Register reload function as singleton service ---
// Allows controllers and other code to trigger a full source reload
// (Decision per AR #1)
app.registerService({
    name: `${serviceName}:reload`,
    type: "singleton",
    factory: () => async () => {
        await reloadSources(config.sources, translator, logger);
    },
});
```

This creates a closure over `config.sources`, `translator`, and `logger` — the same variables that the existing pub/sub reload already uses.

### Why This Works

- The `reloadSources()` function already exists and is battle-tested (used by pub/sub reload)
- The service registration pattern is consistent with how the Translator is registered
- No changes needed to the `reloadSources()` function itself
- No changes needed to the `Translator` class
- The service name is configurable via `${serviceName}:reload` (default: `"i18n:reload"`)

---

## Change 2: React I18nProvider — Add `reloadTranslations()`

### Files

- `packages/react/src/i18n/i18n-types.ts` — Add type
- `packages/react/src/i18n/i18n-context.tsx` — Implement function

> **Decision per AR #3:** `reloadTranslations()` only re-fetches via `loader()`. The caller is responsible for triggering backend reload first.

### Type Change (`i18n-types.ts`)

Add `reloadTranslations` to `I18nContextValue`:

```typescript
export interface I18nContextValue {
    /** Translation function — t('key', params?) → string */
    t: TranslateFunction;
    /** Current active locale */
    locale: string;
    /** Switch to a different locale (triggers re-fetch via loader, shows GlobalLoader). */
    setLocale: (locale: string) => void;
    /** Force re-fetch translations for the current locale (e.g., after server-side reload). */
    reloadTranslations: () => void;
    /** True when translations have been loaded successfully */
    ready: boolean;
}
```

### Implementation Change (`i18n-context.tsx`)

Add `reloadTranslations` as a `useCallback` that calls `loadTranslations(latestLocaleRef.current)` — bypassing the same-locale guard in `setLocale`:

```typescript
/**
 * Force re-fetch translations for the current locale.
 * Unlike setLocale(), this does NOT skip same-locale requests.
 * Use after server-side translation reload to refresh the UI.
 */
const reloadTranslations = useCallback(() => {
    void loadTranslations(latestLocaleRef.current);
}, [loadTranslations]);
```

Update the context value memo:

```typescript
const contextValue = useMemo<I18nContextValue>(
    () => ({ t, locale, setLocale, reloadTranslations, ready }),
    [t, locale, setLocale, reloadTranslations, ready],
);
```

### Why This Works

- `loadTranslations()` already handles: showing GlobalLoader, calling `loader()`, building catalog, calling `setCatalog()`, updating state
- The same-locale guard is in `setLocale()`, NOT in `loadTranslations()` — so calling `loadTranslations` directly bypasses it
- Race condition protection is built into `loadTranslations` via `latestLocaleRef`
- GlobalLoader overlay provides visual feedback during reload (AR #5)

## Testing Requirements

- Verify BlendSDK builds cleanly after changes
- Manual test: reload service is accessible via service container
- Manual test: `reloadTranslations()` triggers re-fetch in React
