# Scaffold Webclient Improvements — Requirements Documents

> **Project**: appscaffold — BlendSDK application scaffold generator
> **Status**: Collecting
> **Created**: 2025-05-17
> **Scope**: Webclient template improvements

---

## Overview

This requirements set collects improvements to the scaffold's webclient template
(`scaffold/templates/webclient/`). Each RD captures one self-contained improvement.
Once collection is complete, these feed into `make_plan` for implementation.

## Document Index

| # | Document | Description | Status |
|---|----------|-------------|--------|
| **RD-01** | [Data Router](RD-01-data-router.md) | Switch routing to `createBrowserRouter` + `RouterProvider` | ✅ Captured |
| **RD-02** | [Frontend I18n](RD-02-frontend-i18n.md) | Wire up `I18nProvider` + `useTranslations()` in webclient template | ✅ Captured |

## Suggested Implementation Order

| Phase | Documents | Description |
|-------|-----------|-------------|
| **A** | RD-01 | Core routing architecture change |
| **B** | RD-02 | Frontend i18n integration (depends on BlendSDK `@blendsdk/react` i18n feature) |

## How to Use These Documents

1. Finish collecting requirements (`add_requirement`)
2. Run `make_plan` to create an implementation plan from these RDs
3. Run `exec_plan [feature-name]` to implement
