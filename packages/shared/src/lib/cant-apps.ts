/** Central registry of all apps in the Can't series. */
export interface CantApp {
  name: string;
  desc: string;
  href: string;
  /** Short pitch for the /play lobby cross-promo. */
  playPitch: string;
  /** Comma-separated topic tags shown in the lobby card. */
  tags: string;
}

export const ALL_APPS: CantApp[] = [
  {
    name: "Can't Maintain",
    desc: "React component API design.",
    href: "https://cant-maintain.saschb2b.com",
    playPitch:
      "Think you can spot clean React component APIs? Same game, same format, different topic.",
    tags: "Props, composition, patterns",
  },
  {
    name: "Can't Resize",
    desc: "Responsive design patterns.",
    href: "https://cant-resize.saschb2b.com",
    playPitch:
      "Think you know responsive design? Same game, same format, different topic.",
    tags: "Media queries, flexbox, grid, MUI patterns",
  },
  {
    name: "Can't Type",
    desc: "TypeScript patterns.",
    href: "https://cant-type.saschb2b.com",
    playPitch:
      "Test your TypeScript instincts. Generics, narrowing, utility types, and common mistakes.",
    tags: "Generics, narrowing, utility types",
  },
  {
    name: "Can't Orchestrate",
    desc: "Container orchestration patterns.",
    href: "https://cant-orchestrate.saschb2b.com",
    playPitch:
      "Test your DevOps instincts. Docker, Kubernetes, CI/CD, and infrastructure patterns.",
    tags: "Docker, Kubernetes, CI/CD, Helm",
  },
];
