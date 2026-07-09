/**
 * Decides once per browser session whether the intro curtain plays.
 * Cached at module level so IntroLoader and Hero agree regardless of
 * which one asks first.
 */
let cached: boolean | null = null;

export function introWillPlay(): boolean {
  if (typeof window === "undefined") return false;
  if (cached === null) {
    try {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cached = !reduce && sessionStorage.getItem("aura-intro") === null;
      sessionStorage.setItem("aura-intro", "1");
    } catch {
      cached = false;
    }
  }
  return cached;
}

/** Seconds the curtain covers the screen — hero delays offset by this. */
export const INTRO_DURATION = 1.6;
