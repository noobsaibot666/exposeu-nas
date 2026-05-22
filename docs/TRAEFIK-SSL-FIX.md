# Traefik & SSL Resolution (March 2026)

## Problem
Websites returning Cloudflare **502 Bad Gateway** or **504 Gateway Timeout**.

1. **502 Error:** Traefik was missing `entrypoints=web` labels for the HTTP routers. This prevented Let's Encrypt from completing the ACME HTTP-01 challenge and broke the auto-redirect to HTTPS.
2. **504 Error (alan-design.com):** The `website-nginx` container was not explicitly connected to the `webnet` Docker network, causing it to be isolated from Traefik.

## Fixed Configuration

### 1. Traefik Router Labels
In `docker-compose.traefik.yml`, added the `web` entrypoint to handle challenges and redirects:
```yaml
      - "traefik.http.routers.exposeu-http.entrypoints=web"
      - "traefik.http.routers.exposeu-http.rule=Host(`expose-u.com`)"
      - "traefik.http.routers.exposeu-http.middlewares=https-redirect"
```

### 2. Network Connectivity
Ensured all backend services are attached to the external `webnet` network:
```yaml
    networks:
      - webnet
```

### 3. Cloudflare Tunnel Settings
To break the certificate loop, the Cloudflare Tunnel **Public Hostname** was updated:
- **Service:** `https://192.168.178.146:443`
- **HTTP Settings:** Toggle **ON** "No TLS Verify"

## Maintenance Checklist
- If ACME fails, check `sudo docker logs traefik` for "unauthorized" errors.
- Ensure `acme.json` permissions are `600`.
- Always restart both Traefik and the backend container after label changes.
