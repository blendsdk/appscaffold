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

if ! command -v yarn &>/dev/null; then
  echo "⚠️  yarn not found. Install it: npm install -g yarn" >&2
  echo "   After installing, run: yarn install && yarn ncu" >&2
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

# Detect project directory created by the scaffold
PROJECT_DIR=""
if [ -f ".scaffold-output" ]; then
  PROJECT_DIR=$(cat .scaffold-output)
  rm -f .scaffold-output
fi

# Post-scaffold: ask user to run yarn install && yarn ncu (Decision per AR #2, AR #3)
if command -v yarn &>/dev/null && [ -n "$PROJECT_DIR" ] && [ -d "$PROJECT_DIR" ]; then
  echo ""
  read -r -p "Run 'yarn install && yarn ncu' in ./${PROJECT_DIR}/? [Y/n] " response < /dev/tty
  response=${response:-Y}
  if [[ "$response" =~ ^[Yy]$ ]] || [[ -z "$response" ]]; then
    echo ""
    echo "📦 Running yarn install && yarn ncu in ./${PROJECT_DIR}/..."
    cd "$PROJECT_DIR"
    yarn install && yarn ncu
  else
    echo ""
    echo "Skipped. Run manually: cd ${PROJECT_DIR} && yarn install && yarn ncu"
  fi
fi
