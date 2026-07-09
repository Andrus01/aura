"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: () => number;
  subtotalCents: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (line, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === line.slug);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.slug === line.slug ? { ...l, quantity: l.quantity + qty } : l
              ),
            };
          }
          return { isOpen: true, lines: [...state.lines, { ...line, quantity: qty }] };
        }),
      remove: (slug) =>
        set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.slug === slug ? { ...l, quantity: Math.max(0, qty) } : l))
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotalCents: () => get().lines.reduce((n, l) => n + l.priceCents * l.quantity, 0),
    }),
    {
      name: "aura-ood-cart",
      partialize: (s) => ({ lines: s.lines }),
    }
  )
);
