# DEPLOY-SEQUENCE

Production site: `https://expose-u.com`

Project paths:
- TrueNAS / SSH: `/mnt/Gaia/04_DEV/web/www/exposeu`
- Finder / local mount: `/Volumes/Gaia/04_DEV/web/www/exposeu`

Connect: `ssh alan@192.168.178.146`

Containers:
- frontend: `exposeu-nginx`
- contact API: `exposeu-contact`
- reverse proxy: `traefik`

Rule:
- Never recreate `traefik`
- Only restart the services you changed

## Local Test / Preview

Run these on the TrueNAS host over SSH. The host does not need `npm` installed; Node runs in Docker.

**Note:** these two commands still run `npm ci` directly against the shared mount, same
as the old deploy commands did — they carry the same corruption risk described in
Production Deploy below. Fine for an occasional one-off preview; avoid running one of
these at the same time as a deploy or local dev-machine tooling.

### Vite dev preview

```sh
cd /mnt/Gaia/04_DEV/web/www/exposeu
sudo docker run --rm \
  -p 192.168.178.146:2222:2222 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run dev -- --host 0.0.0.0 --port 2222"
```

Open:

```text
http://192.168.178.146:5183
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

**Run this on the TrueNAS host, over SSH — never from a local machine.** The old inline
`npm ci` commands below are gone: running `npm ci` straight against
`/mnt/Gaia/...`/`/Volumes/Gaia/...` writes thousands of small files onto storage that's
also mounted by dev machines over SMB, and that raced badly enough on 2026-08-24 to
corrupt `node_modules` (see `CLAUDE.md` → Deployment for the full incident).

```sh
scripts/deploy.sh frontend   # build + recreate exposeu-nginx
scripts/deploy.sh api        # build + recreate exposeu-contact
scripts/deploy.sh all        # build + recreate both
```

The script builds inside the deploy container's own private filesystem and copies back
only the finished `node_modules`/`dist` in one bounded operation, plus a `flock` so two
deploys can't overlap. It also checks up front that it's actually running against the
TrueNAS Docker daemon and refuses with a clear message otherwise — if you see a
`flock: command not found` or "can't reach the Docker daemon" error, you ran it from a
local machine; SSH in first (see Connect, above) and run it from there.

## Smoke Checks

`scripts/deploy.sh` runs this automatically now (curls `/` for `frontend` and
`/api/health` for `api`, with retries, through localhost with the production Host
header) and fails loudly — non-zero exit, a log-tail hint printed — if the deployed
containers aren't actually answering. A "Deploy complete" message means the smoke
check passed, not just that the container reported "Started".

For a manual look beyond what the script checks:

```sh
sudo docker compose -f docker-compose.traefik.yml ps
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
