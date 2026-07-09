import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { montonio, createShipment } from "@/lib/montonio";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Puudub ligipääs." }, { status: 401 });
  }
  if (!montonio.isConfigured()) {
    return NextResponse.json({ error: "Montonio pole seadistatud." }, { status: 400 });
  }

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Vigane päring." }, { status: 400 });
  }
  if (!body.orderId) {
    return NextResponse.json({ error: "orderId puudub." }, { status: 422 });
  }

  const order = await prisma.order.findUnique({ where: { id: body.orderId } });
  if (!order) return NextResponse.json({ error: "Tellimust ei leitud." }, { status: 404 });
  if (!order.shippingCarrier || !order.pickupPointId) {
    return NextResponse.json(
      { error: "Tellimusel puudub vedaja/pakiautomaat." },
      { status: 422 }
    );
  }

  const result = await createShipment({
    merchantReference: order.reference,
    carrierCode: order.shippingCarrier,
    pickupPointId: order.pickupPointId,
    receiver: { name: order.customerName, email: order.email, phone: order.phone },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { shipmentStatus: result.ok ? "registered" : "failed" },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Ebaõnnestus." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: result.id });
}
