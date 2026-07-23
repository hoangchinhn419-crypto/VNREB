import {NextResponse} from "next/server";import {cookies} from "next/headers";import {verifyToken} from "../../../../lib/auth";
export async function GET(){const c=await cookies(),t=c.get("vnreb_session")?.value;return NextResponse.json({user:t?await verifyToken(t):null})}
