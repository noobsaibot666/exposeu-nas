#!/usr/bin/env bash
# Local preview — build + serve the frontend on a throwaway port, WITHOUT
# touching production (exposeu-nginx/exposeu-contact stay untouched) and
# WITHOUT touching the shared node_modules/dist on the SMB-mounted working
# copy (the source is mounted read-only; the build happens entirely inside
# the container's own private filesystem, same safe pattern as deploy.sh).
#
# Run on the TrueNAS host (needs Docker). Foreground — Ctrl+C to stop.
#
# Usage: scripts/preview.sh [port]   (default 8081)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
PORT="${1:-8081}"

if ! sudo docker info >/dev/null 2>&1; then
  echo "Can't reach Docker. This script must run on the TrueNAS host, not locally." >&2
  echo "SSH into TrueNAS first, then run: $(basename "$0") [port]" >&2
  exit 1
fi

echo "==> Building preview in an isolated container filesystem (source mounted read-only)..."
echo "==> Will be reachable at http://<truenas-host>:${PORT}/ once the build finishes."
echo "==> Note: this is a static preview (vite preview) — /api/* calls (contact form"
echo "    submit, etc.) will NOT work here; use the deployed site for that."
echo

sudo docker run --rm -u 0 \
  -p "${PORT}:4173" \
  -v "$APP_DIR:/app:ro" \
  -w /app \
  node:20-alpine sh -lc '
    set -e
    apk add --no-cache rsync >/dev/null
    mkdir -p /tmp/build
    rsync -a --exclude=node_modules --exclude=dist --exclude=.git /app/ /tmp/build/
    cd /tmp/build
    npm ci
    npm run build
    node node_modules/vite/bin/vite.js preview --configLoader runner --host 0.0.0.0 --port 4173
  '
