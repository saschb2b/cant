import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't SEO - Link Inspector",
    short_name: "Can't SEO",
    description:
      "Preview how any URL appears on LinkedIn, Twitter/X, Slack, Teams, Discord, Google, and WhatsApp. Plus SEO challenges for Next.js.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#1E293B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
