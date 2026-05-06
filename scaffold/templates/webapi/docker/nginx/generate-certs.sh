#!/bin/bash
# =============================================================================
# {{PROJECT_NAME}} — Self-Signed Certificate Generator
# =============================================================================
# Generates a self-signed SSL certificate for local HTTPS development.
# The certificate is valid for 365 days and covers:
#   - dev.{{PROJECT_NAME_LOWER}}.local
#   - localhost
#
# Usage:
#   bash packages/webapi/docker/nginx/generate-certs.sh
#   (or: yarn docker:certs)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERT_DIR="$SCRIPT_DIR/../certs"
HOSTNAME="dev.{{PROJECT_NAME_LOWER}}.local"

mkdir -p "$CERT_DIR"

# Skip generation if certs already exist
if [ -f "$CERT_DIR/dev.crt" ] && [ -f "$CERT_DIR/dev.key" ]; then
    echo ""
    echo "  ✅ SSL certificates already exist in $CERT_DIR"
    echo "     To regenerate, delete the certs directory and run again."
    echo ""
    exit 0
fi

echo ""
echo "  🔐 Generating self-signed SSL certificate..."
echo "     Hostname: $HOSTNAME"
echo ""

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/dev.key" \
    -out "$CERT_DIR/dev.crt" \
    -subj "/CN=$HOSTNAME" \
    -addext "subjectAltName=DNS:$HOSTNAME,DNS:localhost" \
    2>/dev/null

echo "  ✅ SSL certificates generated:"
echo "     Certificate: $CERT_DIR/dev.crt"
echo "     Key:         $CERT_DIR/dev.key"
echo ""
echo "  📝 Add this line to your /etc/hosts file:"
echo "     127.0.0.1  $HOSTNAME"
echo ""
echo "  🌐 Then access: https://$HOSTNAME:{{HTTPS_PORT}}"
echo ""
