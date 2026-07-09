"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { introWillPlay, INTRO_DURATION } from "@/lib/intro";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * First-visit ink curtain: wordmark + gold line, then the curtain lifts
 * to reveal the hero. Plays once per browser session.
 */
export default function IntroLoader() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    if (!introWillPlay()) {
      setShow(false);
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), INTRO_DURATION * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
          className="fixed inset-0 z-[99] flex items-center justify-center bg-ink"
        >
          <div className="flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="font-serif text-[clamp(2rem,6vw,3.6rem)] font-light tracking-[0.04em] text-cream"
            >
              Aura <span className="italic text-gold">&</span> Ood
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: INTRO_DURATION - 0.25, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
              className="mt-6 h-px w-40 origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-5 font-sans text-[0.6rem] uppercase tracking-wideluxe text-cream/40"
            >
              Morning Spirit
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
