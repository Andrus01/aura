"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Clears the cart once after a successful payment return. */
export default function ClearCart() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
