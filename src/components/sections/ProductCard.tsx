"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function ProductCard({ product, dict }: { product: Product; dict: Dictionary }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const hover = product.images[1] ?? primary;

  const onAdd = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        volume: product.volume,
        priceCents: product.priceCents,
        image: primary?.url ?? "",
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-ink-soft transition-colors duration-500 hover:border-gold/30">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
        {primary && (
          <Image
            src={primary.url}
            alt={primary.alt}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-opacity duration-700 ease-luxe group-hover:opacity-0"
          />
        )}
        {hover && (
          <Image
            src={hover.url}
            alt={hover.alt}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-sans text-[0.6rem] uppercase tracking-luxe text-gold backdrop-blur">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-3xl leading-tight text-cream">{product.name}</h3>
            <p className="mt-1 font-sans text-[0.66rem] uppercase tracking-luxe text-cream/45">
              {product.subtitle} · {product.volume}
            </p>
          </div>
          <p className="whitespace-nowrap font-serif text-2xl text-gold">
            {formatPrice(product.priceCents)}
          </p>
        </div>

        <p className="mt-4 font-sans text-[0.92rem] leading-relaxed text-cream/60">
          {product.shortDesc}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
          <div className="flex items-center gap-4 rounded-full border border-cream/20 px-4 py-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-cream/70 transition-colors hover:text-gold"
              aria-label={dict.cart.less}
            >
              −
            </button>
            <span className="min-w-5 text-center text-sm text-cream">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="text-cream/70 transition-colors hover:text-gold"
              aria-label={dict.cart.more}
            >
              +
            </button>
          </div>

          <button onClick={onAdd} className="btn-gold flex-1 overflow-hidden">
            <motion.span
              key={justAdded ? "added" : "add"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {justAdded ? dict.shop.added : dict.shop.add}
            </motion.span>
          </button>
        </div>
      </div>
    </div>
  );
}
