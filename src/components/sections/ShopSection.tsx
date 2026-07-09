import { content } from "@/lib/content";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import FeatureProduct from "./FeatureProduct";
import { Reveal } from "@/components/motion/Reveal";

export default function ShopSection({ products }: { products: Product[] }) {
  return (
    <section id="pood" className="relative bg-ink py-28 md:py-40">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">{content.shop.eyebrow}</span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="display mt-6 text-[clamp(2.2rem,6vw,4.4rem)] text-cream">
              {content.shop.title}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mx-auto mt-6 max-w-md font-sans text-[1rem] leading-relaxed text-cream/60">
              {content.shop.lead}
            </p>
          </Reveal>
        </div>

        {products.length === 1 ? (
          <Reveal className="mx-auto mt-16 max-w-4xl">
            <FeatureProduct product={products[0]} />
          </Reveal>
        ) : (
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
