"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { content } from "@/lib/content";

export default function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, subtotalCents } = useCart();

  // Lock scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = subtotalCents();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ink-soft shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={content.cart.title}
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-serif text-2xl text-cream">{content.cart.title}</h2>
              <button
                onClick={close}
                className="text-cream/60 transition-colors hover:text-gold"
                aria-label="Sulge"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="font-serif text-2xl text-cream/70">{content.cart.empty}</p>
                <button onClick={close} className="btn-ghost">
                  {content.cart.emptyCta}
                </button>
              </div>
            ) : (
              <>
                <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  {lines.map((l) => (
                    <div key={l.slug} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                        <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-serif text-lg leading-tight text-cream">{l.name}</p>
                            <p className="text-[0.7rem] uppercase tracking-luxe text-cream/50">
                              {l.volume}
                            </p>
                          </div>
                          <p className="whitespace-nowrap font-sans text-sm text-gold">
                            {formatPrice(l.priceCents * l.quantity)}
                          </p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center gap-3 rounded-full border border-cream/20 px-3 py-1">
                            <button
                              onClick={() => setQty(l.slug, l.quantity - 1)}
                              className="text-cream/70 hover:text-gold"
                              aria-label="Vähem"
                            >
                              −
                            </button>
                            <span className="min-w-4 text-center text-sm text-cream">{l.quantity}</span>
                            <button
                              onClick={() => setQty(l.slug, l.quantity + 1)}
                              className="text-cream/70 hover:text-gold"
                              aria-label="Rohkem"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(l.slug)}
                            className="text-[0.66rem] uppercase tracking-luxe text-cream/40 hover:text-amber-glow"
                          >
                            {content.cart.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream/10 px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[0.72rem] uppercase tracking-luxe text-cream/60">
                      {content.cart.subtotal}
                    </span>
                    <span className="font-serif text-2xl text-cream">{formatPrice(subtotal)}</span>
                  </div>
                  <Link href="/checkout" onClick={close} className="btn-gold w-full">
                    {content.cart.checkout}
                  </Link>
                  <p className="mt-3 text-center text-[0.64rem] uppercase tracking-luxe text-cream/40">
                    {content.cart.note}
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
