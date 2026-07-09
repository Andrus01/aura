import type { Product } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import ProductCard from "./ProductCard";
import FeatureProduct from "./FeatureProduct";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTitle } from "@/components/motion/SplitTitle";

export default function ShopSection({
  products,
  dict,
}: {
  products: Product[];
  dict: Dictionary;
}) {
  return (
    <section id="pood" className="relative bg-ink py-28 md:py-40">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">{dict.shop.eyebrow}</span>
          </Reveal>
          <SplitTitle
            text={dict.shop.title}
            delay={0.1}
            className="display mt-6 text-[clamp(2.2rem,6vw,4.4rem)] text-cream"
          />
          <Reveal delay={2}>
            <p className="mx-auto mt-6 max-w-md font-sans text-[1rem] leading-relaxed text-cream/60">
              {dict.shop.lead}
            </p>
          </Reveal>
        </div>

        {products.length === 1 ? (
          <Reveal className="mx-auto mt-16 max-w-4xl">
            <FeatureProduct product={products[0]} dict={dict} />
          </Reveal>
        ) : (
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i}>
                <ProductCard product={p} dict={dict} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
