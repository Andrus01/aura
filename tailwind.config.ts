import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep black base
        ink: {
          DEFAULT: "#0B0A09",
          soft: "#14110E",
          800: "#1C1813",
        },
        // Warm gold
        gold: {
          DEFAULT: "#C9A15A",
          light: "#E4C98B",
          deep: "#A67C3D",
        },
        // Amber orange (the bottle)
        amber: {
          DEFAULT: "#C0662C",
          glow: "#E08A3C",
          deep: "#8A4520",
        },
        // Soft dawn cream
        cream: {
          DEFAULT: "#F4E9D6",
          soft: "#EFE3CE",
        },
        // Cold morning blue
        dawn: {
          DEFAULT: "#5E86A3",
          deep: "#2C4257",
          mist: "#A9C2D4",
        },
        // White mist
        mist: "#F8F6F1",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wideluxe: "0.42em",
      },
      maxWidth: {
        content: "1360px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "40%": { opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
        "slow-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        dust: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "12%": { opacity: "0.85" },
          "80%": { opacity: "0.4" },
          "100%": { transform: "translateY(-55vh)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 1s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 6s linear infinite",
        "scroll-cue": "scroll-cue 1.8s ease-in-out infinite",
        "slow-float": "slow-float 7s ease-in-out infinite",
        marquee: "marquee 36s linear infinite",
        dust: "dust 12s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
