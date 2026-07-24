import { NextResponse } from "next/server";
import { initDb, pool } from "../../../lib/db";
export async function GET(){await initDb();const r=await pool.query(`SELECT p.id,p.name,p.slug,p.developer,p.project_type,p.status,p.province,p.district,p.address,p.price_from,p.price_to,p.currency,p.summary,p.legal_status,p.progress,p.featured,
(SELECT url FROM project_media m WHERE m.project_id=p.id AND m.media_type='IMAGE' AND m.visibility='PUBLIC' ORDER BY m.is_hero DESC,m.sort_order,m.created_at LIMIT 1) hero_url
FROM projects p WHERE p.deleted_at IS NULL AND p.visibility='PUBLIC' AND p.status IN('PUBLISHED','SELLING','COMING_SOON') ORDER BY p.featured DESC,p.updated_at DESC`);return NextResponse.json({projects:r.rows})}
