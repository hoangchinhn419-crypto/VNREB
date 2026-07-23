import {NextResponse} from "next/server";export async function POST(){const r=NextResponse.json({ok:true});r.cookies.set("vnreb_session","",{path:"/",maxAge:0,httpOnly:true});return r}
