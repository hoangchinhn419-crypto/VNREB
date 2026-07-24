import { NextResponse } from "next/server";
import { initDb, pool } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";

const clean = v => v === "" || v === undefined ? null : v;
export async function GET(req){
  const user=await requireAdmin(); if(!user) return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const {searchParams}=new URL(req.url); const projectId=searchParams.get("projectId");
  const projects=await pool.query("SELECT id,name,code FROM projects WHERE deleted_at IS NULL ORDER BY name");
  if(!projectId) return NextResponse.json({projects:projects.rows,zones:[],blocks:[],floors:[],units:[]});
  const [zones,blocks,floors,units]=await Promise.all([
    pool.query("SELECT * FROM project_zones WHERE project_id=$1 ORDER BY sort_order,name",[projectId]),
    pool.query("SELECT * FROM project_blocks WHERE project_id=$1 ORDER BY sort_order,name",[projectId]),
    pool.query("SELECT * FROM project_floors WHERE project_id=$1 ORDER BY sort_order,floor_number NULLS LAST,name",[projectId]),
    pool.query(`SELECT u.*,z.name zone_name,b.name block_name,f.name floor_name FROM inventory_units u LEFT JOIN project_zones z ON z.id=u.zone_id LEFT JOIN project_blocks b ON b.id=u.block_id LEFT JOIN project_floors f ON f.id=u.floor_id WHERE u.project_id=$1 AND u.deleted_at IS NULL ORDER BY b.sort_order,f.sort_order,u.unit_code`,[projectId])
  ]);
  return NextResponse.json({projects:projects.rows,zones:zones.rows,blocks:blocks.rows,floors:floors.rows,units:units.rows});
}

export async function POST(req){
  const user=await requireAdmin(); if(!user) return NextResponse.json({error:"Không có quyền"},{status:403});
  await initDb(); const b=await req.json();
  try{
    if(b.kind==="zone"){
      const r=await pool.query("INSERT INTO project_zones(project_id,name,code,sort_order) VALUES($1,$2,$3,$4) RETURNING *",[b.project_id,b.name,clean(b.code),Number(b.sort_order||0)]); return NextResponse.json({item:r.rows[0]});
    }
    if(b.kind==="block"){
      const r=await pool.query("INSERT INTO project_blocks(project_id,zone_id,name,code,floor_count,sort_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",[b.project_id,clean(b.zone_id),b.name,clean(b.code),clean(b.floor_count),Number(b.sort_order||0)]); return NextResponse.json({item:r.rows[0]});
    }
    if(b.kind==="floor"){
      const r=await pool.query("INSERT INTO project_floors(project_id,block_id,name,floor_number,sort_order) VALUES($1,$2,$3,$4,$5) RETURNING *",[b.project_id,b.block_id,b.name,clean(b.floor_number),Number(b.sort_order||0)]); return NextResponse.json({item:r.rows[0]});
    }
    if(b.kind==="unit"){
      const vals=[b.project_id,clean(b.zone_id),clean(b.block_id),clean(b.floor_id),b.unit_code,b.unit_type||"Căn hộ",clean(b.bedrooms),clean(b.bathrooms),clean(b.area_net),clean(b.area_gross),clean(b.door_direction),clean(b.balcony_direction),clean(b.base_price),clean(b.sale_price),clean(b.discount_amount),b.currency||"VND",clean(b.legal_status),b.inventory_status||"AVAILABLE",b.visibility||"INTERNAL",clean(b.note),user.sub];
      const r=await pool.query(`INSERT INTO inventory_units(project_id,zone_id,block_id,floor_id,unit_code,unit_type,bedrooms,bathrooms,area_net,area_gross,door_direction,balcony_direction,base_price,sale_price,discount_amount,currency,legal_status,inventory_status,visibility,note,created_by,updated_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$21) RETURNING *`,vals);
      await pool.query("INSERT INTO inventory_audit_logs(unit_id,project_id,action,new_data,actor_id) VALUES($1,$2,'CREATE',$3,$4)",[r.rows[0].id,b.project_id,r.rows[0],user.sub]);
      return NextResponse.json({item:r.rows[0]});
    }
    return NextResponse.json({error:"Loại dữ liệu không hợp lệ"},{status:400});
  }catch(e){return NextResponse.json({error:e.code==="23505"?"Mã sản phẩm đã tồn tại trong dự án":"Không thể lưu dữ liệu bảng hàng"},{status:400})}
}
