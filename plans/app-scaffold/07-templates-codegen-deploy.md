# Templates — Codegen & Deployment

> **Document**: 07-templates-codegen-deploy.md
> **Parent**: [Index](00-index.md)

## Overview

Templates for the `packages/codegen` package (always included) and deployment integration files (`deploy-package.sh`, blue-green invocation).

## Codegen Package

### `codegen/package.json`

```json
{
  "name": "{{PACKAGE_SCOPE}}/codegen",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "generate": "tsx src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "blendsdk": "^5.35.0",
    "{{PACKAGE_SCOPE}}/shared": "^1.0.0",
    "pg": "^8.18.0",
    "yesql": "^7.0.0"
  },
  "devDependencies": {
    "@types/pg": "^8.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.21.0",
    "typescript": "^5.9.0",
    "vitest": "^4.1.0"
  }
}
```

### `codegen/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### `codegen/src/index.ts`

Codegen entry point — scaffolded with the basic structure from BlendSDK v5 codegen patterns.

```typescript
import { databaseToSchema } from 'blendsdk/codegen';
import * as path from 'path';

/**
 * {{PROJECT_NAME}} Code Generator
 *
 * Generates:
 * - Database schema SQL
 * - TypeScript type definitions (shared package)
 * - Data service classes (webapi)
 * - API controller scaffolds (webapi)
 * - REST API client (webclient)
 * - Validation schemas (webapi)
 */

const WebApiRoot = path.join(process.cwd(), '..', 'webapi');
const WebClientRoot = path.join(process.cwd(), '..', 'webclient');
const SharedRoot = path.join(process.cwd(), '..', 'shared');
const packageScope = '{{PACKAGE_SCOPE}}';

export async function generate(): Promise<void> {
    console.log(`🔧 Running code generation for {{PROJECT_NAME}}...`);

    // TODO: Add database schema definitions
    // TODO: Add type generation
    // TODO: Add API schema definitions
    // TODO: Add data service generation

    console.log('✅ Code generation complete');
}

// Run when executed directly
generate().catch((err) => {
    console.error('❌ Code generation failed:', err);
    process.exit(1);
});
```

### `codegen/.gitignore`

```gitignore
dist/
node_modules/
```

### `codegen/resources/database/` — `.gitkeep`

Placeholder for SQL view definitions.

## Deployment Files

### `deploy-package.sh`

Build script that creates the `deployment-latest.tgz` artifact expected by blue-green's Dockerfile. This script is placed at the generated project root.

```bash
#!/bin/bash
# =============================================================================
# {{PROJECT_NAME}} — Deployment Package Builder
# =============================================================================
# Builds all packages via Turborepo and creates a deployment tarball.
# The tarball contains:
#   - Compiled webapi (dist/)
#   - Built webclient (bundled into webapi/resources/public/static)
#   - package.json + yarn.lock for production install
#   - Resource files (database, i18n, etc.)
# =============================================================================
set -euo pipefail

echo "📦 Building {{PROJECT_NAME}} deployment package..."

# Step 1: Clean previous builds
echo "  🧹 Cleaning..."
yarn clean

# Step 2: Build all packages (Turborepo handles dependency order)
echo "  🔨 Building..."
yarn build

# Step 3: Create deployment directory
DEPLOY_DIR=$(mktemp -d)
trap 'rm -rf "$DEPLOY_DIR"' EXIT

# Step 4: Copy webapi build output
echo "  📁 Assembling deployment package..."
cp -r packages/webapi/dist "$DEPLOY_DIR/dist"
cp -r packages/webapi/resources "$DEPLOY_DIR/resources"
cp packages/webapi/package.json "$DEPLOY_DIR/package.json"

# Step 5: Copy config files
if [ -d packages/webapi/config ]; then
  cp -r packages/webapi/config "$DEPLOY_DIR/config"
fi

# Step 6: Create tarball
echo "  📦 Creating tarball..."
tar -czf deployment-latest.tgz -C "$DEPLOY_DIR" .

echo "✅ Deployment package created: deployment-latest.tgz"
ls -lh deployment-latest.tgz
```

### Blue-Green Integration

After scaffold generation completes, if the user opted in to blue-green deployment, the scaffold invokes:

```bash
curl -fsSL https://raw.githubusercontent.com/blendsdk/blue-green/master/install.sh | bash
```

This runs from the generated project directory and adds:
- `deployment/` — Docker Compose, Dockerfile, Nginx configs
- `.github/workflows/` — CI/CD workflows
- `deploy-config.json` — Deployment configuration
- `scripts/push-secrets.sh` — GitHub Secrets management

The blue-green scaffold has its own interactive prompts for:
- App port (defaults to the backend port from our scaffold)
- Nginx port
- App replicas
- PostgreSQL and Redis inclusion
- Deployment strategy (in-place vs registry)
- Deployment topology (single vs multi)

## Scaffold Project Files

### `.gitignore` (for the scaffold project itself)

```gitignore
node_modules/
dist/
*.tgz

# The scaffold.js bundle IS committed (it's the distribution artifact)
# scaffold/scaffold.js — DO NOT add to gitignore
```

### `install.sh` (for the scaffold project)

Curl-based installer — same pattern as blue-green.

```bash
#!/bin/bash
# =============================================================================
# BlendSDK App Scaffold — Installer
# =============================================================================
# Downloads the scaffold repo and runs scaffold.js interactively.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/blendsdk/appscaffold/master/install.sh | bash
#   curl -fsSL .../install.sh | bash -s -- --name myapp --scope @myapp --port 4000
# =============================================================================
set -e

REPO="blendsdk/appscaffold"
VERSION="${APP_SCAFFOLD_VERSION:-master}"
ARCHIVE_URL="https://github.com/${REPO}/archive/refs/heads/${VERSION}.tar.gz"

if [[ "$VERSION" == v* ]]; then
  ARCHIVE_URL="https://github.com/${REPO}/archive/refs/tags/${VERSION}.tar.gz"
fi

# Preflight checks
if ! command -v node &>/dev/null; then
  echo "❌ Node.js is required. Install it first: https://nodejs.org/" >&2
  exit 1
fi

# Download and extract
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "📥 Downloading appscaffold (${VERSION})..."
curl -fsSL "$ARCHIVE_URL" -o "$TMPDIR/scaffold.tar.gz"
tar -xzf "$TMPDIR/scaffold.tar.gz" -C "$TMPDIR"

SCAFFOLD_DIR=$(find "$TMPDIR" -maxdepth 1 -type d -name "appscaffold-*" | head -1)

if [ -z "$SCAFFOLD_DIR" ] || [ ! -f "$SCAFFOLD_DIR/scaffold/scaffold.js" ]; then
  echo "❌ Failed to extract scaffold." >&2
  exit 1
fi

echo "🚀 Running scaffold generator..."
echo ""
node "$SCAFFOLD_DIR/scaffold/scaffold.js" "$@" < /dev/tty
```

## Template Variables Used

| Variable | Source | Used In |
|----------|--------|---------|
| `PROJECT_NAME` | User input | codegen/src/index.ts, deploy-package.sh |
| `PROJECT_NAME_LOWER` | Derived | — |
| `PACKAGE_SCOPE` | User input | codegen/package.json, codegen/src/index.ts |
| `BACKEND_PORT` | User input | deploy-package.sh (indirectly) |
| `DB_NAME` | User input | — |
