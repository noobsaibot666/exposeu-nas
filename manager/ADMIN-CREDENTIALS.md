# Exposeu Manager Credentials

## Current logins

Admin (seeded from `manager/.env`):
- Email: `admin@exposeu.local`
- Password: `change-me`

Additional user:
- Email: `alan@exposeu.local`
- Password: `0811`

## Notes

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` only seed a user on first run.
- To change an existing user's password, update it directly in the DB.

## Update alan password (no delete)

```
sudo docker exec \
  -e NEW_EMAIL="alan@exposeu.local" \
  -e NEW_PASSWORD="0811" \
  exposeu-manager-api \
  node --input-type=module -e "import bcrypt from 'bcrypt'; import pg from 'pg'; const { Pool } = pg; const email = process.env.NEW_EMAIL?.trim(); const password = process.env.NEW_PASSWORD; if (!email || !password) { console.error('Missing NEW_EMAIL/NEW_PASSWORD'); process.exit(1); } const pool = new Pool({ connectionString: process.env.DATABASE_URL }); const hash = await bcrypt.hash(password, 12); await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash', [email, hash]); await pool.end(); console.log('ok');"
```
