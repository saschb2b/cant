/** Central registry of all apps in the Can't series. */
export interface CantApp {
  name: string;
  desc: string;
  href: string;
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

export const ALL_APPS: CantApp[] = [
  {
    name: "Can't Maintain",
    desc: "React component API design. Props, composition, and patterns.",
    href: "https://cant-maintain.saschb2b.com",
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
    href: "https://cant-resize.saschb2b.com",
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
    href: "https://cant-type.saschb2b.com",
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
    href: "https://cant-orchestrate.saschb2b.com",
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
    href: "https://cant-seo.saschb2b.com",
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
    href: "https://cant-ux.saschb2b.com",
    playPitch:
      "Think you have a good design eye? Same game, same format, visual UX patterns.",
    tags: "Typography, spacing, color, hierarchy, forms",
    colorFrom: "#D97706",
    colorTo: "#B45309",
    iconSvgContent: `<ellipse cx="90" cy="90" rx="48" ry="30" stroke="#FFFFFF" stroke-width="6" fill="none"/><circle cx="90" cy="90" r="14" fill="#FFFFFF"/>`,
  },
];
