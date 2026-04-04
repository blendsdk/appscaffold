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
