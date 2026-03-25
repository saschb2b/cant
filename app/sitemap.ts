import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cant-type.saschb2b.com";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/play`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), priority: 0.8 },
  ];
}
