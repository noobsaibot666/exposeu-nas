# Deploy

Operational commands for the Exposeu Manager container.

## Recreate containers
```sh
cd /mnt/Leviathan/www/exposeu/manager
sudo docker compose up -d --force-recreate

## Build Container
sudo docker compose up -d --build --force-recreate

```

## Update database schema (interactive)
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager <<'SQL'
-- put your ALTER/CREATE/UPDATE here
SQL
```

## Apply schema file
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager < /mnt/Leviathan/www/exposeu/manager/api/schema.sql
```

## Verify schema changes
```sh
sudo docker exec -it exposeu-manager-db psql -U exposeu -d exposeu_manager -c "\dt"
```

## Restart services
```sh
sudo docker restart exposeu-manager-api
```

## Check database context
```sh
sudo docker exec -it exposeu-manager-db psql -U exposeu -d exposeu_manager -c "SELECT current_database(), current_user;"
```

## Create or reset a user
```sh
HASH=$(sudo docker exec -i exposeu-manager-api node -e "const bcrypt=require('bcrypt');bcrypt.hash('0811',12).then(h=>console.log(h))" | tr -d '\r')
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager -c "INSERT INTO users (email, password_hash) VALUES ('asia@exposeu.local', '${HASH}') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;"
```
