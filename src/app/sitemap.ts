import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

const baseUrl = `https://${company.domain}`;

const publicPaths = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/kkk", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privaatsus", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/tagastamine", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/tarne", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/tingimused", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
