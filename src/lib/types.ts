export type NoteTier = "top" | "heart" | "base";

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductNote {
  tier: NoteTier;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  volume: string;
  priceCents: number;
  currency: string;
  stock: number;
  shortDesc: string;
  longDesc: string;
  concentration: string;
  badge: string | null;
  featured: boolean;
  order: number;
  images: ProductImage[];
  notes: ProductNote[];
}

export interface CartLine {
  slug: string;
  name: string;
  volume: string;
  priceCents: number;
  image: string;
  quantity: number;
}
