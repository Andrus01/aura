import { cookies } from "next/headers";

export const ADMIN_COOKIE = "aura_admin";

/** The configured admin password (edit in .env — ADMIN_PASSWORD). */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "aura-admin";
}

/**
 * Lightweight session check for the demo admin.
 * The cookie stores the password value and is compared server-side.
 * NOTE: fine for a local/demo admin — replace with real auth (hashed
 * credentials + sessions) before exposing publicly.
 */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return !!token && token === adminPassword();
}
