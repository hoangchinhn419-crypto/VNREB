import { NextResponse } from "next/server";
import { initDb, pool } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/admin";

const clean=v=>v===""||v===undefined?null:v;
export async function PATCH(req,{params}){
 const user=await requireAdmin(); if(!user)return NextResponse.json({error:"Không có quyền"},{status:403}); await initDb(); const {id}=await params; const b=await req.json();
 const old=await pool.query("SELECT * FROM inventory_units WHERE id=$1 AND deleted_at IS NULL",[id]); if(!old.rows[0])return NextResponse.json({error:"Không tìm thấy sản phẩm"},{status:404});
 const vals=[clean(b.zone_id),clean(b.block_id),clean(b.floor_id),b.unit_code,b.unit_type,clean(b.bedrooms),clean(b.bathrooms),clean(b.area_net),clean(b.area_gross),clean(b.door_direction),clean(b.balcony_direction),clean(b.base_price),clean(b.sale_price),clean(b.discount_amount),b.currency,b.legal_status,b.inventory_status,b.visibility,clean(b.note),user.sub,id];
 try{const r=await pool.query(`UPDATE inventory_units SET zone_id=$1,block_id=$2,floor_id=$3,unit_code=$4,unit_type=$5,bedrooms=$6,bathrooms=$7,area_net=$8,area_gross=$9,door_direction=$10,balcony_direction=$11,base_price=$12,sale_price=$13,discount_amount=$14,currency=$15,legal_status=$16,inventory_status=$17,visibility=$18,note=$19,updated_by=$20,updated_at=NOW() WHERE id=$21 RETURNING *`,vals); await pool.query("INSERT INTO inventory_audit_logs(unit_id,project_id,action,old_data,new_data,actor_id) VALUES($1,$2,'UPDATE',$3,$4,$5)",[id,r.rows[0].project_id,old.rows[0],r.rows[0],user.sub]); return NextResponse.json({item:r.rows[0]});}catch(e){return NextResponse.json({error:e.code==="23505"?"Mã sản phẩm đã tồn tại":"Không thể cập nhật"},{status:400})}
}
export async function DELETE(req,{params}){const user=await requireAdmin();if(!user)return NextResponse.json({error:"Không có quyền"},{status:403});await initDb();const {id}=await params;const r=await pool.query("UPDATE inventory_units SET deleted_at=NOW(),updated_by=$2 WHERE id=$1 AND deleted_at IS NULL RETURNING *",[id,user.sub]);if(r.rows[0])await pool.query("INSERT INTO inventory_audit_logs(unit_id,project_id,action,old_data,actor_id) VALUES($1,$2,'DELETE',$3,$4)",[id,r.rows[0].project_id,r.rows[0],user.sub]);return NextResponse.json({ok:true})}
