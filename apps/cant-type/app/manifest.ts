import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Type - TypeScript Pattern Game",
    short_name: "Can't Type",
    description:
      "Pick the better TypeScript pattern in side-by-side code challenges. Covers generics, narrowing, utility types, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1219",
    theme_color: "#181D27",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
