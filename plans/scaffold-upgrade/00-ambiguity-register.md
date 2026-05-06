# Ambiguity Register: Scaffold Template Upgrade

> **Status**: ✅ GATE PASSED — all 4 items resolved
> **Last Updated**: 2025-05-06

| # | Category | Ambiguity / Gap | Options Presented | User Decision | Status |
|---|----------|----------------|-------------------|---------------|--------|
| 1 | Behavioral | Should the "Next Steps" printed by scaffold.js (src/index.ts) also be updated to show `yarn install && yarn ncu` instead of just `yarn install`? | A: Yes, update / B: No, leave as-is | A: Yes, update — consistency across both entry points | ✅ Resolved |
| 2 | Behavioral | If user says "yes" to the install.sh prompt, should it run as a single chain or two separate commands? | A: Single chain `yarn install && yarn ncu` / B: Two separate commands with status messages | A: Single chain — simpler, correct error handling | ✅ Resolved |
| 3 | Edge Case | Should install.sh check if yarn is available before offering the prompt? | A: Yes, add yarn preflight check / B: No, let it fail naturally | A: Yes, add yarn check — defensive, better UX | ✅ Resolved |
| 4 | Scope | The answersFromFlags non-interactive default for mailer changes from false to true. Is this intentional for both interactive and non-interactive? | A: Yes, change both to true / B: Only change interactive | A: Yes, change both — consistency, users can pass --no-mailer | ✅ Resolved |

## Resolution Notes

**AR-1:** When running scaffold.js directly (not via install.sh), the user should also see `yarn install && yarn ncu` as the first next step.

**AR-2:** `yarn install && yarn ncu` as a single chain ensures ncu only runs if install succeeds. No need for extra complexity.

**AR-3:** The scaffold generates a Yarn project. If yarn isn't installed, warn early and skip the auto-run prompt.

**AR-4:** Different defaults between interactive and non-interactive modes would be confusing. Both should default to `true` for mailer.
