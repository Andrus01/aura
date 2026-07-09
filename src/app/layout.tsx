import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { content } from "@/lib/content";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://auraood.ee";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aura & Ood — Morning Spirit · Koidiku Kaja",
    template: "%s · Aura & Ood",
  },
  description:
    "Morning Spirit on Aura & Ood’i unisex eau de parfum — sitrusest ärkav, valge tee kaudu süvenev ja muskuse peal püsiv. Ood lühikesele hetkele enne päeva ärkamist.",
  keywords: [
    "Aura & Ood",
    "Morning Spirit",
    "Koidiku Kaja",
    "unisex parfüüm",
    "eau de parfum",
    "luksusparfüüm",
    "Nordic fragrance",
  ],
  authors: [{ name: "Aura & Ood" }],
  openGraph: {
    type: "website",
    locale: "et_EE",
    url: siteUrl,
    siteName: "Aura & Ood",
    title: "Morning Spirit — Koidiku Kaja",
    description:
      "Unisex eau de parfum, mis tabab lühikese hetke enne päeva ärkamist. Sitrus · Valge tee · Muskus.",
    images: [
      {
        url: "/optimized/hero-forest-dawn.webp",
        width: 1800,
        height: 1800,
        alt: "Morning Spirit — merevaigust pudel koidiku metsas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morning Spirit — Koidiku Kaja",
    description: "Aura & Ood’i unisex eau de parfum. Alusta päeva valgusega.",
    images: ["/optimized/hero-forest-dawn.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0A09",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Morning Spirit",
  brand: { "@type": "Brand", name: "Aura & Ood" },
  description:
    "Unisex eau de parfum — Sicilian lemon, white tea and musk. The Echo of Dawn.",
  category: "Fragrance",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "129.00",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="et" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
