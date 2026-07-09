"use client";

import { motion } from "framer-motion";
import { cx } from "@/lib/format";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplitTitleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** "words" (default) — each word rises from a mask. "chars" — each letter. */
  mode?: "words" | "chars";
  /** Seconds before the first unit starts. */
  delay?: number;
  /** Animate on mount instead of on scroll into view. */
  mount?: boolean;
  duration?: number;
  stagger?: number;
}

/**
 * Masked typographic reveal: every word/letter rises out of its own
 * overflow-hidden clip, staggered — the signature "expensive site" title.
 */
export function SplitTitle({
  text,
  className,
  as: Tag = "h2",
  mode = "words",
  delay = 0,
  mount = false,
  duration = 1.1,
  stagger,
}: SplitTitleProps) {
  const words = text.split(" ").filter(Boolean);
  const step = stagger ?? (mode === "chars" ? 0.045 : 0.08);

  let unit = 0;
  const trigger = mount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.5 } };
  const MotionTag = motion[Tag];

  return (
    <MotionTag initial="hidden" {...trigger} className={className}>
        {words.map((word, wi) => (
          <span key={wi} className={cx("inline-block whitespace-nowrap", wi < words.length - 1 && "mr-[0.28em]")}>
            {(mode === "chars" ? word.split("") : [word]).map((piece, pi) => {
              const i = unit++;
              return (
                <span key={pi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "115%", rotate: mode === "chars" ? 6 : 2 },
                      show: {
                        y: "0%",
                        rotate: 0,
                        transition: { duration, ease: EASE, delay: delay + i * step },
                      },
                    }}
                  >
                    {piece}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
    </MotionTag>
  );
}
