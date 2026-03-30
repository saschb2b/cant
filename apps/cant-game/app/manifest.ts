import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Game - Game Dev Patterns",
    short_name: "Can't Game",
    description:
      "Learn game development patterns across game loops, physics, rendering, AI, and more. Side-by-side comparisons with explanations.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#1A1A1A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
