#!/usr/bin/env bash
# Deploy expose-u.com from your Mac — one command instead of "ssh in, then run
# scripts/deploy.sh". Same shape as outreach-app/deploy.sh (persistent SSH →
# preflight → remote rebuild → health check), with one deliberate difference:
#
#   There is NO rsync step. This working copy IS the NAS storage — the Mac
#   mounts /mnt/Gaia/... over SMB as /Volumes/Gaia/..., so the host already
#   has every file you've saved. Syncing would just be a second writer on the
#   shared mount (see the top of scripts/deploy.sh for why that's dangerous).
#
# All the real work (isolated container build, flock, compose guardrails,
# on-host smoke check) stays in scripts/deploy.sh; this script only drives it
# remotely and adds checks that make sense from the Mac side:
#   - warns before deploying uncommitted changes or a non-main branch
#     (whatever is on disk right now is what ships — there's no git checkout)
#   - optionally lints first (scripts/lint.sh, containerised on the NAS)
#   - verifies the public site through real DNS/TLS after the deploy
#
# SSH connection persists 2 h after last use — no repeated auth. deploy.sh
# uses plain `docker` when the remote user is in the docker group, so this
# also works non-interactively; from a terminal, `ssh -t` lets sudo prompt
# as a fallback.
#
# Usage: scripts/deploy-remote.sh {frontend|api|all} [--lint] [--yes]
#   --lint   run scripts/lint.sh --types on the NAS first; abort if it fails
#   --yes    skip the uncommitted-changes / branch confirmation prompts
#
# Overridable via env: DEPLOY_REMOTE, DEPLOY_REMOTE_PATH, DEPLOY_PUBLIC_URL

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

REMOTE="${DEPLOY_REMOTE:-alan@192.168.178.146}"
# /Volumes/Gaia/... on the Mac is /mnt/Gaia/... on the NAS.
MAC_MOUNT="/Volumes/Gaia" NAS_MOUNT="/mnt/Gaia"
REMOTE_PATH="${DEPLOY_REMOTE_PATH:-$NAS_MOUNT${APP_DIR#"$MAC_MOUNT"}}"
PUBLIC_URL="${DEPLOY_PUBLIC_URL:-https://expose-u.com}"
SOCKET="/tmp/ssh-exposeu-nas.sock"
SSH_OPTS=(-o ControlMaster=auto -o "ControlPath=$SOCKET" -o ControlPersist=2h)
# A TTY only when there is one to hand over (lets sudo prompt if the remote
# user isn't in the docker group); without one, run plainly instead of warning.
TTY_OPT=(); [ -t 0 ] && TTY_OPT=(-t)

usage() {
  echo "Usage: $0 {frontend|api|all} [--lint] [--yes]"
  echo "  frontend  build + recreate exposeu-nginx"
  echo "  api       build + recreate exposeu-contact"
  echo "  all       build + recreate both"
  echo "  --lint    lint + type-check on the NAS first"
  echo "  --yes     don't ask about uncommitted changes / non-main branch"
  exit 1
}

target=""
run_lint=false
assume_yes=false
for arg in "$@"; do
  case "$arg" in
    frontend|api|all) [ -z "$target" ] || usage; target="$arg" ;;
    --lint) run_lint=true ;;
    --yes|-y) assume_yes=true ;;
    *) usage ;;
  esac
done
[ -n "$target" ] || usage

confirm() {
  $assume_yes && return 0
  if [ ! -t 0 ]; then
    echo "✗ $1 — not a terminal, so can't ask. Re-run with --yes to proceed anyway." >&2
    exit 1
  fi
  read -r -p "  $1 Continue? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
}

# ── 0/4  Preflight (local, read-only) ─────────────────────────────────────────
echo "── 0/4  preflight ──────────────────────────────────────"
branch="$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD)"
commit="$(git -C "$APP_DIR" log -1 --format='%h %s')"
echo "  branch: $branch"
echo "  HEAD:   $commit"

# Untracked files are ignored except where they'd actually end up in the build.
dirty="$(git -C "$APP_DIR" status --porcelain --untracked-files=no)"
untracked_src="$(git -C "$APP_DIR" status --porcelain -- src server public index.html \
  | grep '^??' || true)"
if [ -n "$dirty$untracked_src" ]; then
  echo "  ⚠ Uncommitted changes — these ship as-is:"
  printf '%s\n%s\n' "$dirty" "$untracked_src" | sed '/^$/d; s/^/      /'
  confirm "Deploying uncommitted changes."
fi
if [ "$branch" != "main" ]; then
  echo "  ⚠ Not on main."
  confirm "Deploying branch '$branch' to production."
fi

# ── 1/4  Open or reuse the persistent SSH connection ─────────────────────────
echo "── 1/4  connect ────────────────────────────────────────"
if ! ssh -O check -o "ControlPath=$SOCKET" "$REMOTE" 2>/dev/null; then
  echo "  Connecting to TrueNAS (connection stays open for 2 h)"
  ssh -fNM "${SSH_OPTS[@]}" "$REMOTE"
fi
# `test -f` + `bash <script>` below, not `test -x` + direct exec: saving a file
# from the Mac over SMB rewrites it on the NAS as 0664, silently dropping the
# executable bit — so an edited deploy.sh would otherwise "not be found".
if ! ssh "${SSH_OPTS[@]}" "$REMOTE" "test -f '$REMOTE_PATH/scripts/deploy.sh'"; then
  echo "✗ $REMOTE_PATH/scripts/deploy.sh not found on $REMOTE." >&2
  echo "  Set DEPLOY_REMOTE_PATH if the repo lives somewhere else on the NAS." >&2
  exit 1
fi
echo "  $REMOTE:$REMOTE_PATH"

# ── 2/4  Optional lint (on the NAS, containerised) ───────────────────────────
if $run_lint; then
  echo "── 2/4  lint + types ───────────────────────────────────"
  ssh ${TTY_OPT[@]+"${TTY_OPT[@]}"} "${SSH_OPTS[@]}" "$REMOTE" "bash '$REMOTE_PATH/scripts/lint.sh' --types"
else
  echo "── 2/4  lint skipped (pass --lint to run it) ───────────"
fi

# ── 3/4  Build + recreate (scripts/deploy.sh on the host) ────────────────────
echo "── 3/4  deploy ($target) ───────────────────────────────"
started=$(date +%s)
ssh ${TTY_OPT[@]+"${TTY_OPT[@]}"} "${SSH_OPTS[@]}" "$REMOTE" "bash '$REMOTE_PATH/scripts/deploy.sh' $target"
elapsed=$(( $(date +%s) - started ))

# ── 4/4  Public check (real DNS + TLS, from outside the NAS) ─────────────────
# deploy.sh already smoke-checks via localhost with a Host header; this catches
# what that can't — DNS, certificate, or router problems between you and it.
echo "── 4/4  public check ───────────────────────────────────"
public_check() {
  local path="$1" label="$2" status
  for _ in 1 2 3 4 5; do
    status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$PUBLIC_URL$path" || echo 000)
    if [ "$status" = "200" ]; then
      echo "  ✓ $label $PUBLIC_URL$path (200)"
      return 0
    fi
    sleep 2
  done
  echo "  ✗ $label $PUBLIC_URL$path (last status: $status)" >&2
  return 1
}
ok=true
case "$target" in
  frontend) public_check "/" "frontend" || ok=false ;;
  api)      public_check "/api/health" "api" || ok=false ;;
  all)      public_check "/" "frontend" || ok=false
            public_check "/api/health" "api" || ok=false ;;
esac

if ! $ok; then
  echo "✗ Deployed, but the public check failed. On-host logs:" >&2
  echo "  ssh $REMOTE 'sudo docker compose -f $REMOTE_PATH/docker-compose.traefik.yml logs --tail 50 exposeu-nginx exposeu-contact'" >&2
  exit 1
fi

echo "✓ Done in ${elapsed}s — $branch @ $commit → $PUBLIC_URL"
