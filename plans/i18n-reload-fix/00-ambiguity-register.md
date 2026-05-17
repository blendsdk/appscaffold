# Ambiguity Register: i18n Reload Fix

> **Status**: ✅ GATE PASSED — all 6 items resolved
> **Last Updated**: 2026-05-17

| # | Category | Ambiguity / Gap | Options Presented | User Decision | Status |
|---|----------|----------------|-------------------|---------------|--------|
| 1 | Technical | What service name should the reload function be registered under? | A) `i18n:reload` (colon-namespaced) / B) `i18n-reload` (dash-separated) / C) `${serviceName}:reload` (configurable, follows pattern) | C — `${serviceName}:reload` pattern | ✅ Resolved |
| 2 | Behavioral | Should `/api/translations/cache/clear` also reload translation sources from disk, or separate endpoints? | A) Cache/clear does BOTH (reload sources + clear Redis) / B) Separate endpoints for granular control | A — single endpoint does both | ✅ Resolved |
| 3 | Behavioral | Should React `reloadTranslations()` call backend reload first, or just re-fetch? | A) Frontend only re-fetches via `loader()` (caller handles backend) / B) Frontend handles both (couples to backend) | A — frontend only re-fetches | ✅ Resolved |
| 4 | UX | What should the reload button look like on Home.tsx? | A) Subtle button / B) Primary with icon / C) Developer utility with `appearance="outline"` | C — developer utility button | ✅ Resolved |
| 5 | Behavioral | Should the reload button show success/error feedback? | A) No extra feedback, GlobalLoader handles it / B) Toast/alert on success or error | A — GlobalLoader handles it | ✅ Resolved |
| 6 | Scope | How to apply BlendSDK fix to test1? | A) Build, bump, publish locally, reinstall / B) Patch dist files directly + fix blendsdk-v5 source | B — patch dist + fix source | ✅ Resolved |

## Resolution Notes

**AR-1:** The reload service name follows the existing configurable pattern. If `serviceName` is `"i18n"` (default), the reload service becomes `"i18n:reload"`. If customized to e.g. `"translations"`, it becomes `"translations:reload"`.

**AR-2:** The existing `/api/translations/cache/clear` endpoint is the natural place for "make translations reload." Separating concerns into two endpoints adds complexity without clear benefit for this use case.

**AR-3:** Keeping the React `reloadTranslations()` as a pure re-fetch (via loader) maintains separation of concerns. The button handler in the UI component calls the backend endpoint first, then triggers `reloadTranslations()`.

**AR-4:** This is a developer/admin utility, not a user-facing feature. Outline appearance signals it's a utility action.

**AR-5:** The GlobalLoader overlay already shows during translation re-fetch. Adding toast/alert adds UI complexity without proportional value.

**AR-6:** Patching `dist/` files in test1's `node_modules` is faster for iteration. The blendsdk-v5 source is also fixed for proper builds later.
