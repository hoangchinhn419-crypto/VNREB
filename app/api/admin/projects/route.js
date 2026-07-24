import { NextResponse } from "next/server";
import { initDb, pool, audit } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";

const slugify = s => String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error:"Không có quyền" },{status:403});
  await initDb();
  const r = await pool.query(`SELECT p.*,
    (SELECT url FROM project_media m WHERE m.project_id=p.id AND m.is_hero=TRUE ORDER BY m.sort_order,m.created_at LIMIT 1) hero_url,
    (SELECT COUNT(*)::int FROM project_media m WHERE m.project_id=p.id) media_count,
    (SELECT COUNT(*)::int FROM project_documents d WHERE d.project_id=p.id) document_count
    FROM projects p WHERE p.deleted_at IS NULL ORDER BY p.updated_at DESC`);
  return NextResponse.json({ projects:r.rows });
}

export async function POST(req) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error:"Không có quyền" },{status:403});
  await initDb();
  const b = await req.json();
  if (!b.name?.trim()) return NextResponse.json({error:"Tên dự án là bắt buộc"},{status:400});
  let slug = slugify(b.slug || b.name);
  const exists = await pool.query("SELECT 1 FROM projects WHERE slug=$1",[slug]);
  if (exists.rowCount) slug += `-${Date.now().toString().slice(-6)}`;
  const r = await pool.query(`INSERT INTO projects(name,slug,code,developer,project_type,status,visibility,province,district,address,latitude,longitude,price_from,price_to,currency,legal_status,progress,summary,description,amenities,featured,created_by)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *`,[
      b.name.trim(),slug,b.code||null,b.developer||null,b.project_type||null,b.status||"DRAFT",b.visibility||"PUBLIC",b.province||null,b.district||null,b.address||null,
      b.latitude||null,b.longitude||null,b.price_from||null,b.price_to||null,b.currency||"VND",b.legal_status||null,b.progress||null,b.summary||null,b.description||null,
      Array.isArray(b.amenities)?b.amenities:[],!!b.featured,user.sub
    ]);
  await audit(user.sub,"PROJECT_CREATE","PROJECT",r.rows[0].id,{name:b.name});
  return NextResponse.json({project:r.rows[0]},{status:201});
}
