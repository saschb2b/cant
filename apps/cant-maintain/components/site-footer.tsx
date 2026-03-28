import { SiteFooter as SharedSiteFooter } from "@cant/shared/components";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/changelog", label: "Changelog" },
  {
    href: "https://github.com/saschb2b/cant",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://buymeacoffee.com/qohreuukw",
    label: "Support",
    external: true,
  },
];

export function SiteFooter() {
  return <SharedSiteFooter navLinks={NAV_LINKS} />;
}
