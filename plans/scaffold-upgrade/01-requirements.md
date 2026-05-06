# Requirements: Scaffold Template Upgrade

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

Three independent improvements to the scaffold generator and its templates.

## Functional Requirements

### Must Have

- [ ] React 19 in webclient template (`react`, `react-dom`, `@types/react`, `@types/react-dom`)
- [ ] Mailer default changed to `true` in interactive prompts (Decision per AR #4)
- [ ] Mailer default changed to `true` in non-interactive `answersFromFlags` (Decision per AR #4)
- [ ] Help text updated to reflect new mailer default
- [ ] Install script prompts to run `yarn install && yarn ncu` after scaffolding (Decision per AR #2)
- [ ] Install script checks for yarn availability before prompting (Decision per AR #3)
- [ ] Next Steps in scaffold.js updated to show `yarn install && yarn ncu` (Decision per AR #1)
- [ ] `scaffold/scaffold.js` rebuilt via `yarn build`

### Won't Have (Out of Scope)

- Other dependency upgrades (FluentUI, Vite, etc.)
- React template code changes (main.tsx uses `createRoot` — same in React 19)
- Generator logic changes
- Blue-green deployment changes

## Acceptance Criteria

1. [ ] `scaffold/templates/webclient/package.json` references React 19
2. [ ] Interactive prompt defaults mailer to Yes
3. [ ] Non-interactive mode defaults mailer to true
4. [ ] `install.sh` prompts user after scaffolding
5. [ ] `yarn build && yarn test` passes
