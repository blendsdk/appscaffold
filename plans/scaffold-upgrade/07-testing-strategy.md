# Testing Strategy: Scaffold Template Upgrade

> **Document**: 07-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

- All existing tests pass (no regressions)
- Template changes verified through existing integration tests
- No new unit tests needed — changes are to static template content, prompt defaults, and shell script

## Verification

### Existing Tests Cover:

| Test | What It Validates | Still Valid? |
|------|-------------------|-------------|
| `generator.test.ts` — `buildTemplateVars` | Template variable construction | ✅ Yes — uses explicit `mailer: false/true` in fixtures |
| `generator.test.ts` — `buildFileList` | File list generation | ✅ Yes — unchanged |
| `integration.test.ts` — full generation | End-to-end file generation and content | ✅ Yes — uses explicit answers |
| `integration.test.ts` — webclient package.json | FluentUI v9 present | ✅ Yes — still true with React 19 |
| `renderer.test.ts` | Template rendering | ✅ Yes — unchanged |
| `writer.test.ts` | File writing | ✅ Yes — unchanged |

### Why No New Tests:

1. **React version** — It's a string in a JSON template. The existing integration test already validates the webclient package.json is generated correctly.
2. **Mailer default** — Test fixtures use explicit `mailer: false`/`mailer: true` values, not defaults. The default change doesn't affect test behavior.
3. **Install script** — Shell script with interactive prompt, not unit-testable in vitest.
4. **Next Steps** — Console output, not testable without capturing stdout (overkill for a string change).

## Verification Checklist

- [ ] `yarn build` succeeds
- [ ] `yarn test` — all tests pass
- [ ] Manual review: `scaffold/scaffold.js` contains updated React 19 versions
- [ ] Manual review: `scaffold/scaffold.js` contains updated mailer default
- [ ] Manual review: `install.sh` contains yarn check and prompt
