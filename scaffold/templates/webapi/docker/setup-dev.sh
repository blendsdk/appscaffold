#!/bin/bash
# =============================================================================
# {{PROJECT_NAME}} — Development Environment Setup
# =============================================================================
# One-time setup for the HTTPS development environment.
# This script:
#   1. Verifies Docker is installed and running
#   2. Generates SSL certificates (prefers mkcert for browser-trusted certs)
#   3. Adds the dev hostname to /etc/hosts
#
# Usage:
#   bash packages/webapi/docker/setup-dev.sh
#   (or: yarn docker:setup)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_DIR="$SCRIPT_DIR/certs"
NGINX_DIR="$SCRIPT_DIR/nginx"
HOSTNAME="dev.{{PROJECT_NAME_LOWER}}.local"
HTTPS_PORT="{{HTTPS_PORT}}"

echo ""
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║  {{PROJECT_NAME}} — Development Environment Setup    ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Check Docker ────────────────────────────────────────────────────

if ! command -v docker &>/dev/null; then
    echo "  ❌ Docker is not installed."
    echo "     Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &>/dev/null 2>&1; then
    echo "  ❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "  ✅ Docker is installed and running"

# ─── Step 2: Generate SSL certificates ───────────────────────────────────────

mkdir -p "$CERT_DIR"

if [ -f "$CERT_DIR/dev.crt" ] && [ -f "$CERT_DIR/dev.key" ]; then
    echo "  ✅ SSL certificates already exist"
elif command -v mkcert &>/dev/null; then
    # mkcert available — generate browser-trusted certificates
    echo "  🔐 Generating browser-trusted certificates with mkcert..."

    # Ensure the local CA is installed (idempotent)
    mkcert -install 2>/dev/null || true

    # Generate certs for dev hostname + localhost
    mkcert -cert-file "$CERT_DIR/dev.crt" \
           -key-file "$CERT_DIR/dev.key" \
           "$HOSTNAME" localhost 127.0.0.1 \
           2>/dev/null

    echo "  ✅ Browser-trusted SSL certificates generated (mkcert)"
else
    # mkcert not available — fall back to openssl self-signed
    echo "  🔐 Generating self-signed SSL certificates (openssl)..."
    echo "     💡 Tip: Install mkcert for browser-trusted certs (no SSL warnings)"
    echo "        brew install mkcert    # macOS"
    echo "        apt install mkcert     # Ubuntu/Debian"
    echo "        https://github.com/FiloSottile/mkcert#installation"
    echo ""

    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$CERT_DIR/dev.key" \
        -out "$CERT_DIR/dev.crt" \
        -subj "/CN=$HOSTNAME" \
        -addext "subjectAltName=DNS:$HOSTNAME,DNS:localhost" \
        2>/dev/null

    echo "  ✅ Self-signed SSL certificates generated"
    echo "     ⚠️  You will need to accept the certificate in your browser"
fi

# ─── Step 3: /etc/hosts entry ────────────────────────────────────────────────

if grep -q "$HOSTNAME" /etc/hosts 2>/dev/null; then
    echo "  ✅ Hostname $HOSTNAME is already in /etc/hosts"
else
    echo "  📝 Adding $HOSTNAME to /etc/hosts..."

    if sudo -n true 2>/dev/null; then
        # sudo available without password prompt
        echo "127.0.0.1  $HOSTNAME" | sudo tee -a /etc/hosts >/dev/null
        echo "  ✅ Added $HOSTNAME to /etc/hosts"
    else
        # Try with password prompt
        echo "     (sudo access required to modify /etc/hosts)"
        if echo "127.0.0.1  $HOSTNAME" | sudo tee -a /etc/hosts >/dev/null 2>&1; then
            echo "  ✅ Added $HOSTNAME to /etc/hosts"
        else
            echo "  ⚠️  Could not modify /etc/hosts automatically."
            echo "     Please add this line manually:"
            echo ""
            echo "     127.0.0.1  $HOSTNAME"
            echo ""
        fi
    fi
fi

# ─── Done ─────────────────────────────────────────────────────────────────────

echo ""
echo "  ┌─────────────────────────────────────────────────────┐"
echo "  │  ✅ Setup complete!                                 │"
echo "  │                                                     │"
echo "  │  Next steps:                                        │"
echo "  │    yarn docker:dev     Start Docker services        │"
echo "  │    yarn dev            Start development servers    │"
echo "  │                                                     │"
echo "  │  Then open:                                         │"
echo "  │    https://$HOSTNAME:$HTTPS_PORT"
echo "  └─────────────────────────────────────────────────────┘"
echo ""
