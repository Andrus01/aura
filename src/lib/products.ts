import { prisma } from "./db";
import { staticProducts } from "./products.static";
import type { Product } from "./types";

/** Fetch all products (with images + notes) ordered for display. */
export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { order: "asc" },
      include: {
        images: { orderBy: { order: "asc" } },
        notes: { orderBy: { order: "asc" } },
      },
    });
    if (rows.length > 0) {
      return rows as unknown as Product[];
    }
  } catch (error) {
    console.error("Product DB unavailable, using static catalog:", error);
  }

  return staticProducts;
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const rows = await getProducts();
  return rows.find((p) => p.featured) ?? rows[0] ?? null;
}
