"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Gold trailing cursor ring (native cursor stays visible). Grows over
 * interactive elements. Only mounts on precise-pointer devices.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 260, damping: 24, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 24, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setActive(!!t?.closest?.("a, button, [role='button'], input, select, textarea, label"));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
    >
      <motion.span
        animate={{
          scale: active ? 2.1 : 1,
          opacity: visible ? (active ? 0.9 : 0.55) : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70"
      />
    </motion.div>
  );
}
