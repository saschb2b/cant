import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Ticket - Agile Ticket Craft",
    short_name: "Can't Ticket",
    description: "Learn agile ticket craft by comparing stories side by side.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#A16207",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
