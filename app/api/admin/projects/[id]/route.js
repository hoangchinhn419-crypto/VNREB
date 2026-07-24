import { NextResponse } from "next/server";
import { initDb, pool, audit } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/admin";

export async function GET(_req,{params}) {
  const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const {id}=await params;
  const p=await pool.query("SELECT * FROM projects WHERE id=$1 AND deleted_at IS NULL",[id]);
  if(!p.rowCount)return NextResponse.json({error:"Không tìm thấy dự án"},{status:404});
  const media=await pool.query("SELECT * FROM project_media WHERE project_id=$1 ORDER BY sort_order,created_at",[id]);
  const docs=await pool.query(`SELECT d.*, COALESCE(json_agg(v ORDER BY v.version_no DESC) FILTER(WHERE v.id IS NOT NULL),'[]') versions FROM project_documents d LEFT JOIN project_document_versions v ON v.document_id=d.id WHERE d.project_id=$1 GROUP BY d.id ORDER BY d.updated_at DESC`,[id]);
  return NextResponse.json({project:p.rows[0],media:media.rows,documents:docs.rows});
}

export async function PATCH(req,{params}) {
  const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const {id}=await params; const b=await req.json();
  const keys=["name","code","developer","project_type","status","visibility","province","district","address","latitude","longitude","price_from","price_to","currency","legal_status","progress","summary","description","amenities","featured"];
  const sets=[],vals=[]; for(const k of keys){if(Object.prototype.hasOwnProperty.call(b,k)){vals.push(k==="amenities"?(Array.isArray(b[k])?b[k]:[]):b[k]);sets.push(`${k}=$${vals.length}`)}}
  if(!sets.length)return NextResponse.json({error:"Không có dữ liệu cập nhật"},{status:400});
  vals.push(id); const r=await pool.query(`UPDATE projects SET ${sets.join(",")},updated_at=NOW() WHERE id=$${vals.length} AND deleted_at IS NULL RETURNING *`,vals);
  if(!r.rowCount)return NextResponse.json({error:"Không tìm thấy dự án"},{status:404});
  await audit(user.sub,"PROJECT_UPDATE","PROJECT",id,{fields:keys.filter(k=>Object.prototype.hasOwnProperty.call(b,k))});
  return NextResponse.json({project:r.rows[0]});
}

export async function DELETE(_req,{params}) {
  const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const {id}=await params;
  const r=await pool.query("UPDATE projects SET deleted_at=NOW(),updated_at=NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING id",[id]);
  if(!r.rowCount)return NextResponse.json({error:"Không tìm thấy dự án"},{status:404});
  await audit(user.sub,"PROJECT_DELETE","PROJECT",id,{});
  return NextResponse.json({ok:true});
}
