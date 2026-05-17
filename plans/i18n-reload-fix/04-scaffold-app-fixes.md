# Scaffold App Fixes: i18n Reload Fix

> **Document**: 04-scaffold-app-fixes.md
> **Parent**: [Index](00-index.md)

## Overview

Three changes to the scaffolded app and appscaffold templates:
1. Fix `TranslationsController.clearCache()` to reload sources before clearing Redis
2. Add "Reload Translations" button to `Home.tsx`
3. Mirror both changes in the appscaffold templates

## Change 1: Fix `clearCache` in Translations Controller

### Files

- `test1/packages/webapi/src/controllers/translations-controller.ts` — live fix
- `appscaffold/scaffold/templates/webapi/src/controllers/translations-controller.ts` — template fix

> **Decision per AR #2:** Cache/clear does BOTH — reload sources from disk + clear Redis cache.

### Current Implementation

```typescript
async clearCache(_req: Request, res: Response) {
    const cache = await _req.services.get<CacheProvider>('cache');
    await cache.deletePattern('i18n:*');
    res.json({ cleared: true });
}
```

**Bug:** Only clears Redis. The Translator's in-memory catalog still holds stale data from startup.

### Fixed Implementation

```typescript
/**
 * GET /api/translations/cache/clear
 * Reloads translation sources from disk and clears the Redis cache.
 * The next request will serve freshly loaded translations.
 */
async clearCache(_req: Request, res: Response) {
    const reload = await _req.services.get<() => Promise<void>>('i18n:reload');
    const cache = await _req.services.get<CacheProvider>('cache');

    await reload();
    await cache.deletePattern('i18n:*');

    res.json({ cleared: true, reloaded: true });
}
```

### What Changed

1. Gets the `i18n:reload` service (registered by the i18n plugin — AR #1)
2. Calls `reload()` FIRST — re-reads JSON files from disk, atomically swaps Translator catalog
3. Then clears Redis cache — ensures next request fetches from the updated Translator
4. Response includes `reloaded: true` to indicate sources were also reloaded

---

## Change 2: Add Reload Button to Home Page

### Files

- `test1/packages/webclient/src/pages/Home.tsx` — live fix
- `appscaffold/scaffold/templates/webclient/src/pages/Home.tsx` — template fix

> **Decision per AR #3:** Button calls backend cache/clear first, then triggers `reloadTranslations()`.
> **Decision per AR #4:** Developer utility button with `appearance="outline"`.
> **Decision per AR #5:** No extra feedback — GlobalLoader handles visual state.

### Current Implementation

```tsx
export const Home: React.FC = () => {
    const styles = useStyles();
    const { t } = useTranslations();

    return (
        <div className={styles.container}>
            <Title1>Welcome to test1</Title1>
            <Body1>Your application is running successfully.</Body1>
            <Body1>{t('app.welcome', { name: 'User' })}</Body1>
            <Body1>{t('items.count', { count: 3 })}</Body1>
            <Button appearance="primary">Get Started</Button>
        </div>
    );
};
```

### Fixed Implementation

```tsx
export const Home: React.FC = () => {
    const styles = useStyles();
    const { t, reloadTranslations } = useTranslations();

    const handleReloadTranslations = async () => {
        await fetch('/api/translations/cache/clear');
        reloadTranslations();
    };

    return (
        <div className={styles.container}>
            <Title1>Welcome to test1</Title1>
            <Body1>Your application is running successfully.</Body1>
            <Body1>{t('app.welcome', { name: 'User' })}</Body1>
            <Body1>{t('items.count', { count: 3 })}</Body1>
            <Button appearance="primary">Get Started</Button>
            <Button appearance="outline" onClick={handleReloadTranslations}>
                Reload Translations
            </Button>
        </div>
    );
};
```

### What Changed

1. Destructures `reloadTranslations` from `useTranslations()` (new from BlendSDK fix)
2. Adds `handleReloadTranslations` async handler that:
   - Calls backend `/api/translations/cache/clear` (which now reloads sources + clears Redis)
   - Then calls `reloadTranslations()` to re-fetch on the frontend (GlobalLoader shows automatically)
3. Adds a "Reload Translations" button with `appearance="outline"` (developer utility style)

### Template Considerations

The appscaffold template uses `{{PROJECT_NAME}}` in place of `test1`. The template Home.tsx already has the same structure, so the same changes apply.

---

## Change 3: Patch BlendSDK dist in test1

> **Decision per AR #6:** Patch dist files directly + fix blendsdk-v5 source.

After making the BlendSDK source changes, the corresponding `.js` and `.d.ts` files in `test1/node_modules/blendsdk/dist/` must be patched to match. This avoids a full build/publish cycle during development.

### Files to Patch

| Source (blendsdk-v5) | Dist Target (test1 node_modules) |
|---------------------|----------------------------------|
| `packages/webafx-i18n/src/i18n-plugin.ts` | `node_modules/blendsdk/dist/webafx-i18n/i18n-plugin.js` + `.d.ts` |
| `packages/react/src/i18n/i18n-types.ts` | `node_modules/blendsdk/dist/react/i18n/i18n-types.d.ts` |
| `packages/react/src/i18n/i18n-context.tsx` | `node_modules/blendsdk/dist/react/i18n/i18n-context.js` + `.d.ts` |

## Testing Requirements

- Manual: Edit `en.json`, hit cache/clear, verify translations are updated
- Manual: Click "Reload Translations" button, verify UI updates
- Build: `yarn build` in test1's webapi and webclient
