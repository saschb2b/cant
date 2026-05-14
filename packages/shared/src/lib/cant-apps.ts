const isDev = process.env.NODE_ENV === "development";

export const HUB_URL = isDev
  ? "http://localhost:3000"
  : "https://cant.saschb2b.com";

export const REPO_URL = "https://github.com/saschb2b/cant";

/** Central registry of all apps in the Can't series. */
export interface CantApp {
  name: string;
  desc: string;
  href: string;
  /** High-level domain label (e.g. "Development", "Design", "Science"). */
  category: string;
  /** Short pitch for the /play lobby cross-promo. */
  playPitch: string;
  /** Comma-separated topic tags shown in the lobby card. */
  tags: string;
  /** Gradient start color (from the app's theme). */
  colorFrom: string;
  /** Gradient end color (from the app's theme). */
  colorTo: string;
  /**
   * SVG inner content for the icon (shapes only, no outer svg/rect).
   * Drawn inside a 180x180 viewBox on top of the gradient background.
   */
  iconSvgContent: string;
}

function appUrl(prodUrl: string, devPort: number): string {
  return isDev ? `http://localhost:${String(devPort)}` : prodUrl;
}

export const ALL_APPS: CantApp[] = [
  {
    name: "Can't Maintain",
    desc: "React component API design. Props, composition, and patterns.",
    href: appUrl("https://cant-maintain.saschb2b.com", 3001),
    category: "Development",
    playPitch:
      "Think you can spot clean React component APIs? Same game, same format, different topic.",
    tags: "Props, composition, patterns",
    colorFrom: "#2B4C7E",
    colorTo: "#1E3A5F",
    iconSvgContent: `<text x="20" y="112" font-family="system-ui, sans-serif" font-weight="700" font-size="72" fill="#E8E0D4">&lt;</text><circle cx="90" cy="90" r="14" fill="#D4A843"/><text x="97" y="112" font-family="system-ui, sans-serif" font-weight="700" font-size="72" fill="#E8E0D4">/&gt;</text>`,
  },
  {
    name: "Can't Resize",
    desc: "Responsive design patterns. Media queries, flexbox, grid, and viewport units.",
    href: appUrl("https://cant-resize.saschb2b.com", 3002),
    category: "Development",
    playPitch:
      "Think you know responsive design? Same game, same format, different topic.",
    tags: "Media queries, flexbox, grid, MUI patterns",
    colorFrom: "#247A6F",
    colorTo: "#1B5E56",
    iconSvgContent: `<rect x="42" y="54" width="96" height="72" rx="10" stroke="#FFFFFF" stroke-width="6" fill="none"/><rect x="120" y="122" width="32" height="5" rx="3" fill="#D4A843"/><rect x="132" y="133" width="20" height="5" rx="3" fill="#D4A843"/>`,
  },
  {
    name: "Can't Type",
    desc: "TypeScript patterns. Generics, narrowing, utility types, and common mistakes.",
    href: appUrl("https://cant-type.saschb2b.com", 3003),
    category: "Development",
    playPitch:
      "Test your TypeScript instincts. Generics, narrowing, utility types, and common mistakes.",
    tags: "Generics, narrowing, utility types",
    colorFrom: "#3178C6",
    colorTo: "#265FA0",
    iconSvgContent: `<text x="85" y="115" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="88" fill="#FFFFFF" letter-spacing="-2">TS</text><rect x="144" y="104" width="6" height="40" rx="3" fill="#6EA8DE"/>`,
  },
  {
    name: "Can't Orchestrate",
    desc: "Container orchestration patterns. Docker, Kubernetes, CI/CD, and Helm.",
    href: appUrl("https://cant-orchestrate.saschb2b.com", 3004),
    category: "Development",
    playPitch:
      "Test your DevOps instincts. Docker, Kubernetes, CI/CD, and infrastructure patterns.",
    tags: "Docker, Kubernetes, CI/CD, Helm",
    colorFrom: "#7C3AED",
    colorTo: "#6025C0",
    iconSvgContent: `<circle cx="90" cy="90" r="45" stroke="#FFFFFF" stroke-width="7" fill="none"/><circle cx="90" cy="90" r="13" fill="#A78BFA"/><rect x="82" y="22" width="16" height="26" rx="8" fill="#FFFFFF"/><rect x="82" y="132" width="16" height="26" rx="8" fill="#FFFFFF"/><rect x="22" y="82" width="26" height="16" rx="8" fill="#FFFFFF"/><rect x="132" y="82" width="26" height="16" rx="8" fill="#FFFFFF"/>`,
  },
  {
    name: "Can't SEO",
    desc: "SEO best practices for Next.js. Meta tags, Open Graph, structured data, and more.",
    href: appUrl("https://cant-seo.saschb2b.com", 3005),
    category: "Development",
    playPitch:
      "Think you know SEO? Test your meta tag instincts with Open Graph, structured data, and more.",
    tags: "Meta tags, Open Graph, structured data, canonical URLs",
    colorFrom: "#2563EB",
    colorTo: "#1D4ED8",
    iconSvgContent: `<circle cx="72" cy="72" r="38" stroke="#FFFFFF" stroke-width="8" fill="none"/><line x1="100" y1="100" x2="140" y2="140" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/><circle cx="57" cy="57" r="7" fill="#F59E0B"/>`,
  },
  {
    name: "Can't UX",
    desc: "UX design patterns. Typography, spacing, color, hierarchy, layout, and forms.",
    href: appUrl("https://cant-ux.saschb2b.com", 3006),
    category: "Design",
    playPitch:
      "Think you have a good design eye? Same game, same format, visual UX patterns.",
    tags: "Typography, spacing, color, hierarchy, forms",
    colorFrom: "#D97706",
    colorTo: "#B45309",
    iconSvgContent: `<ellipse cx="90" cy="90" rx="48" ry="30" stroke="#FFFFFF" stroke-width="6" fill="none"/><circle cx="90" cy="90" r="14" fill="#FFFFFF"/>`,
  },
  {
    name: "Can't Explode",
    desc: "Chemistry challenges. Molecular stability, acid strength, bond energy, and electronegativity.",
    href: appUrl("https://cant-explode.saschb2b.com", 3007),
    category: "Science",
    playPitch:
      "Think you know chemistry? Test your instincts with molecule comparisons across 8 categories.",
    tags: "Stability, acids, bonds, electronegativity",
    colorFrom: "#1B5E20",
    colorTo: "#2E7D32",
    iconSvgContent: `<circle cx="90" cy="70" r="20" stroke="#FFFFFF" stroke-width="6" fill="none"/><circle cx="60" cy="120" r="16" stroke="#FFFFFF" stroke-width="5" fill="none"/><circle cx="120" cy="120" r="16" stroke="#FFFFFF" stroke-width="5" fill="none"/><line x1="78" y1="84" x2="68" y2="107" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><line x1="102" y1="84" x2="112" y2="107" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    name: "Can't Branch",
    desc: "Git best practices. Commits, branches, merges, PRs, hooks, and repository management.",
    href: appUrl("https://cant-branch.saschb2b.com", 3008),
    category: "Development",
    playPitch:
      "Think you know git? Test your instincts with commits, branches, merges, and repo management.",
    tags: "Commits, branches, merges, PRs, hooks",
    colorFrom: "#DB2777",
    colorTo: "#BE185D",
    iconSvgContent: `<line x1="72" y1="32" x2="72" y2="148" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/><circle cx="72" cy="48" r="9" fill="#FFFFFF"/><circle cx="72" cy="90" r="9" fill="#FFFFFF"/><circle cx="72" cy="132" r="9" fill="#FFFFFF"/><circle cx="124" cy="72" r="9" fill="#FBCFE8"/><line x1="72" y1="65" x2="124" y2="72" stroke="#FBCFE8" stroke-width="5" stroke-linecap="round"/><line x1="124" y1="72" x2="72" y2="85" stroke="#FBCFE8" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    name: "Can't Test",
    desc: "Testing patterns. Unit tests, integration tests, mocking, test strategy, and CI.",
    href: appUrl("https://cant-test.saschb2b.com", 3010),
    category: "Development",
    playPitch:
      "Think you know testing? Test your instincts with unit tests, mocking, strategy, and more.",
    tags: "Unit tests, integration, mocking, strategy, CI",
    colorFrom: "#059669",
    colorTo: "#047857",
    iconSvgContent: `<polyline points="50,95 70,120 115,60" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="120" y1="110" x2="145" y2="135" stroke="#A7F3D0" stroke-width="8" stroke-linecap="round"/><line x1="145" y1="110" x2="120" y2="135" stroke="#A7F3D0" stroke-width="8" stroke-linecap="round"/>`,
  },
  {
    name: "Can't Query",
    desc: "API endpoint patterns. REST, GraphQL, WebSockets, auth, and error handling.",
    href: appUrl("https://cant-query.saschb2b.com", 3009),
    category: "Development",
    playPitch:
      "Think you know API design? Test your instincts with REST, GraphQL, WebSockets, and more.",
    tags: "REST, GraphQL, WebSockets, auth, error handling",
    colorFrom: "#475569",
    colorTo: "#334155",
    iconSvgContent: `<line x1="30" y1="75" x2="90" y2="75" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/><polygon points="85,65 100,75 85,85" fill="#FFFFFF"/><line x1="150" y1="105" x2="90" y2="105" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/><polygon points="95,95 80,105 95,115" fill="#CBD5E1"/><text x="90" y="55" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="28" fill="#FFFFFF">?</text>`,
  },
  {
    name: "Can't Game",
    desc: "Game development patterns. Game loops, input, physics, rendering, AI, shaders, and netcode.",
    href: appUrl("https://cant-game.saschb2b.com", 3011),
    category: "Development",
    playPitch:
      "Think you know game dev? Test your instincts with game loops, physics, rendering, AI, and netcode.",
    tags: "Game loops, physics, rendering, AI, shaders, netcode",
    colorFrom: "#DC2626",
    colorTo: "#991B1B",
    iconSvgContent: `<rect x="40" y="68" width="40" height="12" rx="4" fill="#FFFFFF"/><rect x="54" y="54" width="12" height="40" rx="4" fill="#FFFFFF"/><circle cx="125" cy="70" r="10" fill="#FCA5A5"/><circle cx="115" cy="90" r="10" fill="#FCA5A5"/><rect x="45" y="120" width="90" height="6" rx="3" fill="#FCA5A5" opacity="0.5"/>`,
  },
  {
    name: "Can't Ticket",
    desc: "Agile ticket craft. User stories, acceptance criteria, story points, and splitting work the team can ship.",
    href: appUrl("https://cant-ticket.saschb2b.com", 3013),
    category: "Process",
    playPitch:
      "Think you can write a clean story? Test your instincts on titles, acceptance criteria, splits, and estimates.",
    tags: "Stories, INVEST, points, splitting, refinement",
    colorFrom: "#EAB308",
    colorTo: "#A16207",
    iconSvgContent: `<rect x="38" y="46" width="104" height="80" rx="10" stroke="#FFFFFF" stroke-width="6" fill="none"/><line x1="56" y1="68" x2="124" y2="68" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><line x1="56" y1="86" x2="108" y2="86" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><line x1="56" y1="104" x2="92" y2="104" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><polyline points="58,142 70,154 96,128" stroke="#FEF3C7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
];
