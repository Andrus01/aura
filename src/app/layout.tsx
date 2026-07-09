import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CookieConsent from "@/components/site/CookieConsent";
import IntroLoader from "@/components/site/IntroLoader";
import CustomCursor from "@/components/site/CustomCursor";
import { getI18n } from "@/lib/i18n/server";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://auraood.ee";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.seo.title, template: "%s · Aura & Ood" },
    description: dict.seo.description,
    keywords: [
      "Aura & Ood",
      "Morning Spirit",
      "Koidiku Kaja",
      "unisex parfüüm",
      "eau de parfum",
      "unisex perfume",
      "Nordic fragrance",
    ],
    authors: [{ name: "Aura & Ood" }],
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "Aura & Ood",
      title: dict.seo.title,
      description: dict.seo.description,
      images: [
        {
          url: "/optimized/hero-forest-dawn.webp",
          width: 1800,
          height: 1800,
          alt: "Morning Spirit — Aura & Ood",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.title,
      description: dict.seo.description,
      images: ["/optimized/hero-forest-dawn.webp"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0A09",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Morning Spirit",
  brand: { "@type": "Brand", name: "Aura & Ood" },
  description: "Unisex eau de parfum — Sicilian lemon, white tea and musk. The Echo of Dawn.",
  category: "Fragrance",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "129.00",
    availability: "https://schema.org/InStock",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, dict } = await getI18n();

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IntroLoader />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
        <CookieConsent dict={dict} />
      </body>
    </html>
  );
}
