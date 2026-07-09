"use client";

/**
 * Slowly rising gold light dust for cinematic sections. Pure CSS animation,
 * deterministic pseudo-random layout so SSR and client markup match.
 */
const COUNT = 16;

function rand(i: number, salt: number) {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export function AmbientDust({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {Array.from({ length: COUNT }, (_, i) => {
        // Fixed precision so SSR and hydrated inline styles match exactly
        const size = (1.5 + rand(i, 1) * 2.5).toFixed(2);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-gold-light animate-dust"
            style={{
              left: `${(4 + rand(i, 2) * 92).toFixed(2)}%`,
              bottom: `${(rand(i, 3) * 30).toFixed(2)}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0,
              animationDuration: `${(9 + rand(i, 4) * 9).toFixed(2)}s`,
              animationDelay: `${(rand(i, 5) * 12).toFixed(2)}s`,
              boxShadow: "0 0 6px 1px rgba(228,201,139,0.55)",
            }}
          />
        );
      })}
    </div>
  );
}
