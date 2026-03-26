import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Resize - Multi-Device Preview",
    short_name: "Can't Resize",
    description:
      "Preview any URL across phones, tablets, and desktops simultaneously with synchronized scrolling, clicks, and navigation.",
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
