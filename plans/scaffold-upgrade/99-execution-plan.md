# Execution Plan: Scaffold Template Upgrade

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2025-05-06 11:05
> **Progress**: 6/6 tasks (100%)
> **CodeOps Version**: 1.0.0

## Overview

Upgrade the scaffold template: React 19, mailer default to true, install script post-scaffold prompt.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Sessions | Est. Time |
|-------|-------|----------|-----------|
| 1 | Source Changes | 1 | 15 min |
| 2 | Build & Verify | 1 | 5 min |

**Total: 1 session, ~20 min**

---

## Phase 1: Source Changes

### Session 1.1: All Source Modifications

**Reference**: [Changes Spec](03-changes-spec.md)
**Objective**: Apply all source changes across 4 files

**Tasks**:

| # | Task | File |
|---|------|------|
| 1.1.1 | Update React deps from 18 to 19 | `scaffold/templates/webclient/package.json` |
| 1.1.2 | Change mailer default to true (interactive + non-interactive) | `src/prompts.ts` |
| 1.1.3 | Update help text (mailer default) and Next Steps (`yarn install && yarn ncu`) | `src/index.ts` |
| 1.1.4 | Add yarn preflight check and post-scaffold Y/n prompt | `install.sh` |

**Deliverables**:
- [ ] React 19 in webclient template
- [ ] Mailer defaults to true everywhere
- [ ] Next Steps shows `yarn install && yarn ncu`
- [ ] Install script has yarn check and prompt

---

## Phase 2: Build & Verify

### Session 2.1: Rebuild and Test

**Objective**: Rebuild scaffold.js and verify all tests pass

**Tasks**:

| # | Task | File |
|---|------|------|
| 2.1.1 | Run `yarn build` to regenerate scaffold.js | `scaffold/scaffold.js` |
| 2.1.2 | Run `yarn build && yarn test` for full verification | — |

**Deliverables**:
- [ ] scaffold.js rebuilt with all changes
- [ ] All tests passing

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## 🚨 Master Progress Checklist (All Phases) — MANDATORY

> **⚠️ EXECUTION RULE — APPLIES TO EVERY AGENT EXECUTING THIS PLAN:**
>
> This checklist is the **single source of truth** for tracking progress across all phases.
> The executing agent **MUST** follow these rules without exception:
>
> 1. **After completing each task:** Mark it `[x]` with a timestamp
> 2. **After completing each phase:** Review ALL tasks in that phase
> 3. **Update the Progress header** after every update
> 4. **This checklist MUST exist** — reconstruct from phase details if missing
> 5. **Never batch updates** — update immediately after each task

### Phase 1: Source Changes
- [x] 1.1.1 Update React deps from 18 to 19 ✅ (completed: 2025-05-06 11:04)
- [x] 1.1.2 Change mailer default to true ✅ (completed: 2025-05-06 11:04)
- [x] 1.1.3 Update help text and Next Steps ✅ (completed: 2025-05-06 11:04)
- [x] 1.1.4 Add yarn check and post-scaffold prompt to install.sh ✅ (completed: 2025-05-06 11:04)

### Phase 2: Build & Verify
- [x] 2.1.1 Rebuild scaffold.js ✅ (completed: 2025-05-06 11:05)
- [x] 2.1.2 Full verification (build + test) ✅ (completed: 2025-05-06 11:05)

---

## Session Protocol

### Starting a Session

1. Reference this plan: "Implement Phase X, Session X.X per `plans/scaffold-upgrade/99-execution-plan.md`"

### Ending a Session

1. Run: `clear && sleep 3 && yarn build && yarn test`
2. Handle commit per active commit mode
3. Compact with `/compact`

---

## Dependencies

```
Phase 1 (source changes)
    ↓
Phase 2 (build & verify)
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ All verification passing (`yarn build && yarn test`)
3. ✅ No warnings/errors
4. ✅ Documentation updated
5. ✅ **Post-completion:** Ask user to re-analyze project and update `.clinerules/project.md`
