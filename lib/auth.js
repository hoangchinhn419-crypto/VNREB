import {SignJWT,jwtVerify} from "jose";
const secret=new TextEncoder().encode(process.env.JWT_SECRET||"change-me");
export const createToken=u=>new SignJWT({sub:u.id,email:u.email,fullName:u.full_name||u.fullName,role:u.role}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret);
export async function verifyToken(t){try{return (await jwtVerify(t,secret)).payload}catch{return null}}
