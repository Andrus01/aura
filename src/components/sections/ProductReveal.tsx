"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { SplitTitle } from "@/components/motion/SplitTitle";

export default function ProductReveal({ dict }: { dict: Dictionary }) {
  const t = dict.reveal;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.15, 0.9]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="toode" ref={ref} className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* Amber glow */}
      <motion.div
        style={{ scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,138,60,0.22)_0%,transparent_60%)] blur-2xl"
      />

      <div className="container-luxe relative grid items-center gap-14 md:grid-cols-2 md:gap-20">
        {/* Rotating bottle video */}
        <motion.div style={{ y: mediaY }} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-full border border-gold/20">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/video/bottle-rotate-poster.jpg"
            >
              <source src="/video/bottle-rotate.webm" type="video/webm" />
              <source src="/video/bottle-rotate.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 rounded-full [box-shadow:inset_0_0_80px_20px_rgba(11,10,9,0.7)]" />
          </div>
        </motion.div>

        {/* Copy + callouts */}
        <div>
          <Reveal>
            <span className="eyebrow">{t.eyebrow}</span>
          </Reveal>
          <SplitTitle
            text={t.title}
            delay={0.1}
            className="display mt-6 text-[clamp(2rem,5vw,3.8rem)] text-cream"
          />
          <Reveal delay={2}>
            <p className="mt-6 max-w-md font-sans text-[1rem] leading-relaxed text-cream/65">
              {t.body}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-cream/10 bg-cream/10">
            {t.callouts.map((c) => (
              <Reveal key={c.label} className="bg-ink-soft p-6">
                <p className="font-sans text-[0.62rem] uppercase tracking-luxe text-gold/70">
                  {c.label}
                </p>
                <p className="mt-2 font-serif text-xl text-cream">{c.value}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Detail strip */}
      <div className="container-luxe relative mt-24 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { src: "/optimized/bottle-studio.webp", alt: "Merevaigust pudel" },
          { src: "/optimized/bottle-blue.webp", alt: "Pudel sinisel taustal" },
          { src: "/optimized/package-spotlight.webp", alt: "Must-kuldne pakend" },
          { src: "/optimized/dawn-sea.webp", alt: "Koidiku meri" },
        ].map((img, i) => (
          <ImageReveal key={img.src} delay={i} className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-luxe hover:scale-105"
            />
          </ImageReveal>
        ))}
      </div>
    </section>
  );
}
