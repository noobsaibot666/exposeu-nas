# Exposeu Manager

Local-only project manager for Exposeu. Runs in Docker on TrueNAS.

## Services
- `db`: Postgres
- `api`: Node/Express API
- `web`: (placeholder) React/Vite app

## Quick start (dev)
1) Copy env:
```
cp manager/.env.example manager/.env
```
2) Start stack:
```
docker compose -f manager/docker-compose.yml up -d --build
```
3) Apply schema:
```
psql postgresql://exposeu:exposeu@localhost:5432/exposeu_manager -f manager/api/schema.sql
```
4) Open:
- Web UI: http://localhost:5175
- API health: http://localhost:4001/health

## Notes
- Uploads stored in `manager/uploads` volume.
- Share links use `/share/:token` in the API and are public.
- File size limit set to 2GB in API.
