#!/usr/bin/env bash
# Deploy expose-u.com — run on the TrueNAS host (this repo's working copy
# IS the NAS storage; your Mac just mounts the same files over SMB as
# /Volumes/Gaia/...).
#
# Why this script exists: node_modules under this directory is shared,
# physical storage touched by both this build (Linux/Alpine, via Docker)
# and any local macOS tooling pointed at the same SMB mount (Darwin-arm64).
# Running `npm ci` straight against that shared path means thousands of
# small file writes landing on a network share while something else may be
# reading it — that's what corrupted node_modules on 2026-08-24 (tsc's own
# package.json came back with unrelated file content). See
# docs/nas-dependency-repair.md for the earlier, related incident.
#
# This script avoids that by:
#   1. Copying source (excluding node_modules/.git/dist) into the
#      container's own private filesystem and running npm ci + the build
#      entirely there — the network share never sees the install's
#      small-file churn.
#   2. Copying back only the two finished directories (node_modules, dist)
#      in one bounded operation at the end.
#   3. Serializing itself with a flock so two deploys (or two people)
#      can't race each other.
#
# Guardrails carried over from CLAUDE.md: never recreates `traefik`, never
# runs compose without explicit service names, only touches exposeu-nginx
# and exposeu-contact.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$APP_DIR/docker-compose.traefik.yml"
LOCK_FILE="$APP_DIR/.deploy.lock"

usage() {
  echo "Usage: $0 {frontend|api|all}"
  echo "  frontend  build + recreate exposeu-nginx"
  echo "  api       build + recreate exposeu-contact"
  echo "  all       build + recreate both"
  exit 1
}

[ $# -eq 1 ] || usage
target="$1"
case "$target" in
  frontend|api|all) ;;
  *) usage ;;
esac

if ! command -v flock >/dev/null 2>&1; then
  echo "flock not found. This script must run on the TrueNAS host, not locally." >&2
  echo "SSH into TrueNAS first, then run: $(basename "$0") $target" >&2
  exit 1
fi

if ! sudo docker info >/dev/null 2>&1; then
  echo "Can't reach the Docker daemon this script targets (exposeu-nginx/exposeu-contact" >&2
  echo "live there). This script must run on the TrueNAS host, not locally." >&2
  echo "SSH into TrueNAS first, then run: $(basename "$0") $target" >&2
  exit 1
fi

exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  echo "Another deploy is already running (lock: $LOCK_FILE). Aborting." >&2
  exit 1
fi

echo "==> Building in an isolated container filesystem (not the shared mount)..."
sudo docker run --rm -u 0 \
  -v "$APP_DIR:/app" \
  -w /app \
  node:20-alpine sh -lc '
    set -e
    apk add --no-cache rsync >/dev/null
    mkdir -p /tmp/build
    rsync -a --exclude=node_modules --exclude=dist --exclude=.git /app/ /tmp/build/
    cd /tmp/build
    npm ci
    npm run build
    rm -rf /app/node_modules /app/dist
    cp -a node_modules dist /app/
  '

echo "==> Build complete. Recreating containers ($target)..."
case "$target" in
  frontend)
    sudo docker compose -f "$COMPOSE_FILE" up -d --force-recreate exposeu-nginx
    ;;
  api)
    sudo docker compose -f "$COMPOSE_FILE" up -d --force-recreate exposeu-contact
    ;;
  all)
    sudo docker compose -f "$COMPOSE_FILE" up -d --force-recreate exposeu-nginx exposeu-contact
    ;;
esac

echo "==> Deploy ($target) complete."
