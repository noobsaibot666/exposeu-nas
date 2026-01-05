# Deploy Instructions

These steps describe the normal workflow between the dev machine (local macOS) and the deploy machine (TrueNAS) accessed via SSH.

## Prerequisites

- Git is installed on both machines.
- The repo remote is set to: https://github.com/noobsaibot666/web_five.git
- You can SSH into the deploy machine.

## Dev machine (local macOS)

1. Open a terminal and go to the repo root:

   ```bash
   cd /Volumes/Leviathan/www/exposeu
   ```

2. Check changes:

   ```bash
   git status
   ```

3. Commit your updates:

   ```bash
   git add -A
   git commit -m "Describe your change"
   ```

4. Push to GitHub:

   ```bash
   git push
   ```

## Deploy machine (TrueNAS over SSH)

1. SSH into the deploy machine:

   ```bash
   ssh <user>@<truenas-host>
   ```

2. Go to the repo root on the deploy machine:

   ```bash
   cd /path/to/exposeu
   ```

3. Ensure the repo always matches GitHub exactly (pull-only box):

   ```bash
   git fetch
   git reset --hard origin/main
   ```

4. Optional one-time setup to reject non-fast-forward pulls:

   ```bash
   git config pull.ff only
   ```

## Optional: quick verification

- Run your normal build or restart steps if your stack requires it.
- If you use a process manager (e.g. systemd, pm2, docker), restart or reload the service after pulling.
