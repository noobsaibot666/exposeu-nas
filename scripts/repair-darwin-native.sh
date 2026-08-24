#!/usr/bin/env bash
# Repairs the Darwin-arm64 native-binary fallback that local macOS dev
# (npm run dev / npm run build) depends on — see docs/nas-dependency-repair.md
# for the full history. This repo's node_modules is Linux binaries (installed
# fresh every deploy by scripts/deploy.sh's Docker build); a Mac needs
# Darwin-arm64 versions of Rollup/esbuild's native addons instead, loaded via
# NODE_PATH from node_modules/.darwin-native/node_modules/. npm ci wipes that
# folder along with everything else in node_modules, so it goes missing after
# any clean install on either side.
#
# Why this has to run here and not from the Mac: macOS's SMB client cannot
# write new files into node_modules on this share — confirmed 2026-08-24,
# mkdir/chmod both fail there with no useful error, reporting success while
# doing nothing. A container running locally on the TrueNAS host isn't going
# through that SMB layer at all, so it writes normally (exactly like
# scripts/deploy.sh already does for the rest of node_modules).
#
# Uses `npm pack` rather than a platform-targeted `npm install` — pack has no
# platform-matching logic at all, it just downloads the named package+version
# tarball, so this works regardless of npm version or host OS.
#
# Run this ON THE TRUENAS HOST, same as scripts/deploy.sh.
#
# Usage: scripts/repair-darwin-native.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

if ! sudo docker info >/dev/null 2>&1; then
  echo "Can't reach the Docker daemon. Run this on the TrueNAS host, not locally." >&2
  echo "SSH in first, then run: $(basename "$0")" >&2
  exit 1
fi

# Written to a real file and executed as a script, not passed as an inline
# `sh -c "..."` string — this needs its own quoting (JS string literals for
# the JSON key lookups) that would be a nightmare to get right nested inside
# an outer quoted string. The quoted heredoc delimiter (<<'INNER') stops bash
# from touching anything inside it, so it lands in the container byte-for-byte.
INNER_SCRIPT="$(mktemp)"
trap 'rm -f "$INNER_SCRIPT"' EXIT

cat > "$INNER_SCRIPT" <<'INNER'
set -e

ROLLUP_VERSION=$(node -e "console.log(require('/app/package-lock.json').packages['node_modules/@rollup/rollup-darwin-arm64'].version)")
ESBUILD_VERSION=$(node -e "console.log(require('/app/package-lock.json').packages['node_modules/@esbuild/darwin-arm64'].version)")

echo "Fetching @rollup/rollup-darwin-arm64@$ROLLUP_VERSION + @esbuild/darwin-arm64@$ESBUILD_VERSION"

mkdir -p /tmp/darwin-native
cd /tmp/darwin-native
npm pack "@rollup/rollup-darwin-arm64@$ROLLUP_VERSION" "@esbuild/darwin-arm64@$ESBUILD_VERSION" >/dev/null

mkdir -p out/@rollup/rollup-darwin-arm64 out/@esbuild/darwin-arm64
tar xzf rollup-rollup-darwin-arm64-*.tgz -C out/@rollup/rollup-darwin-arm64 --strip-components=1
tar xzf esbuild-darwin-arm64-*.tgz -C out/@esbuild/darwin-arm64 --strip-components=1

mkdir -p /app/node_modules/.darwin-native/node_modules
rm -rf /app/node_modules/.darwin-native/node_modules/@rollup /app/node_modules/.darwin-native/node_modules/@esbuild
cp -a out/@rollup out/@esbuild /app/node_modules/.darwin-native/node_modules/
INNER

echo "==> Installing Darwin-arm64 Rollup/esbuild into node_modules/.darwin-native/node_modules/ ..."

sudo docker run --rm -u 0 \
  -v "$APP_DIR:/app" \
  -v "$INNER_SCRIPT:/tmp/setup.sh:ro" \
  node:20-alpine sh /tmp/setup.sh

rollup_bin="$APP_DIR/node_modules/.darwin-native/node_modules/@rollup/rollup-darwin-arm64/rollup.darwin-arm64.node"
esbuild_bin="$APP_DIR/node_modules/.darwin-native/node_modules/@esbuild/darwin-arm64/bin/esbuild"

if [ -f "$rollup_bin" ] && [ -f "$esbuild_bin" ]; then
  echo "==> Done. Both binaries are in place — npm run dev / npm run build should work on the Mac now."
else
  echo "==> Ran, but one of the expected binaries is missing:" >&2
  echo "    $rollup_bin" >&2
  echo "    $esbuild_bin" >&2
  exit 1
fi
