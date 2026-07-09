/**
 * Infinite brand marquee divider. Pure CSS animation — renders on the server.
 */
const ITEMS = ["Aura & Ood", "Morning Spirit", "Koidiku Kaja", "Eau de Parfum"];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-8 font-serif text-[clamp(1.6rem,3.5vw,2.8rem)] font-light italic text-cream/30 md:px-14">
            {item}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/50" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-cream/[0.08] bg-ink py-7 md:py-9">
      <div className="flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused]">
        <Row />
        <div aria-hidden className="flex shrink-0">
          <Row />
        </div>
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
