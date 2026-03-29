import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cant.saschb2b.com";
  return [{ url: baseUrl, lastModified: new Date(), priority: 1 }];
}
