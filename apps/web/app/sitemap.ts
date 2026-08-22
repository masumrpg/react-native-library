import { source } from "@/lib/source";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `https://masumdev.vercel.app${path}`;

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...source.getPages().map((page) => ({
      url: url(page.url),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
