# RD-02: Frontend I18n Integration (Scaffold Webclient Template)

> **Document**: RD-02-frontend-i18n.md
> **Status**: Captured
> **Created**: 2025-05-17
> **Project**: appscaffold — scaffold webclient template
> **Depends On**: RD-01 (Data Router), BlendSDK `@blendsdk/react` I18nProvider (see blendsdk-v5/requirements/RD-01-react-i18n.md)

---

## Feature Overview

When i18n is enabled in the scaffold, wire up the `I18nProvider` and
`useTranslations()` from `@blendsdk/react` in the webclient template. This
includes adding the provider to the component tree, creating a default
translation loader that fetches from the webapi, and providing an example
translation usage in the Home page.

---

## Functional Requirements

### Must Have

- [ ] Add `@blendsdk/react` I18nProvider to the webclient template's `main.tsx` (inside `GlobalLoaderProvider`, wrapping the router)
- [ ] Create a default `TranslationLoader` function in `system/i18n/loader.ts` that fetches from `/api/translations/:locale`
- [ ] Add a translations API endpoint to the webapi template (`/api/translations/:locale`)
- [ ] Add example `useTranslations()` usage in the Home page
- [ ] Add a sample translation JSON file (`resources/i18n/en.json`) to the webapi template
- [ ] Wire up conditionally — only when i18n option is enabled in scaffold prompts
- [ ] Export the loader from `system/index.ts`

### Won't Have (Out of Scope)

- Implementing `I18nProvider` or `useTranslations()` — that's in `@blendsdk/react` (BlendSDK RD-01)
- Language switcher UI — application-specific
- Multiple locale files — scaffold provides one example (`en.json`)

---

## Technical Requirements

### Affected Files (webclient template)

| File | Action | Notes |
|------|--------|-------|
| `scaffold/templates/webclient/src/main.tsx` | **Modify** | Add `I18nProvider` wrapping the router |
| `scaffold/templates/webclient/src/system/i18n/loader.ts` | **Create** | Default `TranslationLoader` fetching from API |
| `scaffold/templates/webclient/src/system/index.ts` | **Modify** | Export loader |
| `scaffold/templates/webclient/src/pages/Home.tsx` | **Modify** | Example `useTranslations()` usage |

### Affected Files (webapi template)

| File | Action | Notes |
|------|--------|-------|
| `scaffold/templates/webapi/src/controllers/translations-controller.ts` | **Create** | `/api/translations/:locale` endpoint |
| `scaffold/templates/webapi/resources/i18n/en.json` | **Create** | Sample translations |

### Target Component Tree

```tsx
<FluentProvider theme={webLightTheme}>
    <GlobalLoaderProvider>
        <I18nProvider loader={fetchTranslations} defaultLocale="en">
            <RouterProvider router={router} />
        </I18nProvider>
    </GlobalLoaderProvider>
</FluentProvider>
```

---

## Acceptance Criteria

1. [ ] Scaffolded webclient has `I18nProvider` in component tree (when i18n enabled)
2. [ ] Scaffolded webapi has translations endpoint
3. [ ] Home page shows a translated string
4. [ ] `yarn build && yarn test` passes
