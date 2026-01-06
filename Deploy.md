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



# Exposeu Manager Deployment Notes

This document explains how to run the Manager stack and highlights the fix used to resolve the login issue on TrueNAS.

## Services
- `db`: Postgres
- `api`: Node/Express API
- `web`: React/Vite UI

## Dev (local macOS)
1) Copy env:
```bash
cp manager/.env.example manager/.env
```
2) Start stack:
```bash
docker compose -f manager/docker-compose.yml up -d --build
```
3) Apply schema:
```bash
psql postgresql://exposeu:exposeu@localhost:5432/exposeu_manager -f manager/api/schema.sql
```
4) Open:
- Web UI: http://localhost:5175
- API health: http://localhost:4001/health

## TrueNAS (server)
1) Ensure folders exist for persistent storage:
```bash
sudo mkdir -p /mnt/Leviathan/www/db/exposeu_manager_db
sudo mkdir -p /mnt/Leviathan/www/db/exposeu_manager_uploads
```
2) Start stack:
```bash
cd /mnt/Leviathan/www/exposeu/manager
sudo docker compose -f truenas-docker-compose.yml up -d --build
```
If accessing the UI from another device on the LAN, set:
```bash
VITE_MANAGER_API=http://<NAS_LAN_IP>:4001
```
3) Apply schema:
```bash
psql postgresql://exposeu_manager:0811@localhost:5433/exposeu_manager -f /mnt/Leviathan/www/exposeu/manager/api/schema.sql
```
4) Access:
- Web UI: http://<NAS_LAN_IP>:5175
- API health: http://<NAS_LAN_IP>:4001/health

## Login issue workaround (TrueNAS)
Symptom: UI login fails while API login works via curl. Root cause: frontend still calling `http://localhost:4001`.

Fix: set the correct env var for the Vite UI (note the name).
```bash
sudo tee /mnt/Leviathan/www/exposeu/manager/web/.env.local >/dev/null <<'EOF'
VITE_MANAGER_API=http://<NAS_LAN_IP>:4001
EOF
```

Then rebuild the web service:
```bash
sudo docker compose -f /mnt/Leviathan/www/exposeu/manager/truenas-docker-compose.yml up -d --build web
```
