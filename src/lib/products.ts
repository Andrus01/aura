import { prisma } from "./db";
import type { Product } from "./types";

/** Fetch all products (with images + notes) ordered for display. */
export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: { order: "asc" },
    include: {
      images: { orderBy: { order: "asc" } },
      notes: { orderBy: { order: "asc" } },
    },
  });
  return rows as unknown as Product[];
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const rows = await getProducts();
  return rows.find((p) => p.featured) ?? rows[0] ?? null;
}
