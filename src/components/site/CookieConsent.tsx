"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "aura-cookie-consent";

export default function CookieConsent({ dict }: { dict: Dictionary }) {
  const t = dict.cookie;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if the visitor hasn't accepted yet
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable — stay hidden */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6"
          role="dialog"
          aria-label="Küpsiste teade"
        >
          <div className="glass container-luxe flex flex-col items-start gap-4 rounded-2xl px-6 py-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-sans text-[0.82rem] leading-relaxed text-cream/75">
              {t.text}{" "}
              <Link href="/privaatsus" className="text-gold underline underline-offset-2">
                {t.more}
              </Link>
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={accept} className="btn-gold px-7 py-3">
                {t.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
