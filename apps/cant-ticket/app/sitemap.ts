import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cant-ticket.saschb2b.com";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/rooms`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/rooms/poker`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/rooms/retro`, lastModified: new Date(), priority: 0.7 },
  ];
}
