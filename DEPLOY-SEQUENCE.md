1) If you only changed frontend (Vite build → dist)
cd /mnt/Leviathan/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx


2) If you only changed the contact API code
cd /mnt/Leviathan/www/exposeu
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-contact

3) If you changed both
cd /mnt/Leviathan/www/exposeu
sudo docker run --rm -u 0 -v "$PWD:/app" -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact

4) Quick smoke test (always)
curl -kI https://localhost/ -H "Host: expose-u.com" | head -n 8
curl -kI https://localhost/api/contact -H "Host: expose-u.com" | head -n 8
curl -k https://localhost/api/contact -H "Host: expose-u.com" -H "Content-Type: application/json" --data '{"email":"test@example.com","message":"smoke"}'

