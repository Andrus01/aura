import { prisma } from "./db";

export interface AdminOrder {
  id: string;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  comments: string | null;
  subtotalCents: number;
  shippingCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentProvider: string | null;
  montonioUuid: string | null;
  shippingCarrier: string | null;
  shippingMethodType: string | null;
  pickupPointId: string | null;
  pickupPointName: string | null;
  shipmentStatus: string | null;
  createdAt: Date;
  items: {
    id: string;
    productName: string;
    volume: string;
    unitPriceCents: number;
    quantity: number;
  }[];
}

export async function getOrders(): Promise<AdminOrder[]> {
  try {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { orderBy: { productName: "asc" } } },
    });
    return rows as unknown as AdminOrder[];
  } catch (error) {
    console.error("Order DB unavailable:", error);
    return [];
  }
}
