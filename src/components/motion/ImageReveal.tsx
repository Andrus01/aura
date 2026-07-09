"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Clip-mask image reveal: the frame wipes open from the bottom while the
 * image inside settles from a slight zoom. Wrap around next/image (fill).
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  duration = 1.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="relative h-full w-full will-change-transform"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          show: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration, ease: EASE, delay: delay * 0.12 },
          },
        }}
      >
        <motion.div
          className="relative h-full w-full will-change-transform"
          variants={{
            hidden: { scale: 1.18 },
            show: { scale: 1, transition: { duration: duration + 0.3, ease: EASE, delay: delay * 0.12 } },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
