import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Branch — Git Best Practices Game",
    short_name: "Can't Branch",
    description:
      "Train your eye for clean git workflows in 10 side-by-side challenges.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF5F9",
    theme_color: "#BE185D",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
