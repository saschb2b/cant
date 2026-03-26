import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Orchestrate - Container Patterns",
    short_name: "Can't Orchestrate",
    description:
      "Pick the better container orchestration pattern in side-by-side code challenges covering Docker, Kubernetes, Helm, and more.",
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
