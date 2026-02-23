cd /mnt/Leviathan/www/exposeu

Local dev (no host npm)
sudo docker run --rm -it \
  -v "$PWD:/app" -w /app \
  -p 5173:5173 \
  node:20-alpine sh -lc "npm ci && npm run dev -- --host 0.0.0.0 --port 5173"
Open: http://192.168.178.146:5173




1) If you only changed frontend (Vite build → dist)
cd /mnt/Leviathan/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx


2) If you only changed the contact API code
cd /mnt/Leviathan/www/exposeu
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact

3) If you changed both
cd /mnt/Leviathan/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact

4) Quick smoke test (always)
curl -kI https://localhost/ -H "Host: expose-u.com" | head -n 8
curl -kI https://localhost/api/contact -H "Host: expose-u.com" | head -n 8
curl -k https://localhost/api/contact -H "Host: expose-u.com" -H "Content-Type: application/json" --data '{"email":"test@example.com","message":"smoke"}'

//

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
