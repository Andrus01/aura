import type { Product } from "./types";

/** Read-only catalog used when SQLite is unavailable (e.g. Netlify serverless). */
export const staticProducts: Product[] = [
  {
    id: "prod_morning_spirit_100ml",
    slug: "morning-spirit-100ml",
    name: "Morning Spirit",
    subtitle: "Eau de Parfum",
    concentration: "Eau de Parfum",
    volume: "100 ml",
    priceCents: 12900,
    currency: "EUR",
    stock: 84,
    badge: "Signatuur",
    featured: true,
    order: 0,
    shortDesc:
      "Sitrusest ärkav, valge tee kaudu süvenev ja muskuse peal hommikuks jääv unisex-parfüüm. 100 ml täismõõt.",
    longDesc:
      "Morning Spirit tabab selle lühikese hetke enne päeva ärkamist — kui õhk on veel jahe ja valgus alles sünnib. Sitsiilia sidruni teravus avab lõhna nagu esimene päikesekiir läbi kaste; valge tee ja kadakas hoiavad seda põhjamaiselt puhtana; valge muskus ja merevaik jätavad nahale sooja, väärika kaja terveks päevaks.",
    images: [
      {
        url: "/optimized/bottle-studio.webp",
        alt: "Morning Spirit merevaigust pudel valgel taustal",
        isPrimary: true,
        order: 0,
      },
      {
        url: "/optimized/package-studio.webp",
        alt: "Morning Spirit must-kuldne pakend valgel taustal",
        isPrimary: false,
        order: 1,
      },
      {
        url: "/optimized/bottle-silk.webp",
        alt: "Morning Spirit pudel kreemja siidi peal",
        isPrimary: false,
        order: 2,
      },
      {
        url: "/optimized/package-float.webp",
        alt: "Morning Spirit must-kuldne pakend hõljumas",
        isPrimary: false,
        order: 3,
      },
      {
        url: "/optimized/bottle-blue.webp",
        alt: "Morning Spirit pudel jahedal hommikusinisel taustal",
        isPrimary: false,
        order: 4,
      },
    ],
    notes: [
      { tier: "top", name: "Sitsiilia sidrun", order: 0 },
      { tier: "top", name: "Bergamott", order: 1 },
      { tier: "top", name: "Roheline õun", order: 2 },
      { tier: "top", name: "Musta pipra sähvatus", order: 3 },
      { tier: "heart", name: "Valge tee lehed", order: 0 },
      { tier: "heart", name: "Kadakamarjad", order: 1 },
      { tier: "heart", name: "Virsikuõis", order: 2 },
      { tier: "base", name: "Valge muskus", order: 0 },
      { tier: "base", name: "Merevaik", order: 1 },
      { tier: "base", name: "Sandlipuu", order: 2 },
    ],
  },
];
