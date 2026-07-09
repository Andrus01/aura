/**
 * Aura & Ood — database seed.
 * Everything an admin needs to edit lives here: prices, stock, copy, images, notes.
 * Prices are in euro CENTS (12900 = €129.00) for precision.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "morning-spirit-100ml",
    name: "Morning Spirit",
    subtitle: "Eau de Parfum",
    concentration: "Eau de Parfum",
    volume: "100 ml",
    priceCents: 12900, // €129.00 — edit freely
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
      { url: "/optimized/bottle-studio.webp", alt: "Morning Spirit merevaigust pudel valgel taustal", isPrimary: true, order: 0 },
      { url: "/optimized/package-studio.webp", alt: "Morning Spirit must-kuldne pakend valgel taustal", isPrimary: false, order: 1 },
      { url: "/optimized/bottle-silk.webp", alt: "Morning Spirit pudel kreemja siidi peal", isPrimary: false, order: 2 },
      { url: "/optimized/package-float.webp", alt: "Morning Spirit must-kuldne pakend hõljumas", isPrimary: false, order: 3 },
      { url: "/optimized/bottle-blue.webp", alt: "Morning Spirit pudel jahedal hommikusinisel taustal", isPrimary: false, order: 4 },
    ],
    notes: {
      top: ["Sitsiilia sidrun", "Bergamott", "Roheline õun", "Musta pipra sähvatus"],
      heart: ["Valge tee lehed", "Kadakamarjad", "Virsikuõis"],
      base: ["Valge muskus", "Merevaik", "Sandlipuu"],
    },
  },
];

async function main() {
  console.log("Seeding Aura & Ood…");

  // Clean slate (safe for a demo DB)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.note.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    const { images, notes, ...data } = p;
    const noteRows = [
      ...notes.top.map((name, i) => ({ tier: "top", name, order: i })),
      ...notes.heart.map((name, i) => ({ tier: "heart", name, order: i })),
      ...notes.base.map((name, i) => ({ tier: "base", name, order: i })),
    ];

    const created = await prisma.product.create({
      data: {
        ...data,
        images: { create: images },
        notes: { create: noteRows },
      },
    });
    console.log(`  ✓ ${created.name} (${created.volume}) — €${(created.priceCents / 100).toFixed(2)}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
