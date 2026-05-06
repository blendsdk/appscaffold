# Changes Specification: Scaffold Template Upgrade

> **Document**: 03-changes-spec.md
> **Parent**: [Index](00-index.md)

## 1. React 19 Upgrade

**File**: `scaffold/templates/webclient/package.json`

| Package | Before | After |
|---------|--------|-------|
| `react` | `^18.3.0` | `^19.0.0` |
| `react-dom` | `^18.3.0` | `^19.0.0` |
| `@types/react` | `^18.3.0` | `^19.0.0` |
| `@types/react-dom` | `^18.3.0` | `^19.0.0` |

No template code changes needed — `createRoot` API is identical in React 19.

## 2. Mailer Default

> **Decision per AR #4:** Change both interactive and non-interactive defaults to `true`.

**File**: `src/prompts.ts`

```typescript
// Line 68: Interactive prompt — change false → true
const mailer = await confirm(rl, 'Include email service (mailer)?', true);

// Line 114: Non-interactive default — change false → true
mailer: flags.mailer ?? true,
```

**File**: `src/index.ts` (help text)

```
// Before:
--mailer                Include email service
--no-mailer             Exclude email service (default)

// After:
--mailer                Include email service (default: true)
--no-mailer             Exclude email service
```

## 3. Next Steps Update

> **Decision per AR #1:** Update scaffold.js Next Steps too.

**File**: `src/index.ts`

```typescript
// Before:
console.log('  1. yarn install');

// After:
console.log('  1. yarn install && yarn ncu');
```

## 4. Install Script Changes

> **Decision per AR #2:** Single chain command.
> **Decision per AR #3:** Add yarn preflight check.

**File**: `install.sh`

### 4a. Yarn Preflight Check

Add after the node check:

```bash
if ! command -v yarn &>/dev/null; then
  echo "⚠️  yarn not found. Install it: npm install -g yarn" >&2
  echo "   After installing, run: yarn install && yarn ncu" >&2
fi
```

Note: This is a warning, not a hard exit — the scaffold itself doesn't require yarn to generate files.

### 4b. Post-Scaffold Prompt

Add after the `node "$SCAFFOLD_DIR/scaffold/scaffold.js"` line:

```bash
# Ask user to run yarn install && yarn ncu
if command -v yarn &>/dev/null; then
  echo ""
  read -r -p "Run 'yarn install && yarn ncu' now? [Y/n] " response < /dev/tty
  response=${response:-Y}
  if [[ "$response" =~ ^[Yy]$ ]] || [[ -z "$response" ]]; then
    echo ""
    echo "📦 Running yarn install && yarn ncu..."
    yarn install && yarn ncu
  else
    echo ""
    echo "Skipped. Run manually: yarn install && yarn ncu"
  fi
fi
```

## Testing Requirements

- All existing tests must pass (`yarn build && yarn test`)
- No new tests needed — changes are to templates, prompts defaults, and shell script (not testable logic)
