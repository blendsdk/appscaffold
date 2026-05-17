# Testing Strategy: i18n Reload Fix

> **Document**: 07-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

This is a bug fix across three codebases. Testing is primarily manual/integration since the changes are in framework wiring and UI, not algorithmic logic.

- BlendSDK: Build verification (no new unit tests — changes are service registration wiring)
- Scaffolded app: Build verification + manual integration test
- Appscaffold: Build verification

## Test Categories

### Build Verification

| Test | Description | Priority |
|------|-------------|----------|
| BlendSDK build | `yarn build` in blendsdk-v5 | High |
| Appscaffold build | `yarn build` in appscaffold | High |
| Test1 webapi build | `yarn build` in test1 (after patching) | High |
| Test1 webclient build | `yarn build` in test1 (after patching) | High |

### Manual Integration Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Cache clear reloads sources | 1. Start test1 webapi 2. Note current translations 3. Edit `en.json` 4. Call `GET /api/translations/cache/clear` 5. Call `GET /api/translations/en` | Response includes updated translation values |
| Reload button works | 1. Start test1 (webapi + webclient) 2. Note displayed translations 3. Edit `en.json` 4. Click "Reload Translations" button 5. Observe UI | GlobalLoader shows briefly, then UI displays updated strings |
| setLocale still works | 1. Verify `setLocale('nl')` still triggers locale switch (if nl translations exist) | Locale switches correctly, no regression |
| Multiple reloads | 1. Click "Reload Translations" multiple times rapidly | No crashes, no race conditions, last result displayed |

## Verification Checklist

- [ ] BlendSDK builds cleanly
- [ ] Appscaffold builds and tests pass (`yarn build && yarn test`)
- [ ] Test1 webapi builds cleanly after patching
- [ ] Test1 webclient builds cleanly after patching
- [ ] No TypeScript errors in any codebase
