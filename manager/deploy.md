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

## Patch columns for existing tables
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager <<'SQL'
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_color TEXT;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS total_budget NUMERIC(12,2) DEFAULT 0 NOT NULL;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS vat_percent NUMERIC(5,2) DEFAULT 0;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS profit_percent NUMERIC(5,2) DEFAULT 0;
ALTER TABLE workflow_steps ALTER COLUMN default_offset_days TYPE NUMERIC(6,2) USING default_offset_days::numeric;
ALTER TABLE workflow_steps ADD COLUMN IF NOT EXISTS default_cost NUMERIC(12,2) DEFAULT 0;
ALTER TABLE project_steps ADD COLUMN IF NOT EXISTS offset_days NUMERIC(6,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS calendar_token TEXT;
SQL
```

## Create roadmap tables
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager <<'SQL'
CREATE TABLE IF NOT EXISTS roadmaps (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  source_type TEXT DEFAULT 'markdown',
  auto_schedule BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_phases (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal TEXT,
  position INTEGER NOT NULL,
  start_day INTEGER,
  end_day INTEGER
);

CREATE TABLE IF NOT EXISTS roadmap_steps (
  id SERIAL PRIMARY KEY,
  roadmap_phase_id INTEGER REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS roadmap_checkpoints (
  id SERIAL PRIMARY KEY,
  roadmap_phase_id INTEGER REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roadmap_metrics (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS roadmap_rules (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL
);
SQL
```

## Update workflow templates (standard + film production)
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager <<'SQL'
UPDATE workflow_templates
SET name = 'Film production workflow', description = 'Briefing to delivery'
WHERE LOWER(name) = LOWER('Default workflow');

INSERT INTO workflow_templates (name, description)
SELECT 'Standard workflow', 'Simple 3-step flow'
WHERE NOT EXISTS (
  SELECT 1 FROM workflow_templates WHERE LOWER(name) = LOWER('Standard workflow')
);

WITH standard AS (
  SELECT id FROM workflow_templates WHERE LOWER(name) = LOWER('Standard workflow') LIMIT 1
)
INSERT INTO workflow_steps (template_id, name, position, default_offset_days, default_cost)
SELECT standard.id, step_name, step_position, step_offset, 0
FROM standard
JOIN (
  VALUES
    ('Plan', 1, 0),
    ('Produce', 2, 7),
    ('Deliver', 3, 14)
) AS steps(step_name, step_position, step_offset) ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM workflow_steps WHERE template_id = standard.id
);
SQL
```

## Backfill ownership (assign existing projects to admin)
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager <<'SQL'
UPDATE users SET is_admin = TRUE WHERE LOWER(email) = LOWER('alan@exposeu.local');
UPDATE projects SET owner_user_id = (SELECT id FROM users WHERE LOWER(email) = LOWER('alan@exposeu.local')) WHERE owner_user_id IS NULL;
UPDATE budgets SET owner_user_id = (SELECT id FROM users WHERE LOWER(email) = LOWER('alan@exposeu.local')) WHERE owner_user_id IS NULL;
SQL
```

## Remove admin access from a user
```sh
sudo docker exec -i exposeu-manager-db psql -U exposeu -d exposeu_manager -c "UPDATE users SET is_admin = FALSE WHERE LOWER(email) = LOWER('asia@exposeu.local');"
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
