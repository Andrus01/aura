import Image from "next/image";
import { content } from "@/lib/content";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";

export default function PackagingSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="container-luxe grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="relative">
          <Parallax offset={50} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <div className="relative h-[115%]">
              <Image
                src="/optimized/package-gold.webp"
                alt="Aura & Ood must-kuldne pakend kuldses valguses"
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Parallax>
          {/* Floating secondary image */}
          <div className="absolute -bottom-8 -right-4 hidden w-40 overflow-hidden rounded-xl border border-gold/20 shadow-2xl md:block lg:w-52">
            <div className="relative aspect-square">
              <Image
                src="/optimized/package-float.webp"
                alt="Aura & Ood pakend hõljumas"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <Reveal>
            <span className="eyebrow">{content.packaging.eyebrow}</span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="display mt-6 text-[clamp(2rem,5vw,3.6rem)] text-cream">
              {content.packaging.title}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-md font-sans text-[1rem] leading-relaxed text-cream/65">
              {content.packaging.body}
            </p>
          </Reveal>
          <ul className="mt-10 space-y-4">
            {content.packaging.points.map((p, i) => (
              <Reveal as="li" key={p} delay={i} className="flex items-center gap-4">
                <span className="h-px w-8 bg-gold" />
                <span className="font-sans text-[0.82rem] uppercase tracking-luxe text-cream/80">
                  {p}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
