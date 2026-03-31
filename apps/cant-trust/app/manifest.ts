import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Trust - Money, Banking & Bitcoin",
    short_name: "Can't Trust",
    description:
      "Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#C28A1A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
