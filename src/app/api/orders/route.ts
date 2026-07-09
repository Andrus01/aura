import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { montonio, createPayment } from "@/lib/montonio";
import { shippingCentsFor } from "@/lib/shipping";

interface IncomingItem {
  slug: string;
  quantity: number;
}

interface OrderPayload {
  name: string;
  email: string;
  phone: string;
  deliveryMethod?: string; // courier | pickup | store
  comments?: string;
  items: IncomingItem[];
  // Montonio
  provider?: string; // selected bank code
  shippingCarrier?: string;
  pickupPointId?: string;
  pickupPointName?: string;
}

function reference() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MS-${stamp}-${rand}`;
}

function baseUrl(req: Request) {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    new URL(req.url).origin ||
    "http://localhost:3000"
  );
}

export async function POST(req: Request) {
  let payload: OrderPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Vigane päring." }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    deliveryMethod = "courier",
    comments,
    items,
    provider,
    shippingCarrier,
    pickupPointId,
    pickupPointName,
  } = payload;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Palun täida nimi, e-post ja telefon." },
      { status: 422 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Ostukorv on tühi." }, { status: 422 });
  }

  // Re-price on the server from the DB (never trust client prices)
  const dbProducts = await prisma.product.findMany({
    where: { slug: { in: items.map((i) => i.slug) } },
  });

  const orderItems = items
    .map((line) => {
      const p = dbProducts.find((d) => d.slug === line.slug);
      if (!p) return null;
      const quantity = Math.max(1, Math.floor(line.quantity || 1));
      return {
        productSlug: p.slug,
        productName: p.name,
        volume: p.volume,
        unitPriceCents: p.priceCents,
        quantity,
        productId: p.id,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "Tooteid ei leitud." }, { status: 422 });
  }

  const subtotalCents = orderItems.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );
  const shippingCents = shippingCentsFor(deliveryMethod);
  const grandTotalCents = subtotalCents + shippingCents;

  const useMontonio = montonio.isConfigured();
  const ref = reference();

  const order = await prisma.order.create({
    data: {
      reference: ref,
      customerName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      deliveryMethod,
      comments: comments?.trim() || null,
      subtotalCents,
      shippingCents,
      status: useMontonio ? "pending" : "demo",
      paymentStatus: useMontonio ? "PENDING" : "demo",
      paymentMethod: useMontonio ? "montonio" : "demo",
      paymentProvider: provider || null,
      shippingCarrier: shippingCarrier || null,
      shippingMethodType: deliveryMethod === "pickup" ? "pickupPoint" : deliveryMethod,
      pickupPointId: pickupPointId || null,
      pickupPointName: pickupPointName || null,
      items: { create: orderItems },
    },
  });

  // Demo mode — no payment provider configured
  if (!useMontonio) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      reference: order.reference,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      grandTotalCents,
    });
  }

  // Montonio — create a payment and hand back the redirect URL
  try {
    const origin = baseUrl(req);
    const lineItems = orderItems.map((i) => ({
      name: `${i.productName} ${i.volume}`,
      quantity: i.quantity,
      finalPrice: i.unitPriceCents / 100,
    }));
    if (shippingCents > 0) {
      lineItems.push({
        name: "Pakiautomaadi tarne",
        quantity: 1,
        finalPrice: shippingCents / 100,
      });
    }

    const { paymentUrl, uuid } = await createPayment({
      merchantReference: order.reference,
      grandTotal: grandTotalCents / 100,
      currency: order.currency,
      locale: "et",
      provider,
      returnUrl: `${origin}/checkout/return`,
      notificationUrl:
        process.env.MONTONIO_NOTIFICATION_URL || `${origin}/api/montonio/webhook`,
      lineItems,
      customer: {
        name: order.customerName,
        email: order.email,
        phone: order.phone,
      },
    });

    if (uuid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { montonioUuid: uuid },
      });
    }

    return NextResponse.json({
      ok: true,
      mode: "montonio",
      reference: order.reference,
      redirectUrl: paymentUrl,
    });
  } catch (err) {
    // Roll back to a failed state but keep the order for admin visibility
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "payment_failed", paymentStatus: "ABANDONED" },
    });
    console.error("Montonio payment error:", err);
    return NextResponse.json(
      { error: "Makse algatamine ebaõnnestus. Proovi uuesti." },
      { status: 502 }
    );
  }
}
