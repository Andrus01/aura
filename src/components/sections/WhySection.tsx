import { content } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export default function WhySection() {
  return (
    <section className="relative bg-ink-soft py-28 md:py-36">
      <div className="container-luxe">
        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <Reveal>
              <span className="eyebrow">{content.why.eyebrow}</span>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="display mt-6 text-[clamp(2rem,5vw,3.6rem)] text-cream">
                {content.why.title}
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2">
            {content.why.items.map((item, i) => (
              <Reveal key={item.title} delay={i} className="bg-ink p-8">
                <span className="font-serif text-4xl italic text-gold/40">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl text-cream">{item.title}</h3>
                <p className="mt-3 font-sans text-[0.9rem] leading-relaxed text-cream/60">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
