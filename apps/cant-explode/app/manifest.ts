import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Explode - Chemistry Challenges",
    short_name: "Can't Explode",
    description:
      "Test your chemistry knowledge with side-by-side molecule comparisons. Stability, acidity, bond energy, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D1B0F",
    theme_color: "#1B5E20",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
