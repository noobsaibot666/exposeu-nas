git pull
# design / pages / UI work
git add .
git commit -m "feat: new page / design update"
git push


cd /mnt/Leviathan/www/exposeu
git pull

# only needed if UI or env-dependent logic changed
sudo docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run build"
sudo docker restart exposeu-nginx traefik