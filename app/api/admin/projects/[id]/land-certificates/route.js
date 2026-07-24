import { NextResponse } from "next/server";
import { initDb, pool, audit } from "../../../../../../lib/db";
import { requireAdmin } from "../../../../../../lib/admin";
import { saveUploadedFile } from "../../../../../../lib/storage";

const MAX_CERT=30*1024*1024;
export async function GET(_req,{params}){
 const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
 await initDb(); const {id}=await params;
 const r=await pool.query("SELECT * FROM project_land_certificates WHERE project_id=$1 ORDER BY created_at DESC",[id]);
 return NextResponse.json({certificates:r.rows});
}
export async function POST(req,{params}){
 const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});
 await initDb(); const {id}=await params; const form=await req.formData(); const file=form.get("file");
 let saved={url:null,name:null,mime:null,size:null,provider:null};
 if(file&&typeof file.arrayBuffer==="function"&&file.size){
   if(file.size>MAX_CERT)return NextResponse.json({error:"Tệp sổ đỏ/sổ hồng vượt giới hạn 30MB"},{status:400});
   saved=await saveUploadedFile(file,`projects/${id}/land-certificates`);
 }
 const val=k=>String(form.get(k)||"").trim()||null;
 const area=val("area");
 const r=await pool.query(`INSERT INTO project_land_certificates(project_id,certificate_type,certificate_no,book_no,parcel_no,map_sheet_no,area,land_use_type,use_term,owner_name,issued_by,issued_date,property_address,verification_status,visibility,notes,file_url,file_name,mime_type,size_bytes,storage_provider,created_by)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) RETURNING *`,[
   id,val("certificate_type")||"Sổ hồng",val("certificate_no"),val("book_no"),val("parcel_no"),val("map_sheet_no"),area?Number(area):null,val("land_use_type"),val("use_term"),val("owner_name"),val("issued_by"),val("issued_date"),val("property_address"),val("verification_status")||"UNVERIFIED",val("visibility")||"PRIVATE",val("notes"),saved.url,saved.name,saved.mime,saved.size,saved.provider,user.sub
 ]);
 await audit(user.sub,"LAND_CERTIFICATE_CREATE","PROJECT_LAND_CERTIFICATE",r.rows[0].id,{project_id:id,visibility:r.rows[0].visibility});
 return NextResponse.json({certificate:r.rows[0]},{status:201});
}
