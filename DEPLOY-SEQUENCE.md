# DEPLOY-SEQUENCE (ExposeU root project only)
Safe deploy routine for https://expose-u.com (frontend + contact API).
Goal: update ExposeU ONLY, without touching Traefik, alan-design.com, or the Manager stack.

## Golden rules (DO NOT BREAK OTHER SITES)
- **Do NOT recreate Traefik** during ExposeU updates.
  - No `docker compose ... up -d traefik`
  - No `docker compose ... up -d --force-recreate` without specifying services
- Only ever restart:
  - `exposeu-nginx` (frontend)
  - `exposeu-contact` (API)
- Traefik must be running and must stay the single router for all sites.

---

## 0) Pre-flight quick check (optional but recommended)
```sh
sudo docker ps --format "table {{.Names}}\t{{.Status}}" | egrep 'traefik|exposeu-nginx|exposeu-contact|website-nginx|exposeu-manager'


1) Frontend-only change (Vite build → dist)
cd /mnt/Leviathan/www/exposeu

# Build dist using a clean container (no host npm required)
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"

# Restart ONLY ExposeU nginx
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx


2) Contact API-only change (server/index.js etc.)
cd /mnt/Leviathan/www/exposeu

# Restart ONLY the API container
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact

3) Frontend + API change (both)
cd /mnt/Leviathan/www/exposeu

# Build dist
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"

# Restart ONLY ExposeU services (NOT traefik)
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact

4) Always run smoke tests (must pass)

# Website should be served by nginx
curl -kI https://localhost/ -H "Host: expose-u.com" | head -n 12

# API should respond via Traefik route (/api -> exposeu-contact, stripPrefix)
curl -kI https://localhost/api/contact -H "Host: expose-u.com" | head -n 12

curl -k https://localhost/api/contact -H "Host: expose-u.com" \
  -H "Content-Type: application/json" \
  --data '{"email":"test@example.com","message":"smoke"}'

  Expected:
	•	/ => server: nginx
	•	/api/contact => x-powered-by: Express and JSON { "ok": true } on POST


  5) Recovery if ExposeU returns 404 (most common pitfall)
  5.1 Verify containers are running
  sudo docker ps --format "table {{.Names}}\t{{.Status}}" | egrep 'traefik|exposeu-nginx|exposeu-contact'

5.2 Verify webnet has the right members
sudo docker network inspect webnet --format '{{range $id,$c := .Containers}}{{println $c.Name}}{{end}}' | sort

Must include:
	•	traefik
	•	exposeu-nginx
	•	exposeu-contact


  5.3 Safest fix: start ExposeU services (do NOT touch Traefik)

  cd /mnt/Leviathan/www/exposeu
sudo docker compose -f docker-compose.traefik.yml up -d exposeu-nginx exposeu-contact

# Deployment notes
- 2026-02-10: Added canonical service redirects + /documentation route (Phase 1 technical integrity). Verified 301s and route checks on production.
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
