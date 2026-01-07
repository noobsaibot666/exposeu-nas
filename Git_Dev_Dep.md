 Edit code on TrueNAS
cd /mnt/Leviathan/www/exposeu
nano server/index.js
nano src/pages/Contact.tsx

Commit snapshot (versioned backup)
git add -A
git commit -m "Describe change"
git push

Redeploy containers
cd /mnt/Leviathan/www/website
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx exposeu-contact

---
Run to deploy

cd /mnt/Leviathan/www/exposeu
sudo docker run --rm -t \
  -v /mnt/Leviathan/www/exposeu:/app \
  -w /app \
  node:20-alpine \
  sh -lc "npm ci && npm run build"


cd /mnt/Leviathan/www/website
sudo docker compose -f docker-compose.traefik.yml up -d --force-recreate exposeu-nginx
