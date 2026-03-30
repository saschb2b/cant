import { SiteFooter as SharedSiteFooter } from "@cant/shared/components";

const NAV_LINKS = [
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
  {
    href: "https://github.com/saschb2b/cant",
    label: "GitHub",
    external: true,
  },
] as const;

export function SiteFooter() {
  return <SharedSiteFooter navLinks={[...NAV_LINKS]} />;
}
