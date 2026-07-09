"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart } from "@/store/cart";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { Magnetic } from "@/components/motion/Magnetic";
import { AmbientDust } from "@/components/motion/AmbientDust";

export default function FinalCta({ dict }: { dict: Dictionary }) {
  const content = { finalCta: dict.finalCta };
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const open = useCart((s) => s.open);

  return (
    <section
      ref={ref}
      className="grain relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <Image
          src="/optimized/hero-forest-dawn.webp"
          alt="Morning Spirit pudel koidiku mere ja mägede taustal"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_240px_80px_rgba(0,0,0,0.75)]" />
      <AmbientDust className="z-[5]" />

      <div className="container-luxe relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow"
        >
          {content.finalCta.eyebrow}
        </motion.span>
        <SplitTitle
          as="h2"
          text={content.finalCta.title}
          delay={0.1}
          className="display text-glow mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] text-cream"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-lg font-sans text-[1rem] leading-relaxed text-cream/75"
        >
          {content.finalCta.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <Magnetic>
            <button onClick={open} className="btn-gold px-12 py-5">
              {content.finalCta.cta}
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
