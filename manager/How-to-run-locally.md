# Exposeu Manager - How to run locally

## Prereqs
- Docker + Docker Compose
- PostgreSQL client (optional, for applying schema)

## Steps
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

## Default admin
Credentials are set in `manager/.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Notes
- Uploads are stored in `manager/uploads`.
- Share links are public and live at `/share/:token`.
- Upload limit is set to 2GB.

From inside manager/, drop the path:
docker compose up -d --build

