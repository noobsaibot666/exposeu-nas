# ExposeU – Dev → Deploy Flow

Goal: Update design & pages without breaking server setup.

---

## Dev machine (macOS)

- Work only on:
  - UI / design
  - Pages
  - App logic

- Never touch:
  - Docker
  - nginx
  - Traefik
  - .env files

Commit & push:
git commit -m "update: pages / design"
git push

---

## Server (TrueNAS)

No git commands on the server. Git is only used to store changes.

If frontend changed (nginx serves the Vite build):
```bash
# From the repo root on TrueNAS
cd /mnt/Leviathan/www/exposeu

# Build + restart the frontend container
sudo docker compose -f docker-compose.traefik.yml up -d --build

# If assets still look stale, force a clean recreate
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate
```

---

## Safety

- Server-only files are protected via:
  .git/info/exclude

- git pull will:
  ✅ update app code
  ❌ not overwrite infra

---

## If something breaks

docker ps
docker logs traefik --tail=100
docker logs exposeu-nginx --tail=100
curl -I https://expose-u.com/any-route

---

Rule:
Dev = code  
Server = infrastructure  
They never cross
