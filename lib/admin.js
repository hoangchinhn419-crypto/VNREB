import { cookies } from "next/headers";
import { verifyToken } from "./auth";
export async function requireAdmin() {
  const c = await cookies();
  const user = await verifyToken(c.get("vnreb_session")?.value || "");
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) return null;
  return user;
}
