# Exposeu Manager - TrueNAS deployment checklist

Use this later when TrueNAS is ready.

## Requirements
- Docker on TrueNAS (Apps or standard Docker)
- Datasets/volumes for:
  - Postgres data
  - Uploads

## Steps
1) Create datasets
- `exposeu_manager_db`
- `exposeu_manager_uploads`

2) Place repo on TrueNAS (or pull from GitHub)
- Ensure `manager/` is present.

3) Prepare env
- Copy `manager/.env.example` to `manager/.env`
- Set strong `API_JWT_SECRET` and `ADMIN_PASSWORD`
- For LAN access, set the web env in `manager/web/.env.local`:
```
VITE_MANAGER_API=http://<NAS_LAN_IP>:4001
```

4) Update Docker Compose volume paths
- Map Postgres data to `exposeu_manager_db`
- Map uploads to `exposeu_manager_uploads`

5) Start stack
```
docker compose -f manager/docker-compose.yml up -d --build
```

6) Apply schema
```
psql postgresql://exposeu:exposeu@localhost:5432/exposeu_manager -f manager/api/schema.sql
```

7) Local-only access
- Do not expose ports to WAN
- Optionally bind to internal LAN IP only

## Optional
- Set up scheduled snapshots/backups for DB + uploads.
