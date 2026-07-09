import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/montonio";

/**
 * Montonio order webhook. Body: { orderToken: <JWT> }.
 * We verify the signature, then update the matching order's payment status.
 * Payment status is matched case-insensitively (PAID/PENDING/ABANDONED).
 */
export async function POST(req: Request) {
  let body: { orderToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!body.orderToken) {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }

  let decoded: {
    merchantReference?: string;
    paymentStatus?: string;
    uuid?: string;
  };
  try {
    decoded = verifyToken(body.orderToken);
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const ref = decoded.merchantReference;
  if (!ref) return NextResponse.json({ error: "no reference" }, { status: 422 });

  const paymentStatus = (decoded.paymentStatus || "PENDING").toUpperCase();
  const paid = paymentStatus === "PAID";

  await prisma.order.updateMany({
    where: { reference: ref },
    data: {
      paymentStatus,
      status: paid ? "paid" : paymentStatus === "ABANDONED" ? "abandoned" : "pending",
      ...(decoded.uuid ? { montonioUuid: decoded.uuid } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
