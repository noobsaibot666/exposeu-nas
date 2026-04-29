# DEPLOY-SEQUENCE

Lean runbook for the ExposeU root project only.

Production site: `https://expose-u.com`

## Paths

- SSH/server project path: `/mnt/Gaia/04_DEV/web/www/exposeu`
- Local Finder path, not for SSH commands: `/Volumes/Gaia/04_DEV/web/www/exposeu`
- Home page: `src/pages/HomeV2.tsx`
- Compose file: `docker-compose.traefik.yml`
- Frontend container: `exposeu-nginx`
- Contact API container: `exposeu-contact`
- TrueNAS LAN preview IP: `192.168.178.146`

## SSH Pre-flight

Run this first if the shell/session is fresh.

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
test -f package-lock.json
test -f docker-compose.traefik.yml
test -f nginx/default.conf
sudo docker version >/dev/null
sudo docker compose version
```

## Local Preview

Use this over SSH before deploying. The TrueNAS host does not need host
Node/npm installed; these commands run Node through Docker.

### 1) Start the Vite dev server

On the TrueNAS SSH session:

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:5173:5173 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run dev -- --host 0.0.0.0"
```

Open this URL from your Mac:

```text
http://192.168.178.146:5173
```

If Vite prints `http://172.16.0.3:5173/`, ignore it. That is the Docker
container IP, not the LAN preview URL. The correct browser URL stays
`http://192.168.178.146:5173`.

Stop the dev server with `Ctrl-C`. If npm prints `signal SIGINT` after stopping,
that is expected and not a deploy error.

### 2) Preview the production build locally

On the TrueNAS SSH session:

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:4173:4173 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run build && npm run preview -- --host 0.0.0.0"
```

Open this URL from your Mac:

```text
http://192.168.178.146:4173
```

Stop the preview server with `Ctrl-C`. If npm prints `signal SIGINT` after
stopping, that is expected.

### 3) Optional local API check

On the TrueNAS SSH session:

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:8787:8787 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run server"
```

In another SSH terminal:

```sh
curl -i http://192.168.178.146:8787/contact
```

Production contact form traffic goes through Traefik at `/api/contact`. The
local API health check above confirms the Node service is running, but it does
not reproduce the production Traefik route.

## Deploy Sequence

Run this on the TrueNAS/Linux host. Use the sequence that matches the files you
changed.

### Frontend-only change

Use this for React/Vite changes, including `src/pages/HomeV2.tsx`.

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx
```

### API-only change

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact
```

### Frontend + API change

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact
```

## Production Smoke Tests

Run after every deploy.

```sh
curl -kI https://localhost/ -H "Host: expose-u.com" | head -n 12

curl -kI https://localhost/api/contact -H "Host: expose-u.com" | head -n 12

curl -k https://localhost/api/contact \
  -H "Host: expose-u.com" \
  -H "Content-Type: application/json" \
  --data '{"email":"test@example.com","message":"smoke"}'
```

Expected:

- `/` is served by nginx.
- `/api/contact` reaches Express through Traefik.
- POST `/api/contact` returns JSON with `"ok": true`.

## Guardrails

- Do not recreate Traefik during ExposeU updates.
- Do not run `docker compose ... up -d --force-recreate` without specifying services.
- Only restart `exposeu-nginx` and/or `exposeu-contact`.
- Leave `website-nginx`, `exposeu-manager`, and other stacks untouched.

## Recovery

If ExposeU returns 404, check the running containers:

```sh
sudo docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E 'traefik|exposeu-nginx|exposeu-contact'
```

Check `webnet` membership:

```sh
sudo docker network inspect webnet --format '{{range $id,$c := .Containers}}{{println $c.Name}}{{end}}' | sort
```

Required members:

- `traefik`
- `exposeu-nginx`
- `exposeu-contact`

Safest restart:

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker compose -f docker-compose.traefik.yml up -d exposeu-nginx exposeu-contact
```

## Notes

- 2026-04-29: Updated SSH commands to use Dockerized Node because TrueNAS does not provide host `npm`.
