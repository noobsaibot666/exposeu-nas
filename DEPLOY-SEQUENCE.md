# DEPLOY-SEQUENCE

Production site: `https://expose-u.com`

Project paths:
- TrueNAS / SSH: `/mnt/Gaia/04_DEV/web/www/exposeu`
- Finder / local mount: `/Volumes/Gaia/04_DEV/web/www/exposeu`

Containers:
- frontend: `exposeu-nginx`
- contact API: `exposeu-contact`
- reverse proxy: `traefik`

Rule:
- Never recreate `traefik`
- Only restart the services you changed

## Local Test / Preview

Run these on the TrueNAS host over SSH. The host does not need `npm` installed; Node runs in Docker.

### Vite dev preview

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:5173:5173 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run dev -- --host 0.0.0.0 --port 5173"
```

Open:

```text
http://192.168.178.146:5173
```

### Production build preview

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:4173:4173 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run build && npm run preview -- --host 0.0.0.0 --port 4173"
```

Open:

```text
http://192.168.178.146:4173
```

## Production Deploy

Run these on the TrueNAS host.

### Frontend only

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx
```

### API only

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact
```

### Frontend + API

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact
```

## Smoke Checks

```sh
curl -kI https://localhost/ -H "Host: expose-u.com" | head -n 12
curl -kI https://localhost/api/contact -H "Host: expose-u.com" | head -n 12
```

Optional POST check:

```sh
curl -k https://localhost/api/contact \
  -H "Host: expose-u.com" \
  -H "Content-Type: application/json" \
  --data '{"email":"test@example.com","message":"smoke"}'
```
-- Deploy All ---

cd /mnt/Gaia/04_DEV/web/www/exposeu

sudo rm -rf node_modules/.tmp .tmp-tests

sudo docker run --rm -u 0 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run build"

sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact

sudo docker compose -f docker-compose.traefik.yml ps