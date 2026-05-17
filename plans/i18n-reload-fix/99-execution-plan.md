# Execution Plan: i18n Reload Fix

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-05-17 19:13
> **Progress**: 9/9 tasks (100%)

## Overview

Fix the i18n translation reload mechanism across BlendSDK v5, the scaffolded test app, and appscaffold templates. The cache clear endpoint must re-read JSON files from disk, and the React frontend needs a `reloadTranslations()` function and a button to trigger it.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Sessions | Est. Time |
|-------|-------|----------|-----------|
| 1 | BlendSDK Fixes | 1 | 20 min |
| 2 | Scaffold App + Template Fixes | 1 | 15 min |
| 3 | Patch & Verify | 1 | 15 min |

**Total: 1 session, ~50 min**

---

## Phase 1: BlendSDK Fixes

### Session 1.1: i18n Plugin + React Context

**Reference**: [BlendSDK Fixes](03-blendsdk-fixes.md)
**Objective**: Register reload service in i18n plugin, add `reloadTranslations()` to React context

**Tasks**:

| # | Task | File |
|---|------|------|
| 1.1.1 | Register `${serviceName}:reload` service in i18n plugin | `blendsdk-v5/packages/webafx-i18n/src/i18n-plugin.ts` |
| 1.1.2 | Add `reloadTranslations` to `I18nContextValue` type | `blendsdk-v5/packages/react/src/i18n/i18n-types.ts` |
| 1.1.3 | Implement `reloadTranslations` in `I18nProvider` | `blendsdk-v5/packages/react/src/i18n/i18n-context.tsx` |

**Deliverables**:
- [ ] Reload service registered in i18n plugin
- [ ] `reloadTranslations()` exposed via React context
- [ ] BlendSDK builds cleanly

**Verify**: `cd /home/gevik/workdir/github/TrueSoftware/blendsdk-v5 && yarn build`

---

## Phase 2: Scaffold App + Template Fixes

### Session 2.1: Controller + Home Page

**Reference**: [Scaffold App Fixes](04-scaffold-app-fixes.md)
**Objective**: Fix clearCache controller, add reload button, update scaffold templates

**Tasks**:

| # | Task | File |
|---|------|------|
| 2.1.1 | Fix `clearCache` to call reload service + clear Redis | `test1/packages/webapi/src/controllers/translations-controller.ts` |
| 2.1.2 | Add "Reload Translations" button to Home page | `test1/packages/webclient/src/pages/Home.tsx` |
| 2.1.3 | Update appscaffold controller template | `appscaffold/scaffold/templates/webapi/src/controllers/translations-controller.ts` |
| 2.1.4 | Update appscaffold Home page template | `appscaffold/scaffold/templates/webclient/src/pages/Home.tsx` |

**Deliverables**:
- [ ] Controller reloads sources before clearing cache
- [ ] Home page has reload button
- [ ] Templates match live fixes

**Verify**: `cd /home/gevik/workdir/github/appscaffold && yarn build && yarn test`

---

## Phase 3: Patch & Verify

### Session 3.1: Patch dist files and verify builds

**Reference**: [Scaffold App Fixes — Change 3](04-scaffold-app-fixes.md)
**Objective**: Patch BlendSDK dist files in test1's node_modules, verify everything builds

**Tasks**:

| # | Task | File |
|---|------|------|
| 3.1.1 | Patch i18n-plugin.js and i18n-plugin.d.ts in test1 node_modules | `test1/node_modules/blendsdk/dist/webafx-i18n/i18n-plugin.*` |
| 3.1.2 | Patch i18n-context.js, i18n-context.d.ts, i18n-types.d.ts in test1 node_modules | `test1/node_modules/blendsdk/dist/react/i18n/*` |

**Deliverables**:
- [ ] test1 webapi builds cleanly
- [ ] test1 webclient builds cleanly
- [ ] All patched files match blendsdk-v5 source changes

**Verify**: `cd /home/gevik/workdir/github/scaffold-tests/test1 && yarn build`

---

## 🚨 Master Progress Checklist (All Phases) — MANDATORY

> **⚠️ EXECUTION RULE — APPLIES TO EVERY AGENT EXECUTING THIS PLAN:**
>
> This checklist is the **single source of truth** for tracking progress across all phases.
> The executing agent **MUST** follow these rules without exception:
>
> 1. **After completing each task:** Mark it `[x]` with a timestamp — e.g., `- [x] 1.1.1 Task description ✅ (completed: YYYY-MM-DD HH:MM)`
> 2. **After completing each phase:** Review ALL tasks in that phase and confirm every completed task is marked `[x]` with a timestamp
> 3. **Update the Progress header** (`> **Progress**: X/Y tasks (Z%)`) in this document's frontmatter after every update
> 4. **This checklist MUST exist** — if it is missing or incomplete, the agent must reconstruct it from the phase details above before executing any task
> 5. **Never batch updates** — update immediately after each task, not at the end of a session
>
> Failure to maintain this checklist means progress is invisible after crashes, context resets, or session handoffs.

### Phase 1: BlendSDK Fixes
- [x] 1.1.1 Register `${serviceName}:reload` service in i18n plugin ✅ (completed: 2026-05-17 19:07)
- [x] 1.1.2 Add `reloadTranslations` to `I18nContextValue` type ✅ (completed: 2026-05-17 19:07)
- [x] 1.1.3 Implement `reloadTranslations` in `I18nProvider` ✅ (completed: 2026-05-17 19:08)

### Phase 2: Scaffold App + Template Fixes
- [x] 2.1.1 Fix `clearCache` to call reload service + clear Redis ✅ (completed: 2026-05-17 19:09)
- [x] 2.1.2 Add "Reload Translations" button to Home page ✅ (completed: 2026-05-17 19:09)
- [x] 2.1.3 Update appscaffold controller template ✅ (completed: 2026-05-17 19:10)
- [x] 2.1.4 Update appscaffold Home page template ✅ (completed: 2026-05-17 19:11)

### Phase 3: Patch & Verify
- [x] 3.1.1 Patch i18n-plugin.js and i18n-plugin.d.ts in test1 node_modules ✅ (completed: 2026-05-17 19:12)
- [x] 3.1.2 Patch i18n-context.js, i18n-context.d.ts, i18n-types.d.ts in test1 node_modules ✅ (completed: 2026-05-17 19:12)

---

## Session Protocol

### Starting a Session

1. Reference this plan: "Implement Phase X, Session X.X per `plans/i18n-reload-fix/99-execution-plan.md`"

### Ending a Session

1. Run verification commands
2. Handle commit per the active commit mode
3. Compact the conversation with `/compact`

---

## Dependencies

```
Phase 1 (BlendSDK fixes)
    ↓
Phase 2 (Scaffold app + template fixes)
    ↓
Phase 3 (Patch dist + verify builds)
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ All builds passing (blendsdk-v5, appscaffold, test1)
3. ✅ No warnings/errors
4. ✅ No dead code
5. ✅ Appscaffold templates match scaffolded app fixes
6. ✅ **Post-completion:** Ask user to re-analyze project and update `.clinerules/project.md`
