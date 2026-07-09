"use client";

import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { SplitTitle } from "@/components/motion/SplitTitle";
import { motion } from "framer-motion";
import { cx } from "@/lib/format";

const tierImages: Record<string, string> = {
  top: "/optimized/snow-sunrise.webp",
  heart: "/optimized/forest-green.webp",
  base: "/optimized/bottle-silk.webp",
};

// Client wrapper needed because we use framer-motion variants for the note chips
function Notes({ notes }: { notes: readonly string[] }) {
  return (
    <RevealGroup className="mt-8 flex flex-wrap gap-2.5" stagger={0.08}>
      {notes.map((n) => (
        <motion.span
          key={n}
          variants={revealItem}
          className="glass rounded-full px-4 py-2 font-sans text-[0.72rem] uppercase tracking-luxe text-cream/85"
        >
          {n}
        </motion.span>
      ))}
    </RevealGroup>
  );
}

export default function PyramidSection({ dict }: { dict: Dictionary }) {
  return (
    <section id="puramiid" className="relative bg-ink py-28 md:py-40">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">{dict.pyramid.eyebrow}</span>
          </Reveal>
          <SplitTitle
            text={dict.pyramid.title}
            delay={0.1}
            className="display mt-6 text-[clamp(2.2rem,6vw,4.4rem)] text-cream"
          />
          <Reveal delay={2}>
            <p className="mx-auto mt-6 max-w-lg font-sans text-[1rem] leading-relaxed text-cream/60">
              {dict.pyramid.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-24 space-y-24 md:space-y-40">
          {dict.pyramid.tiers.map((tier, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={tier.id}
                className={cx(
                  "grid items-center gap-10 md:grid-cols-2 md:gap-16",
                  flip && "md:[&>*:first-child]:order-2"
                )}
              >
                {/* Image */}
                <Parallax
                  offset={60}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                >
                  <ImageReveal className="relative h-[118%]">
                    <Image
                      src={tierImages[tier.id]}
                      alt={`${tier.stage} — ${tier.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    <span className="absolute left-6 top-6 font-serif text-7xl italic text-cream/25">
                      0{i + 1}
                    </span>
                  </ImageReveal>
                </Parallax>

                {/* Copy */}
                <div className={cx(flip && "md:pr-6", !flip && "md:pl-6")}>
                  <Reveal>
                    <span className="font-sans text-[0.68rem] uppercase tracking-luxe text-gold/80">
                      {tier.stage} · {tier.minutes}
                    </span>
                  </Reveal>
                  <Reveal delay={1}>
                    <h3 className="display mt-4 text-[clamp(2rem,5vw,3.4rem)] text-cream">
                      {tier.name}
                    </h3>
                  </Reveal>
                  <Reveal delay={2}>
                    <p className="mt-6 max-w-md font-sans text-[0.98rem] leading-relaxed text-cream/65">
                      {tier.poem}
                    </p>
                  </Reveal>
                  <Notes notes={tier.notes} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
