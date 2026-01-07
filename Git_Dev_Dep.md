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

