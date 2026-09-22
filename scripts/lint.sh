#!/usr/bin/env bash
# Lint (and optionally type-check) the frontend WITHOUT touching the shared
# node_modules on the SMB-mounted working copy. Same safe pattern as
# scripts/preview.sh: the source is mounted read-only and the install happens
# entirely inside the container's own private filesystem.
#
# Why this script exists: the node_modules on this share is a *Linux* install
# that scripts/deploy.sh copies back out of its build container, so it cannot
# run on a Mac (@esbuild only ships linux-x64 there). SMB also flattens the
# symlinks in node_modules/.bin, so node_modules/.bin/tsc and .bin/eslint come
# back as regular files and resolve their internal requires against the wrong
# directory ("Cannot find module '../lib/tsc.js'"). Running either tool
# against this working copy therefore fails on both machines for reasons that
# have nothing to do with the code being linted.
#
# CI (.github/workflows/ci.yml) remains the authoritative signal. This is for
# getting the same answer on demand without waiting for a push.
#
# Run on the TrueNAS host (needs Docker). Exits non-zero if lint fails.
#
# Usage: scripts/lint.sh [--types]   (--types also runs tsc -b)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

WITH_TYPES=0
if [ "${1:-}" = "--types" ]; then
  WITH_TYPES=1
elif [ $# -gt 0 ]; then
  echo "Usage: $(basename "$0") [--types]" >&2
  exit 1
fi

if ! sudo docker info >/dev/null 2>&1; then
  echo "Can't reach Docker. This script must run on the TrueNAS host, not locally." >&2
  echo "SSH into TrueNAS first, then run: $(basename "$0") ${1:-}" >&2
  exit 1
fi

echo "==> Linting in an isolated container filesystem (source mounted read-only)..."
[ "$WITH_TYPES" -eq 1 ] && echo "==> --types: will run tsc -b as well."
echo

sudo docker run --rm -u 0 \
  -e WITH_TYPES="$WITH_TYPES" \
  -v "$APP_DIR:/app:ro" \
  -w /app \
  node:20-alpine sh -lc '
    set -e
    apk add --no-cache rsync >/dev/null
    mkdir -p /tmp/lint
    rsync -a --exclude=node_modules --exclude=dist --exclude=.git /app/ /tmp/lint/
    cd /tmp/lint
    npm ci --silent
    if [ "$WITH_TYPES" = "1" ]; then
      echo "==> tsc -b"
      node node_modules/typescript/bin/tsc -b
      echo "    types OK"
    fi
    echo "==> eslint"
    npm run lint
  '

echo
echo "==> Lint clean."
