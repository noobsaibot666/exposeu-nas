CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  calendar_token TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_steps (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES workflow_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  default_offset_days NUMERIC(6, 2) DEFAULT 0,
  default_cost NUMERIC(12, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  service_type TEXT,
  plan_tier TEXT,
  project_color TEXT,
  status TEXT DEFAULT 'briefing',
  start_date DATE,
  due_date DATE,
  notes TEXT,
  workflow_template_id INTEGER REFERENCES workflow_templates(id),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tags (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (project_id, tag)
);

CREATE TABLE IF NOT EXISTS project_steps (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  due_date DATE,
  offset_days NUMERIC(6, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  stored_path TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  minutes INTEGER NOT NULL,
  note TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_reviews (
  project_id INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  delivered_on_time BOOLEAN,
  flow_issues TEXT,
  review_notes TEXT,
  learnings TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_links (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_tags (
  template_id INTEGER REFERENCES workflow_templates(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (template_id, tag)
);

CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  project_title TEXT,
  total_budget NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  production_budget NUMERIC(12, 2) NOT NULL,
  profit_budget NUMERIC(12, 2) NOT NULL,
  profit_percent NUMERIC(5, 2) DEFAULT 0,
  vat_amount NUMERIC(12, 2) DEFAULT 0,
  vat_percent NUMERIC(5, 2) DEFAULT 0,
  notes TEXT,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_steps (
  id SERIAL PRIMARY KEY,
  budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
  project_step_id INTEGER REFERENCES project_steps(id) ON DELETE SET NULL,
  step_name TEXT NOT NULL,
  step_position INTEGER,
  cost_amount NUMERIC(12, 2) DEFAULT 0,
  vendor_name TEXT,
  vendor_cost NUMERIC(12, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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
  notes TEXT,
  payload JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE roadmap_steps
ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

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

-- Compatibility updates for older databases.
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS total_budget NUMERIC(12, 2) DEFAULT 0;

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS profit_percent NUMERIC(5, 2) DEFAULT 0;

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS vat_percent NUMERIC(5, 2) DEFAULT 0;

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Backfill ownership for legacy rows.
UPDATE budgets AS b
SET owner_user_id = p.owner_user_id
FROM projects AS p
WHERE b.project_id = p.id
  AND b.owner_user_id IS NULL
  AND p.owner_user_id IS NOT NULL;
