"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { content } from "@/lib/content";
import { cx } from "@/lib/format";

/** Single hero product with an image gallery (bottle ⇄ packaging) + buy box. */
export default function FeatureProduct({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const images = product.images.length
    ? product.images
    : [{ url: "", alt: product.name, isPrimary: true, order: 0 }];
  const current = images[active] ?? images[0];

  const onAdd = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        volume: product.volume,
        priceCents: product.priceCents,
        image: (images.find((i) => i.isPrimary) ?? images[0]).url,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="grid items-center gap-10 rounded-3xl border border-cream/10 bg-ink-soft p-6 md:grid-cols-2 md:gap-14 md:p-10">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-800">
          <motion.div
            key={current.url}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
          {product.badge && (
            <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 font-sans text-[0.6rem] uppercase tracking-luxe text-gold backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActive(i)}
                aria-label={img.alt}
                className={cx(
                  "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border transition-colors",
                  i === active ? "border-gold" : "border-cream/15 hover:border-cream/40"
                )}
              >
                <Image src={img.url} alt={img.alt} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy box */}
      <div>
        <p className="font-sans text-[0.66rem] uppercase tracking-luxe text-gold/80">
          {product.subtitle} · {product.volume}
        </p>
        <h3 className="display mt-3 text-[clamp(2.2rem,5vw,3.6rem)] text-cream">
          {product.name}
        </h3>
        <p className="mt-5 max-w-md font-sans text-[0.98rem] leading-relaxed text-cream/65">
          {product.longDesc}
        </p>

        {/* Notes summary */}
        <div className="mt-7 flex flex-wrap gap-2">
          {["Sitrus", "Valge tee", "Muskus"].map((n) => (
            <span
              key={n}
              className="glass rounded-full px-3.5 py-1.5 font-sans text-[0.64rem] uppercase tracking-luxe text-cream/80"
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-9 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[0.6rem] uppercase tracking-luxe text-cream/40">Hind</p>
            <p className="font-serif text-4xl text-gold">{formatPrice(product.priceCents)}</p>
          </div>
          <div className="flex items-center gap-4 rounded-full border border-cream/20 px-4 py-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-cream/70 transition-colors hover:text-gold"
              aria-label="Vähem"
            >
              −
            </button>
            <span className="min-w-5 text-center text-sm text-cream">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="text-cream/70 transition-colors hover:text-gold"
              aria-label="Rohkem"
            >
              +
            </button>
          </div>
        </div>

        <button onClick={onAdd} className="btn-gold mt-6 w-full overflow-hidden">
          <motion.span
            key={justAdded ? "added" : "add"}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {justAdded ? content.shop.added : content.shop.add}
          </motion.span>
        </button>
      </div>
    </div>
  );
}
