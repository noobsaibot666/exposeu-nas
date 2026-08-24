#!/usr/bin/env bash
# Repair script for a specific corruption pattern this repo hits on its
# SMB-mounted NAS share (/Volumes/Gaia/... on a Mac, same files as
# /mnt/Gaia/... on the TrueNAS host that serves them). Concurrent file
# churn against that share — a deploy build, another client, or just a
# git operation racing an interrupted one — leaves stray artifacts behind
# that make the *next* git operation fail with a misleading error:
#
#   fatal: unable to write loose object file: Is a directory
#   fatal: cannot update ref '...': couldn't write '...refs/heads/X.lock'
#   fatal: unable to write ... — followed by git status showing nothing
#   wrong when you look
#
# None of these mean your commits are lost or your source is corrupted —
# `git status`/`git diff` against tracked files come back clean every time
# this has happened. It's leftover junk blocking the *next* write, not
# damage to what's already committed. This script finds and clears that
# junk so you don't have to manually diagnose it each time (see the
# 2026-08-24 incident in CLAUDE.md for how this was first traced).
#
# Safe by design: every removal target here is either (a) a temp file git
# itself creates and would already be ignoring — `.git/objects/*/tmp_obj_*`
# — or (b) a macOS SMB-client rename-before-delete artifact —
# `.smbdelete*` — that git never creates and never reads. Nothing this
# script touches is a real git object, ref, or commit. The one exception
# (a genuinely held index.lock from another running git process) is
# explicitly checked for and left alone if found.
#
# Usage: scripts/git-nas-doctor.sh [--fix]
#   (no args)  report what it finds, change nothing
#   --fix      also remove what it finds

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
cd "$REPO_DIR"

if [ ! -d .git ] && [ ! -f .git ]; then
  echo "No .git here ($REPO_DIR) — run this from the repo." >&2
  exit 1
fi

fix=false
if [ "${1:-}" = "--fix" ]; then
  fix=true
fi

found_any=false

echo "==> Scanning for stale git-object temp files (.git/objects/*/tmp_obj_*)..."
tmp_objs=$(find .git/objects -type f -name "tmp_obj_*" 2>/dev/null || true)
if [ -n "$tmp_objs" ]; then
  found_any=true
  echo "$tmp_objs" | sed 's/^/    /'
  if $fix; then
    echo "$tmp_objs" | xargs rm -f
    echo "    removed."
  fi
else
  echo "    none found."
fi

echo "==> Scanning for macOS SMB-client artifacts (.smbdelete*) under .git/..."
smb_artifacts=$(find .git -iname ".smbdelete*" 2>/dev/null || true)
if [ -n "$smb_artifacts" ]; then
  found_any=true
  echo "$smb_artifacts" | sed 's/^/    /'
  if $fix; then
    echo "$smb_artifacts" | xargs rm -rf
    echo "    removed."
  fi
else
  echo "    none found."
fi

echo "==> Checking .git/index.lock..."
if [ -e .git/index.lock ]; then
  if [ -d .git/index.lock ]; then
    found_any=true
    echo "    .git/index.lock is a DIRECTORY — git never creates locks this way, this is corruption."
    if $fix; then
      rmdir .git/index.lock 2>/dev/null || rm -rf .git/index.lock
      echo "    removed."
    fi
  else
    found_any=true
    if pgrep -x git >/dev/null 2>&1; then
      echo "    .git/index.lock exists AND a git process is currently running — leaving it alone, this looks real."
    else
      echo "    .git/index.lock exists but no git process is running — likely stale."
      if $fix; then
        rm -f .git/index.lock
        echo "    removed."
      fi
    fi
  fi
else
  echo "    none found."
fi

echo "==> Checking .git/refs/heads/ for non-ref filenames (e.g. .smbdelete*)..."
bad_refs=""
for f in .git/refs/heads/.[!.]* .git/refs/heads/..?*; do
  [ -e "$f" ] || continue
  bad_refs="$bad_refs$f"$'\n'
done
if [ -n "$bad_refs" ]; then
  found_any=true
  printf '%s' "$bad_refs" | sed 's/^/    /'
  if $fix; then
    printf '%s' "$bad_refs" | xargs -I{} rm -f {}
    echo "    removed."
  fi
else
  echo "    none found."
fi

echo
if ! $found_any; then
  echo "All clean — no known corruption artifacts found."
elif $fix; then
  echo "Done. Retry whatever git command failed."
else
  echo "Found artifacts above but did not remove them (no --fix passed)."
  echo "Re-run with: scripts/git-nas-doctor.sh --fix"
fi
