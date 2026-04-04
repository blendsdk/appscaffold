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
