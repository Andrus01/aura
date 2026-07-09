"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Chapter = Dictionary["story"]["chapters"][number];

function Chapter({
  ch,
  progress,
  index,
  total,
}: {
  ch: Chapter;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Each chapter owns a window of scroll progress and fades in/out within it.
  const seg = 1 / total;
  const start = index * seg;
  const inPoint = start + seg * 0.12;
  const outPoint = start + seg * 0.88;
  const end = start + seg;

  const opacity = useTransform(
    progress,
    [start, inPoint, outPoint, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, inPoint, end], [60, 0, -60]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center will-change-transform"
    >
      <div className="container-luxe">
        <div className="max-w-2xl story-chapter">
          <span className="eyebrow">{ch.kicker}</span>
          <h3 className="display mt-6 text-[clamp(2.2rem,6vw,4.6rem)] text-cream">
            {ch.title}
          </h3>
          <p className="mt-7 max-w-xl font-sans text-[1.02rem] leading-relaxed text-cream/70">
            {ch.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Tick({
  progress,
  index,
  total,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const seg = 1 / total;
  const opacity = useTransform(
    progress,
    [index * seg, index * seg + seg * 0.5, (index + 1) * seg],
    [0.25, 1, 0.25]
  );
  return <motion.span style={{ opacity }} className="h-px w-10 bg-gold" />;
}

export default function StorySection({ dict }: { dict: Dictionary }) {
  const chapters = dict.story.chapters;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Cool dawn blue -> warm sunrise amber
  const blueOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.35, 0]);
  const amberOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.4, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0.28, 0.28, 0.1]);

  return (
    <section ref={ref} id="lugu" className="relative h-[320vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-ink" />
        {/* Cool dawn-blue wash */}
        <motion.div
          style={{ opacity: blueOpacity }}
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_20%_0%,#2C4257_0%,#12222f_45%,#0B0A09_100%)]"
        />
        {/* Warm amber wash */}
        <motion.div
          style={{ opacity: amberOpacity }}
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_10%,#E08A3C_0%,#8A4520_40%,#0B0A09_100%)]"
        />
        {/* Ambient morning-light video */}
        <motion.video
          style={{ opacity: videoOpacity }}
          className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-ambient-poster.jpg"
        >
          <source src="/video/hero-ambient.webm" type="video/webm" />
          <source src="/video/hero-ambient.mp4" type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />

        {/* Section label */}
        <div className="container-luxe absolute left-0 right-0 top-24 z-10">
          <p className="eyebrow text-center">
            {dict.story.eyebrow}
          </p>
        </div>

        {/* Progress ticks */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {chapters.map((_, i) => (
            <Tick key={i} progress={scrollYProgress} index={i} total={chapters.length} />
          ))}
        </div>

        {chapters.map((ch, i) => (
          <Chapter key={i} ch={ch} progress={scrollYProgress} index={i} total={chapters.length} />
        ))}
      </div>
    </section>
  );
}
