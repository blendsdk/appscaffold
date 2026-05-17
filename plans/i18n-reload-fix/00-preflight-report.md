# Preflight Report: i18n Reload Fix

> **Status**: ✅ PREFLIGHT PASSED — all 3 findings resolved
> **Iteration**: 1 (first scan)
> **Artifact**: Implementation Plan at `plans/i18n-reload-fix/`
> **Codebase Grounded**: ✅ 12+ source files examined, all references verified
> **Last Updated**: 2026-05-17

### Codebase Context Summary

**Tech Stack:** TypeScript, BlendSDK v5.40.0, React, FluentUI v9, Express, Redis
**Architecture:** Monorepo (Yarn workspaces + Turborepo) with webapi/webclient/shared/codegen packages
**Key Files Examined:** i18n-plugin.ts/js, i18n-context.tsx/js, i18n-types.ts/d.ts, use-translations.ts/d.ts, translations-controller.ts, Home.tsx, scaffold partials

### Summary by Dimension

| # | Dimension | Findings | Highest Severity |
|---|-----------|----------|-----------------|
| 1-3 | Ambiguities, Assumptions, Contradictions | 0 | — |
| 4 | Completeness Gaps | 0 | — |
| 5-9 | Deps, Feasibility, Testability, Security, Edge | 0 | — |
| 10-12 | Scope, Ordering, Consistency | 0 | — |
| 13 | Codebase Alignment | 3 | 🟠 |

### Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 0 | — |
| 🟠 MAJOR | 1 | resolved |
| 🟡 MINOR | 2 | resolved |
| 🔵 OBSERVATION | 0 | — |

---

## Findings

### PF-001: Template Home.tsx uses partials — plan must modify partials, not just the template file 🟠 MAJOR

**Dimension:** 13 — Codebase Alignment
**Location:** `plans/i18n-reload-fix/04-scaffold-app-fixes.md`, Task 2.1.4 and execution plan Task 2.1.4
**Codebase Evidence:** `scaffold/templates/webclient/src/pages/Home.tsx` lines 3, 16, 22 — uses `{{I18N_HOME_IMPORT}}`, `{{I18N_HOME_HOOK}}`, `{{I18N_HOME_USAGE}}` partials

**The Problem:** The plan says to "Update appscaffold Home page template" by editing `scaffold/templates/webclient/src/pages/Home.tsx`. But this file uses **scaffold partials** for i18n code — the hook setup is in `scaffold/partials/i18n-home-hook.txt` (`const { t } = useTranslations();`), not in the template. The `reloadTranslations` destructuring and handler function need to go in the **partials**, not in the template directly.

Specifically:
- `i18n-home-hook.txt` currently has: `const { t } = useTranslations();` — needs `reloadTranslations` added + handler function
- The reload button can go in `i18n-home-usage.txt` or in the template itself after `{{I18N_HOME_USAGE}}`

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Update `i18n-home-hook.txt` to add `reloadTranslations` + handler, add button in `i18n-home-usage.txt` | All i18n-related code stays in partials; clean separation | Partials become more complex |
| B | Update `i18n-home-hook.txt` for destructuring + handler, add button directly in template `Home.tsx` after the Get Started button | Handler in partial (i18n-specific), button in template (always present) | Button appears even when i18n is disabled — but that's fine since it's a developer utility |
| C | Put everything in partials (hook partial gets destructuring + handler, usage partial gets button) | Maximum encapsulation — no i18n code in template when feature is off | All i18n-specific |

**🎯 Recommendation:** Option C — keeps all i18n reload code in partials, so if i18n is disabled in scaffold options, the reload button doesn't appear.

**User Decision:** ⏳ Pending

---

### PF-002: Task 3.1.1 lists i18n-plugin.d.ts but it doesn't need changes 🟡 MINOR

**Dimension:** 13 — Codebase Alignment
**Location:** `plans/i18n-reload-fix/99-execution-plan.md`, Task 3.1.1
**Codebase Evidence:** `node_modules/blendsdk/dist/webafx-i18n/i18n-plugin.d.ts` — only declares `export declare function createI18nPlugin(config: I18nPluginConfig): PluginDefinition;`

**The Problem:** Task 3.1.1 says "Patch i18n-plugin.js **and i18n-plugin.d.ts**". The `.d.ts` file only declares the function signature of `createI18nPlugin()` which doesn't change — internal service registrations don't affect the public type. Only `i18n-plugin.js` needs patching.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Update task description to "Patch i18n-plugin.js only" | Accurate task description | — |
| B | Leave as-is — patching with identical content is harmless | No plan update needed | Slightly misleading |

**🎯 Recommendation:** Option A — accurate descriptions prevent confusion during execution.

**User Decision:** ⏳ Pending

---

### PF-003: Task 3.1.2 lists i18n-context.d.ts but only i18n-types.d.ts + i18n-context.js need patching 🟡 MINOR

**Dimension:** 13 — Codebase Alignment
**Location:** `plans/i18n-reload-fix/99-execution-plan.md`, Task 3.1.2
**Codebase Evidence:** `node_modules/blendsdk/dist/react/i18n/i18n-context.d.ts` — declares `I18nProvider` function and `I18nContext` const. The `reloadTranslations` type lives in `I18nContextValue` which is defined in `i18n-types.d.ts`, not in `i18n-context.d.ts`.

**The Problem:** Task 3.1.2 says "Patch i18n-context.js, **i18n-context.d.ts**, i18n-types.d.ts". The `i18n-context.d.ts` doesn't need changes because `I18nProvider`'s signature doesn't change — the new `reloadTranslations` is in the context **value type** which lives in `i18n-types.d.ts`. Only `i18n-context.js` (implementation) and `i18n-types.d.ts` (type) need patching.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Update task description to "Patch i18n-context.js and i18n-types.d.ts" | Accurate | — |
| B | Leave as-is — harmless | No plan update needed | Slightly misleading |

**🎯 Recommendation:** Option A — accuracy.

**User Decision:** ⏳ Pending
