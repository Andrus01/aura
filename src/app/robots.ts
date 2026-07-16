import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

const baseUrl = `https://${company.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
