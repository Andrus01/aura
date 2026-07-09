import Navigation from "@/components/site/Navigation";
import CartDrawer from "@/components/site/CartDrawer";
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

export default async function Home() {
  const [products, featured] = await Promise.all([
    getProducts(),
    getFeaturedProduct(),
  ]);

  return (
    <>
      <Navigation />
      <CartDrawer />
      <main>
        <Hero product={featured} />
        <StorySection />
        <PyramidSection />
        <ProductReveal />
        <ShopSection products={products} />
        <WhySection />
        <PackagingSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
