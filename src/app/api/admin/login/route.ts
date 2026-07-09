import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPassword } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Vigane päring." }, { status: 400 });
  }

  if (!body.password || body.password !== adminPassword()) {
    return NextResponse.json({ error: "Vale parool." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
