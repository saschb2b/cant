import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't UX - UX Design Patterns",
    short_name: "Can't UX",
    description:
      "Learn UX design patterns by comparing good and bad approaches side by side.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#D97706",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
