import { SiteFooter as SharedSiteFooter } from "@cant/shared/components";

const NAV_LINKS = [
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Sandbox" },
  {
    href: "https://github.com/saschb2b/cant",
    label: "GitHub",
    external: true,
  },
];

export function SiteFooter() {
  return <SharedSiteFooter navLinks={NAV_LINKS} />;
}
