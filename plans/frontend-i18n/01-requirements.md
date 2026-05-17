# Requirements: Full-Stack I18n Integration

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│ webclient (React)                                            │
│                                                              │
│  GlobalLoaderProvider (always)                               │
│    └─ I18nProvider (when i18n enabled)                       │
│        ├─ loader: fetchTranslations(locale)                  │
│        │    └─ GET /api/translations/:locale                 │
│        ├─ Home.tsx: useTranslations() → t('app.welcome')     │
│        └─ BrowserRouter → routes                             │
└──────────────────────────────────────────────────────────────┘
                          │
                    HTTP API calls
                          │
┌──────────────────────────────────────────────────────────────┐
│ webapi (WebAFX)                                              │
│                                                              │
│  createI18nPlugin                                            │
│    ├─ jsonFileSource('resources/i18n')  (always)             │
│    └─ postgresqlSource(pool)            (when i18nDb=true)   │
│                                                              │
│  TranslationsController                                      │
│    ├─ GET /api/translations/:locale                          │
│    │   └─ cache.getOrSet('i18n:{locale}', translator, 0)     │
│    ├─ GET /api/greeting                                      │
│    │   └─ translator.translate('app.welcome', locale)        │
│    └─ GET /api/admin/translations/cache/clear                │
│        └─ cache.deletePattern('i18n:*') + translator.reload()│
│                                                              │
│  Redis Cache: keys = {rootKey}:i18n:{locale}, TTL = 0        │
└──────────────────────────────────────────────────────────────┘
```

## Backend Requirements

### R1: I18n Plugin Configuration
- When `i18n=true`: Register `createI18nPlugin` with `jsonFileSource('resources/i18n')`
- When `i18nDb=true`: Add `postgresqlSource(pool)` as second source (DB overrides JSON)
- JSON files are the base/default translations, DB provides overrides (last-write-wins via mergeCatalogs)
- Already partially scaffolded via existing `i18n-plugin-import.txt` and `i18n-plugin-registration.txt` partials

### R2: Translations Controller
- `GET /api/translations/:locale` — Returns all translations for a locale
  - Uses Redis `cache.getOrSet('i18n:{locale}', factory, 0)` — no expiry
  - Factory calls `translator.getTranslationsForLocale(locale)`
  - Returns JSON object of key-value translation pairs
- `GET /api/greeting` — Server-side translation example
  - Resolves per-request locale
  - Returns `{ message: translator.translate('app.welcome', locale, { name: 'Server' }) }`
- `GET /api/admin/translations/cache/clear` — Manual cache invalidation
  - Calls `cache.deletePattern('i18n:*')` to clear all cached translations
  - Reloads Translator from all sources (JSON + optional DB)
  - Returns `{ cleared: true }`

### R3: Sample Translations File
- `resources/i18n/en.json` with keys:
  - `app.title`, `app.welcome` (with `{name}` interpolation)
  - `common.loading`, `common.error`
  - `items.count` with plural forms (zero/one/other)

### R4: Database Migration (when i18nDb=true)
- Generated via codegen package: `resources/database/001-translations.sql`
- CREATE TABLE `translations` with: `id`, `locale`, `key`, `value`, `created_at`, `updated_at`
- Unique constraint on `(locale, key)`

## Frontend Requirements

### R5: GlobalLoaderProvider (always)
- Wraps entire app in `main.tsx`
- Import from `blendsdk/react`
- Always present regardless of i18n setting

### R6: I18nProvider (when i18n=true)
- Wraps `BrowserRouter` inside `GlobalLoaderProvider`
- Configured with loader function and default locale
- Import from `blendsdk/react`

### R7: Translation Loader
- `system/i18n/loader.ts` — async function fetching `GET /api/translations/:locale`
- Returns translation catalog object

### R8: Frontend Translation Example
- `Home.tsx` uses `useTranslations()` hook from `blendsdk/react`
- Shows `t('app.welcome', { name: 'User' })` interpolation
- Shows `t('items.count', { count: 3 })` plurals

### R9: Dependencies
- `blendsdk` always added to webclient `package.json` (useful beyond i18n)
- `@blendsdk/webafx-i18n` added to webapi `package.json` when i18n=true

## Scaffold Infrastructure Requirements

### R10: Types
- Add `i18nDb: boolean` to `ScaffoldAnswers` and `ScaffoldFlags`

### R11: Prompts
- Add follow-up question "Include database translations?" when i18n=true (default: false)

### R12: CLI Flags
- Add `--i18n-db` / `--no-i18n-db` flags

### R13: Partials
New partials needed:
- `i18n-controller-import.txt` — import for translations controller
- `i18n-controller-registration.txt` — controller registration line
- `i18n-db-source.txt` — postgresqlSource config line for plugin
- `i18n-provider-import.txt` — frontend I18nProvider import
- `i18n-provider-open.txt` — `<I18nProvider ...>` opening tag
- `i18n-provider-close.txt` — `</I18nProvider>` closing tag
- `i18n-home-import.txt` — useTranslations import in Home.tsx
- `i18n-home-usage.txt` — translation usage JSX in Home.tsx
- `i18n-system-export.txt` — loader export from system/index.ts
- `globalloader-import.txt` — GlobalLoaderProvider import (always)
- `globalloader-open.txt` — `<GlobalLoaderProvider>` open (always)
- `globalloader-close.txt` — `</GlobalLoaderProvider>` close (always)

### R14: Generator Logic
- `buildTemplateVars()` — inject all new partials based on `answers.i18n` and `answers.i18nDb`
- `buildFileList()` — conditionally add translations controller, en.json, loader.ts, migration
- GlobalLoaderProvider partials always injected (not conditional on i18n)
