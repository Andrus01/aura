import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Puudub ligipääs." }, { status: 401 });
  }

  let body: { id?: string; priceCents?: number; stock?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Vigane päring." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Toote ID puudub." }, { status: 422 });
  }

  const data: { priceCents?: number; stock?: number } = {};
  if (typeof body.priceCents === "number" && body.priceCents >= 0) {
    data.priceCents = Math.round(body.priceCents);
  }
  if (typeof body.stock === "number" && body.stock >= 0) {
    data.stock = Math.round(body.stock);
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Midagi muuta pole." }, { status: 422 });
  }

  const updated = await prisma.product.update({
    where: { id: body.id },
    data,
  });

  // Reflect changes on the public homepage (ISR)
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    product: { id: updated.id, priceCents: updated.priceCents, stock: updated.stock },
  });
}
