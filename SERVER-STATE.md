# ExposeU – Server State (Stable)

Status: ✅ UP & RUNNING  
Last verified: 2026-01-06

---

## What is running

- Domain: https://expose-u.com
- TLS: Traefik + ACME (valid)
- Frontend: Vite SPA served by nginx
- Containers:
  - traefik
  - exposeu-nginx
  - website-nginx

---

## Fixes applied (server-side only)

1. **SPA routing (404 on refresh)**
   - Added SPA fallback in nginx:
     try_files $uri $uri/ /index.html;

2. **Traefik ↔ nginx stability**
   - Single shared docker network: `webnet`
   - Explicit Traefik labels per service
   - One nginx container per domain

3. **Git safety**
   - Server-only files excluded via:
     .git/info/exclude

   Ignored on server:
   - nginx/
   - manager/.env*
   - manager/truenas-docker-compose.yml

---

## Health check commands

docker ps
curl -I https://expose-u.com/gallery-stories
docker exec exposeu-nginx grep try_files /etc/nginx/conf.d/default.conf
docker logs traefik --tail=50

Expected:
- HTTP 200 on SPA routes
- No Traefik errors
- No container restarts

---

## Rules

- Infrastructure changes happen **only on server**
- This file must be updated if infra changes