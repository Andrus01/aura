"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/format";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { Magnetic } from "@/components/motion/Magnetic";
import { AmbientDust } from "@/components/motion/AmbientDust";
import { introWillPlay, INTRO_DURATION } from "@/lib/intro";

export default function Hero({ product, dict }: { product: Product | null; dict: Dictionary }) {
  const t = dict.hero;
  // Hold the entrance until the intro curtain has lifted (first visit only)
  const base = introWillPlay() ? INTRO_DURATION - 0.4 : 0;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const add = useCart((s) => s.add);
  const primary = product?.images.find((i) => i.isPrimary) ?? product?.images[0];

  const addHero = () => {
    if (!product || !primary) return;
    add({
      slug: product.slug,
      name: product.name,
      volume: product.volume,
      priceCents: product.priceCents,
      image: primary.url,
    });
  };

  const scrollDown = () => {
    const el = document.querySelector("#lugu");
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
    if (el && lenis) lenis.scrollTo(el);
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 will-change-transform">
        <Image
          src="/optimized/hero-forest-dawn.webp"
          alt="Morning Spirit merevaigust pudel koidiku mere ja mägede taustal"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Cinematic gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_60px_rgba(0,0,0,0.7)]" />

      {/* Rising gold light dust */}
      <AmbientDust className="z-[5]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-luxe relative z-10 flex h-full flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: base + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6"
        >
          {t.eyebrow}
        </motion.p>

        <SplitTitle
          as="h1"
          text="Morning Spirit"
          mode="chars"
          mount
          delay={base + 0.35}
          duration={1.2}
          className="display text-glow text-[clamp(3.4rem,13vw,11rem)] text-cream"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: base + 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 font-serif text-[clamp(1.4rem,4vw,2.6rem)] italic text-gold-light"
        >
          Koidiku Kaja
          <span className="ml-3 align-middle text-sm not-italic tracking-luxe text-cream/50">
            / {t.subtitleTag}
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: base + 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl font-sans text-[0.98rem] leading-relaxed text-cream/75"
        >
          {t.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: base + 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <button onClick={scrollDown} className="btn-gold">
              {t.ctaPrimary}
            </button>
          </Magnetic>
          <Magnetic>
            <button onClick={addHero} className="btn-ghost">
              {t.ctaSecondary}
              {product && (
                <span className="ml-2 text-gold">· {formatPrice(product.priceCents)}</span>
              )}
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label={t.scrollCue}
      >
        <span className="font-sans text-[0.6rem] uppercase tracking-wideluxe text-cream/50">
          {t.scrollCue}
        </span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-cream/30">
          <span className="mt-2 h-2 w-px animate-scroll-cue bg-gold" />
        </span>
      </button>
    </section>
  );
}
