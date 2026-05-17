# RD-01: Data Router (createBrowserRouter)

> **Document**: RD-01-data-router.md
> **Status**: Captured
> **Created**: 2025-05-17
> **Project**: appscaffold — scaffold webclient template
> **Depends On**: —

---

## Feature Overview

Switch the webclient template's routing from the component-based pattern
(`<BrowserRouter>` + `<Routes>` + `<Route>`) to the data router pattern
(`createBrowserRouter` + `RouterProvider`).

The data router pattern is React Router's recommended approach for complex
applications. It unlocks route-level data loading (`loader`), mutations
(`action`), per-route error boundaries, and lazy route loading — none of
which are available with the component-based approach.

---

## Current State

The scaffold currently generates this routing setup:

| File | Role |
|------|------|
| `main.tsx` | Wraps `<App />` in `<BrowserRouter>` |
| `App.tsx` | Defines route tree using `<Routes>` + `<Route>` components |
| `system/routing/routes.ts` | Exports path constants only |
| `components/Layout/Layout.tsx` | Root layout with `<Outlet />` |
| `pages/Home.tsx` | Home page component |

---

## Functional Requirements

### Must Have

- [ ] Replace `<BrowserRouter>` in `main.tsx` with `RouterProvider` from `react-router`
- [ ] Create the router using `createBrowserRouter` with a `RouteObject[]` array
- [ ] Route tree: Layout as parent route → Home as `index` child
- [ ] Delete `App.tsx` — route tree replaces it entirely
- [ ] Export both `router` and path constants (`routes`) from `system/routing/`
- [ ] Update `system/index.ts` barrel exports
- [ ] Rename `routes.ts` → `routes.tsx` (contains JSX for route elements)

### Won't Have (Out of Scope)

- Adding loaders, actions, or error boundaries to the scaffold (those are app-specific)
- Changing Layout or Home page components (they already use `<Outlet />`)
- Changing any non-webclient templates

---

## Technical Requirements

### Affected Files

| File | Action | Notes |
|------|--------|-------|
| `scaffold/templates/webclient/src/main.tsx` | **Modify** | `RouterProvider` + import `router` |
| `scaffold/templates/webclient/src/App.tsx` | **Delete** | Replaced by route config in routes.tsx |
| `scaffold/templates/webclient/src/system/routing/routes.ts` | **Replace** → `routes.tsx` | `createBrowserRouter` + path constants |
| `scaffold/templates/webclient/src/system/index.ts` | **Modify** | Export `router` |
| `scaffold/templates/webclient/src/components/Layout/Layout.tsx` | No change | Already uses `<Outlet />` |
| `scaffold/templates/webclient/src/pages/Home.tsx` | No change | Pure page component |

### Target Pattern

**`routes.tsx`** — single file defining both path constants and the router:

```tsx
import { createBrowserRouter } from 'react-router';
import { Layout } from '../../components/Layout/Layout.js';
import { Home } from '../../pages/Home.js';

export const routes = {
    home: '/',
} as const;

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
        ],
    },
]);
```

**`main.tsx`** — uses `RouterProvider` instead of `BrowserRouter`:

```tsx
import { RouterProvider } from 'react-router';
import { router } from './system/routing/routes.js';

root.render(
    <FluentProvider theme={webLightTheme}>
        <RouterProvider router={router} />
    </FluentProvider>,
);
```

---

## Acceptance Criteria

1. [ ] `App.tsx` no longer exists in the webclient template
2. [ ] `routes.tsx` creates the router via `createBrowserRouter`
3. [ ] `main.tsx` uses `RouterProvider` (no `BrowserRouter`)
4. [ ] Path constants (`routes.home`, etc.) are still exported
5. [ ] `yarn build && yarn test` passes
