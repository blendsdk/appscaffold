# Current State: Scaffold Template Upgrade

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

### React Versions (webclient template)

| Package | Current Version |
|---------|----------------|
| `react` | `^18.3.0` |
| `react-dom` | `^18.3.0` |
| `@types/react` | `^18.3.0` |
| `@types/react-dom` | `^18.3.0` |

Template code (`main.tsx`) uses `createRoot` from `react-dom/client` — this API is unchanged in React 19.

### Mailer Default

| Location | Current Default |
|----------|----------------|
| `src/prompts.ts` line 68 (interactive) | `false` |
| `src/prompts.ts` line 114 (non-interactive) | `false` |
| `src/index.ts` help text | `--no-mailer` marked as default |

### Install Script

`install.sh` currently:
1. Checks for `node` (preflight)
2. Downloads and extracts scaffold archive
3. Runs `node scaffold.js`
4. Exits — no post-scaffold automation

### Next Steps Output

`src/index.ts` currently prints:
```
1. yarn install
2. yarn docker:dev
3. yarn dev
```

## Relevant Files

| File | Purpose | Changes Needed |
|------|---------|---------------|
| `scaffold/templates/webclient/package.json` | Webclient deps | React version bump |
| `src/prompts.ts` | Interactive & flag-based prompts | Mailer default |
| `src/index.ts` | Help text, next steps, main entry | Help text + next steps |
| `install.sh` | Curl-piped installer | Yarn check + prompt |
| `scaffold/scaffold.js` | Built bundle | Rebuild |
