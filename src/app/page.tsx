import Navigation from "@/components/site/Navigation";
import CartDrawer from "@/components/site/CartDrawer";
import Marquee from "@/components/site/Marquee";
import Footer from "@/components/site/Footer";
import Hero from "@/components/sections/Hero";
import StorySection from "@/components/sections/StorySection";
import PyramidSection from "@/components/sections/PyramidSection";
import ProductReveal from "@/components/sections/ProductReveal";
import ShopSection from "@/components/sections/ShopSection";
import WhySection from "@/components/sections/WhySection";
import PackagingSection from "@/components/sections/PackagingSection";
import FinalCta from "@/components/sections/FinalCta";
import { getProducts, getFeaturedProduct } from "@/lib/products";
import { getI18n } from "@/lib/i18n/server";

export default async function Home() {
  const [products, featured, { locale, dict }] = await Promise.all([
    getProducts(),
    getFeaturedProduct(),
    getI18n(),
  ]);

  return (
    <>
      <Navigation dict={dict} locale={locale} />
      <CartDrawer dict={dict} />
      <main>
        <Hero product={featured} dict={dict} />
        <StorySection dict={dict} />
        <PyramidSection dict={dict} />
        <ProductReveal dict={dict} />
        <Marquee />
        <ShopSection products={products} dict={dict} />
        <WhySection dict={dict} />
        <PackagingSection dict={dict} />
        <FinalCta dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
