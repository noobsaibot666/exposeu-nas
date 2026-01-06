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

Pull latest code:
cd /mnt/Leviathan/www/exposeu
git pull

Verify:
git status
→ should be clean

If frontend changed:
docker compose up -d --build

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