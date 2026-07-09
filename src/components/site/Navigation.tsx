"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { Logo } from "@/components/site/Logo";
import { useHydrated } from "@/lib/hooks";
import { content } from "@/lib/content";
import { cx } from "@/lib/format";

const links = [
  { href: "#lugu", label: content.nav.story },
  { href: "#puramiid", label: content.nav.pyramid },
  { href: "#toode", label: content.nav.product },
  { href: "#pood", label: content.nav.shop },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggle, count } = useCart();
  const hydrated = useHydrated();
  const itemCount = hydrated ? count() : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe",
        scrolled ? "bg-ink/80 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      )}
    >
      <nav className="container-luxe flex items-center justify-between">
        <button
          onClick={() => go("#top")}
          className="group flex items-center gap-3 text-left"
          aria-label="Aura & Ood"
        >
          <Logo className="h-8 w-auto text-gold transition-opacity group-hover:opacity-80" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-sans text-[0.62rem] uppercase tracking-luxe text-cream/90">
              Aura &amp; Ood
            </span>
            <span className="font-sans text-[0.55rem] uppercase tracking-wideluxe text-gold/70">
              Morning Spirit
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="link-underline font-sans text-[0.68rem] uppercase tracking-luxe text-cream/80 transition-colors hover:text-gold"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="group relative flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-cream transition-colors hover:border-gold hover:text-gold"
            aria-label={content.nav.cart}
          >
            <span className="font-sans text-[0.64rem] uppercase tracking-luxe">
              {content.nav.cart}
            </span>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.62rem] font-semibold text-ink"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menüü"
          >
            <span className={cx("h-px w-6 bg-cream transition-all", menuOpen && "translate-y-[3.5px] rotate-45")} />
            <span className={cx("h-px w-6 bg-cream transition-all", menuOpen && "-translate-y-[3.5px] -rotate-45")} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="container-luxe flex flex-col gap-1 py-5">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="border-b border-cream/10 py-3 text-left font-serif text-2xl text-cream/90"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
