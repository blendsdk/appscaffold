# Templates — WebClient (Vite + React + FluentUI v9)

> **Document**: 06-templates-webclient.md
> **Parent**: [Index](00-index.md)

## Overview

Templates for the `packages/webclient` package — a Vite + React 18 + FluentUI v9 + TypeScript frontend application with React Router v7, zod validation, and Griffel styling.

## Template Files

### `webclient/package.json`

```json
{
  "name": "{{PACKAGE_SCOPE}}/webclient",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite --port {{FRONTEND_PORT}}",
    "build": "tsc && vite build --outDir ../webapi/resources/public/static",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "{{PACKAGE_SCOPE}}/shared": "^1.0.0",
    "@fluentui/react-components": "^9.72.0",
    "@fluentui/react-icons": "^2.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router": "^7.0.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.9.0",
    "vite": "^6.2.0",
    "vitest": "^4.1.0"
  }
}
```

### `webclient/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `webclient/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "composite": true
  },
  "include": ["vite.config.ts"]
}
```

### `webclient/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: {{FRONTEND_PORT}},
        proxy: {
            '/api': {
                target: 'http://localhost:{{BACKEND_PORT}}',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: '../webapi/resources/public/static',
        emptyOutDir: true,
    },
});
```

### `webclient/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{{PROJECT_NAME}}</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### `webclient/src/main.tsx`

Entry point with FluentProvider.

```typescript
import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter } from 'react-router';
import { App } from './App.js';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);

root.render(
    <FluentProvider theme={webLightTheme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </FluentProvider>,
);
```

### `webclient/src/App.tsx`

Root application component with routing.

```typescript
import { Routes, Route } from 'react-router';
import { Layout } from './components/Layout/Layout.js';
import { Home } from './pages/Home.js';

export const App: React.FC = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
};
```

### `webclient/src/components/Layout/Layout.tsx`

Shell layout with FluentUI v9 components.

```typescript
import * as React from 'react';
import { Outlet } from 'react-router';
import { makeStyles, tokens, Title3 } from '@fluentui/react-components';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
    },
    main: {
        flex: 1,
        padding: tokens.spacingHorizontalXL,
    },
});

export const Layout: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <Title3>{{PROJECT_NAME}}</Title3>
            </header>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};
```

### `webclient/src/pages/Home.tsx`

Landing page.

```typescript
import * as React from 'react';
import { makeStyles, tokens, Title1, Body1, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalL,
        padding: tokens.spacingVerticalXXL,
    },
});

export const Home: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Title1>Welcome to {{PROJECT_NAME}}</Title1>
            <Body1>Your application is running successfully.</Body1>
            <Button appearance="primary">Get Started</Button>
        </div>
    );
};
```

### `webclient/src/theme/index.ts`

Theme configuration.

```typescript
import { webLightTheme, webDarkTheme, type Theme } from '@fluentui/react-components';

export const lightTheme: Theme = webLightTheme;
export const darkTheme: Theme = webDarkTheme;
```

### `webclient/src/styles/global.css`

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: var(--fontFamilyBase);
}

#root {
    min-height: 100vh;
}
```

### `webclient/src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```

### `webclient/src/api/index.ts`

```typescript
/**
 * API client module for {{PROJECT_NAME}}.
 * Generated API clients (from codegen) will be placed here.
 */
```

### `webclient/src/system/index.ts` and `webclient/src/system/routing/routes.ts`

Placeholder routing and system config files.

### `webclient/public/favicon.svg` and `webclient/public/robots.txt`

Standard static assets.

### `webclient/.gitignore`

```gitignore
dist/
node_modules/
```

## Directory Structure

```
webclient/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── vite-env.d.ts
    ├── api/
    │   └── index.ts
    ├── components/
    │   └── Layout/
    │       └── Layout.tsx
    ├── pages/
    │   └── Home.tsx
    ├── styles/
    │   └── global.css
    ├── system/
    │   ├── index.ts
    │   └── routing/
    │       └── routes.ts
    └── theme/
        └── index.ts
```
