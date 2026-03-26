import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cant-seo.saschb2b.com";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/inspector`, lastModified: new Date(), priority: 0.9 },
  ];
}
