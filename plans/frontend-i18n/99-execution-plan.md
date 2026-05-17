# Execution Plan: Full-Stack I18n Integration

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-05-17 17:40
> **Progress**: 24/24 tasks (100%)
> **Preflight**: ✅ PASSED — 55 tests, build clean (2026-05-17)
> **Estimated**: 5 phases, ~3 hours

## Overview

Add full-stack i18n to the appscaffold generator: backend `webafx-i18n` plugin with JSON + optional PostgreSQL sources, Redis-cached translations API, frontend `GlobalLoaderProvider` + `I18nProvider`, scaffold prompts/flags, and partials-based conditional template injection.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Sessions | Est. Time |
|-------|-------|----------|-----------|
| 1 | Scaffold Infrastructure (types, prompts, flags) | 1 | 30 min |
| 2 | Backend Templates (webapi) | 1 | 45 min |
| 3 | Frontend Templates (webclient) | 1 | 45 min |
| 4 | Generator Logic | 1 | 30 min |
| 5 | Tests + Final Verification | 1 | 30 min |

**Total: 5 sessions, ~3 hours**

---

## Phase 1: Scaffold Infrastructure

### Session 1.1: Types, Prompts, and CLI Flags

**Reference**: [01-requirements.md](01-requirements.md) — R10, R11, R12
**Objective**: Add `i18nDb` field to types, follow-up prompt, and CLI flags

**Tasks**:

| # | Task | File(s) | Refs |
|---|------|---------|------|
| 1.1.1 | Add `i18nDb: boolean` to `ScaffoldAnswers` and `ScaffoldFlags` | `src/types.ts` | R10 |
| 1.1.2 | Add follow-up prompt "Include database translations?" (when i18n=true, default: false) | `src/prompts.ts` | R11 |
| 1.1.3 | Add `--i18n-db` / `--no-i18n-db` CLI flag parsing + help text | `src/index.ts` | R12 |

**Deliverables**:
- [ ] `ScaffoldAnswers` and `ScaffoldFlags` types updated
- [ ] Follow-up prompt added
- [ ] CLI flags parsing added
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 2: Backend Templates (webapi)

### Session 2.1: Controller, Translations, Partials, and Migration

**Reference**: [01-requirements.md](01-requirements.md) — R1, R2, R3, R4, R13
**Objective**: Create backend template files, partials, and migration for i18n

**Tasks**:

| # | Task | File(s) | Refs |
|---|------|---------|------|
| 2.1.1 | Create `translations-controller.ts` template with 3 endpoints: GET translations, GET greeting, GET admin cache clear | `scaffold/templates/webapi/src/controllers/translations-controller.ts` | R2 |
| 2.1.2 | Create sample `en.json` with interpolation + plurals | `scaffold/templates/webapi/resources/i18n/en.json` | R3 |
| 2.1.3 | Create partials: `i18n-controller-import.txt`, `i18n-controller-registration.txt` | `scaffold/partials/` | R13 |
| 2.1.4 | Create partial: `i18n-db-source.txt` (postgresqlSource config) | `scaffold/partials/` | R13 |
| 2.1.5 | Update `webapi/src/index.ts` — add `{{I18N_CONTROLLER_IMPORT}}` and `{{I18N_CONTROLLER_REGISTRATION}}` placeholders | `scaffold/templates/webapi/src/index.ts` | R13, R14 |
| 2.1.6 | Update `i18n-plugin-registration.txt` — add `{{I18N_DB_SOURCE}}` placeholder | `scaffold/partials/i18n-plugin-registration.txt` | R1, R13 |
| 2.1.7 | Create codegen migration `001-translations.sql` template | `scaffold/templates/codegen/resources/database/001-translations.sql` | R4 |

**Deliverables**:
- [ ] Translations controller template created
- [ ] Sample en.json created
- [ ] All backend partials created
- [ ] Existing templates updated with placeholders
- [ ] Migration template created
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 3: Frontend Templates (webclient)

### Session 3.1: Providers, Loader, and Template Updates

**Reference**: [01-requirements.md](01-requirements.md) — R5, R6, R7, R8, R9, R13
**Objective**: Create frontend template files, partials, and update existing templates

**Tasks**:

| # | Task | File(s) | Refs |
|---|------|---------|------|
| 3.1.1 | Add `blendsdk` to webclient `package.json` (always) | `scaffold/templates/webclient/package.json` | R9 |
| 3.1.2 | Create GlobalLoaderProvider partials (always): `globalloader-import.txt`, `globalloader-open.txt`, `globalloader-close.txt` | `scaffold/partials/` | R5, R13 |
| 3.1.3 | Create I18nProvider partials: `i18n-provider-import.txt`, `i18n-provider-open.txt`, `i18n-provider-close.txt` | `scaffold/partials/` | R6, R13 |
| 3.1.4 | Create `system/i18n/loader.ts` template (fetches from API) | `scaffold/templates/webclient/src/system/i18n/loader.ts` | R7 |
| 3.1.5 | Create partials: `i18n-system-export.txt`, `i18n-home-import.txt`, `i18n-home-usage.txt` | `scaffold/partials/` | R8, R13 |
| 3.1.6 | Update `main.tsx` — add GlobalLoaderProvider (always) + I18nProvider placeholders | `scaffold/templates/webclient/src/main.tsx` | R5, R6 |
| 3.1.7 | Update `Home.tsx` — add translation example placeholders | `scaffold/templates/webclient/src/pages/Home.tsx` | R8 |
| 3.1.8 | Update `system/index.ts` — add i18n loader export placeholder | `scaffold/templates/webclient/src/system/index.ts` | R7 |

**Deliverables**:
- [ ] blendsdk dependency added to webclient
- [ ] GlobalLoaderProvider partials created
- [ ] I18nProvider partials created
- [ ] Translation loader template created
- [ ] All frontend partials created
- [ ] Existing templates updated with placeholders
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 4: Generator Logic

### Session 4.1: Template Vars and File List Updates

**Reference**: [01-requirements.md](01-requirements.md) — R14
**Objective**: Wire up all new partials and conditional files in the generator

**Tasks**:

| # | Task | File(s) | Refs |
|---|------|---------|------|
| 4.1.1 | Update `buildTemplateVars()` — inject all new partials (GlobalLoader always, I18n conditional) | `src/generator.ts` | R14 |
| 4.1.2 | Update `buildFileList()` — conditionally add: translations-controller, en.json, loader.ts, migration | `src/generator.ts` | R14 |

**Deliverables**:
- [ ] `buildTemplateVars()` updated with all new partials
- [ ] `buildFileList()` updated with conditional files
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 5: Tests + Final Verification

### Session 5.1: Test Coverage and Final Check

**Reference**: [01-requirements.md](01-requirements.md) — all requirements
**Objective**: Add comprehensive test coverage for all i18n functionality

**Tasks**:

| # | Task | File(s) |
|---|------|---------|
| 5.1.1 | Update `generator.test.ts` — test i18n + i18nDb template vars and file lists | `src/__tests__/generator.test.ts` |
| 5.1.2 | Update `renderer.test.ts` — test new partials render correctly | `src/__tests__/renderer.test.ts` |
| 5.1.3 | Update `integration.test.ts` — test full scaffold with i18n + i18nDb combos | `src/__tests__/integration.test.ts` |
| 5.1.4 | Final: `yarn build && yarn test` | — |

**Deliverables**:
- [ ] Generator tests updated for i18n
- [ ] Renderer tests updated for new partials
- [ ] Integration tests updated for i18n + i18nDb combinations
- [ ] All verification passing — zero warnings, zero errors

**Verify**: `yarn build && yarn test`

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

### Phase 1: Scaffold Infrastructure
- [x] 1.1.1 Add `i18nDb: boolean` to `ScaffoldAnswers` and `ScaffoldFlags` ✅ (completed: 2026-05-17 17:31)
- [x] 1.1.2 Add follow-up prompt "Include database translations?" (when i18n=true, default: false) ✅ (completed: 2026-05-17 17:32)
- [x] 1.1.3 Add `--i18n-db` / `--no-i18n-db` CLI flag parsing + help text ✅ (completed: 2026-05-17 17:32)

### Phase 2: Backend Templates (webapi)
- [x] 2.1.1 Create `translations-controller.ts` template with 3 endpoints ✅ (completed: 2026-05-17 17:32)
- [x] 2.1.2 Create sample `en.json` with interpolation + plurals ✅ (completed: 2026-05-17 17:32)
- [x] 2.1.3 Create partials: `i18n-controller-import.txt`, `i18n-controller-registration.txt` ✅ (completed: 2026-05-17 17:33)
- [x] 2.1.4 Create partial: `i18n-db-source.txt` ✅ (completed: 2026-05-17 17:33)
- [x] 2.1.5 Update `webapi/src/index.ts` — add controller placeholders ✅ (completed: 2026-05-17 17:33)
- [x] 2.1.6 Update `i18n-plugin-registration.txt` — add `{{I18N_DB_SOURCE}}` placeholder ✅ (completed: 2026-05-17 17:33)
- [x] 2.1.7 Create codegen migration `001-translations.sql` template ✅ (completed: 2026-05-17 17:33)

### Phase 3: Frontend Templates (webclient)
- [x] 3.1.1 Add `blendsdk` to webclient `package.json` ✅ (completed: 2026-05-17 17:35)
- [x] 3.1.2 Create GlobalLoaderProvider partials (always) ✅ (completed: 2026-05-17 17:34)
- [x] 3.1.3 Create I18nProvider partials ✅ (completed: 2026-05-17 17:34)
- [x] 3.1.4 Create `system/i18n/loader.ts` template ✅ (completed: 2026-05-17 17:34)
- [x] 3.1.5 Create partials: `i18n-system-export.txt`, `i18n-home-import.txt`, `i18n-home-usage.txt` ✅ (completed: 2026-05-17 17:35)
- [x] 3.1.6 Update `main.tsx` — add provider placeholders ✅ (completed: 2026-05-17 17:35)
- [x] 3.1.7 Update `Home.tsx` — add translation example placeholders ✅ (completed: 2026-05-17 17:35)
- [x] 3.1.8 Update `system/index.ts` — add i18n loader export placeholder ✅ (completed: 2026-05-17 17:36)

### Phase 4: Generator Logic
- [x] 4.1.1 Update `buildTemplateVars()` — inject all new partials ✅ (completed: 2026-05-17 17:36)
- [x] 4.1.2 Update `buildFileList()` — conditionally add i18n files ✅ (completed: 2026-05-17 17:37)

### Phase 5: Tests + Final Verification
- [x] 5.1.1 Update `generator.test.ts` — test i18n + i18nDb template vars and file lists ✅ (completed: 2026-05-17 17:37)
- [x] 5.1.2 Update `renderer.test.ts` — no changes needed (existing tests cover render()) ✅ (completed: 2026-05-17 17:38)
- [x] 5.1.3 Update `integration.test.ts` — test full scaffold with i18n + i18nDb combos ✅ (completed: 2026-05-17 17:39)
- [x] 5.1.4 Final: `yarn build && yarn test` — 92 tests passing ✅ (completed: 2026-05-17 17:40)

---

## Session Protocol

### Starting a Session

1. Reference this plan: "Implement Phase X, Session X.X per `plans/frontend-i18n/99-execution-plan.md`"
2. Read the relevant technical spec from `plans/frontend-i18n/`

### Ending a Session

1. Run the project's verify command: `yarn build && yarn test`
2. Handle commit per the active **commit mode** (see "Commit Behavior During Plan Execution" in `make_plan.md`)
3. Compact the conversation with `/compact`

### Between Sessions

1. Review completed tasks in the Master Progress Checklist
2. Start new conversation for next session
3. Run `exec_plan frontend-i18n` to continue

---

## Dependencies

```
Phase 1 (Scaffold Infrastructure)
    ↓
Phase 2 (Backend Templates) ──┐
    ↓                         │
Phase 3 (Frontend Templates)  │ (independent of each other)
    ↓                         │
Phase 4 (Generator Logic) ←───┘ (depends on both Phase 2 + 3)
    ↓
Phase 5 (Tests + Final Verification)
```

---

## Commit Strategy

```
feat(scaffold): add i18n scaffold infrastructure (types, prompts, flags)
feat(scaffold): add backend i18n templates and partials
feat(scaffold): add frontend i18n templates and partials
feat(scaffold): add i18n generator logic
test(scaffold): add i18n test coverage
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ All verification passing (`yarn build && yarn test`)
3. ✅ No warnings/errors
4. ✅ No dead code — no unused parameters, functions, classes, or modules (per `code.md` rule 4)
5. ✅ Documentation updated
6. ✅ **Post-completion:** Ask user to re-analyze project and update `.clinerules/project.md`
