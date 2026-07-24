import pg from "pg";
const { Pool } = pg;
const g = globalThis;
export const pool = g.__vnrebPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
if (process.env.NODE_ENV !== "production") g.__vnrebPool = pool;
let ready = false;
export async function initDb() {
  if (ready) return;
  await pool.query(`
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password_hash TEXT NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'CUSTOMER',
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS projects(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(220) NOT NULL,
  slug VARCHAR(240) UNIQUE NOT NULL,
  code VARCHAR(80),
  developer VARCHAR(220),
  project_type VARCHAR(100),
  status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
  visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
  province VARCHAR(120),
  district VARCHAR(120),
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price_from NUMERIC(18,2),
  price_to NUMERIC(18,2),
  currency VARCHAR(20) NOT NULL DEFAULT 'VND',
  legal_status TEXT,
  progress TEXT,
  summary TEXT,
  description TEXT,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  hero_media_id UUID,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE TABLE IF NOT EXISTS project_media(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_type VARCHAR(30) NOT NULL,
  title VARCHAR(220),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  mime_type VARCHAR(120),
  size_bytes BIGINT,
  storage_provider VARCHAR(40) NOT NULL DEFAULT 'LOCAL',
  visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_hero BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id, sort_order);

CREATE TABLE IF NOT EXISTS project_documents(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(220) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'OTHER',
  visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
  current_version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_document_versions(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES project_documents(id) ON DELETE CASCADE,
  version_no INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  mime_type VARCHAR(120),
  size_bytes BIGINT,
  storage_provider VARCHAR(40) NOT NULL DEFAULT 'LOCAL',
  checksum VARCHAR(128),
  effective_from DATE,
  effective_to DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, version_no)
);

CREATE TABLE IF NOT EXISTS audit_logs(
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);
  ready = true;
}

export async function audit(actorId, action, entityType, entityId, metadata = {}) {
  await initDb();
  await pool.query(
    "INSERT INTO audit_logs(actor_id,action,entity_type,entity_id,metadata) VALUES($1,$2,$3,$4,$5)",
    [actorId || null, action, entityType, entityId ? String(entityId) : null, metadata]
  );
}
