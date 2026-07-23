import pg from "pg";
const {Pool}=pg;
const g=globalThis;
export const pool=g.__vnrebPool||new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:false});
if(process.env.NODE_ENV!=="production")g.__vnrebPool=pool;
let ready=false;
export async function initDb(){if(ready)return;await pool.query(`
CREATE TABLE IF NOT EXISTS users(
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
full_name VARCHAR(160) NOT NULL,email VARCHAR(190) UNIQUE NOT NULL,phone VARCHAR(30),
password_hash TEXT NOT NULL,role VARCHAR(40) NOT NULL DEFAULT 'CUSTOMER',
status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);ready=true}
