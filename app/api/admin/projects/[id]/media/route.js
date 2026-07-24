import { NextResponse } from "next/server";
import { initDb, pool, audit } from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/admin";
import { saveUploadedFile, sha256 } from "../../../../../../lib/storage";

const MAX_IMAGE=15*1024*1024, MAX_PDF=30*1024*1024, MAX_VIDEO=300*1024*1024;
export async function POST(req,{params}) {
  const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const {id}=await params; const form=await req.formData(); const file=form.get("file");
  if(!file || typeof file.arrayBuffer!=="function")return NextResponse.json({error:"Chưa chọn tệp"},{status:400});
  const kind=String(form.get("kind")||"").toUpperCase();
  const limit=kind==="VIDEO"?MAX_VIDEO:kind==="DOCUMENT"?MAX_PDF:MAX_IMAGE;
  if(file.size>limit)return NextResponse.json({error:`Tệp vượt giới hạn ${Math.round(limit/1024/1024)}MB`},{status:400});
  const saved=await saveUploadedFile(file,`projects/${id}`);
  if(kind==="DOCUMENT"){
    const title=String(form.get("title")||file.name||"Tài liệu"); const category=String(form.get("category")||"OTHER"); const visibility=String(form.get("visibility")||"PUBLIC");
    const d=await pool.query("INSERT INTO project_documents(project_id,title,category,visibility,created_by) VALUES($1,$2,$3,$4,$5) RETURNING *",[id,title,category,visibility,user.sub]);
    const v=await pool.query(`INSERT INTO project_document_versions(document_id,version_no,file_url,file_name,mime_type,size_bytes,storage_provider,checksum,notes,created_by) VALUES($1,1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,[d.rows[0].id,saved.url,saved.name,saved.mime,saved.size,saved.provider,sha256(saved.url+saved.size),String(form.get("notes")||""),user.sub]);
    await audit(user.sub,"DOCUMENT_UPLOAD","PROJECT_DOCUMENT",d.rows[0].id,{project_id:id,file:saved.name});
    return NextResponse.json({document:d.rows[0],version:v.rows[0]},{status:201});
  }
  const mediaType=kind==="VIDEO"?"VIDEO":"IMAGE"; const title=String(form.get("title")||file.name||""); const visibility=String(form.get("visibility")||"PUBLIC"); const isHero=String(form.get("isHero"))==="true";
  if(isHero)await pool.query("UPDATE project_media SET is_hero=FALSE WHERE project_id=$1",[id]);
  const m=await pool.query(`INSERT INTO project_media(project_id,media_type,title,url,mime_type,size_bytes,storage_provider,visibility,is_hero,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,[id,mediaType,title,saved.url,saved.mime,saved.size,saved.provider,visibility,isHero,user.sub]);
  await audit(user.sub,"MEDIA_UPLOAD","PROJECT_MEDIA",m.rows[0].id,{project_id:id,type:mediaType,file:saved.name});
  return NextResponse.json({media:m.rows[0]},{status:201});
}
