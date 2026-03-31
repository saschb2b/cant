import Box from "@mui/material/Box";
import { Search, Gamepad2, BookOpen } from "lucide-react";
import {
  Hero,
  FeatureGrid,
  CantSeriesGrid,
  OpenSourceBanner,
  MeshGradient,
} from "@cant/shared/components";
import { LiveRibbon } from "@cant/shared/components/game";
import { fetchRecentResults } from "@/lib/game/actions";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroAnimation } from "@/components/hero-animation";

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <MeshGradient />
      <SiteHeader />
      <LiveRibbon fetchResults={fetchRecentResults} />

      <Hero
        titleLine1="One link."
        titleLine2="Every platform."
        subtitle="Paste any URL and see how it appears on LinkedIn, Twitter/X, Slack, Teams, and more. Plus 64 SEO challenges and a pattern library for Next.js."
        caption="free &middot; no signup &middot; instant previews"
        gimmick={{ href: "/inspector", label: "Inspector" }}
        visual={<HeroAnimation />}
      />

      {/* Features */}
      <FeatureGrid
        title="Three ways to level up"
        subtitle="A link inspector, a pattern quiz, and a reference library."
        cards={[
          {
            icon: <Search size={20} />,
            title: "Inspector",
            desc: "Preview how any URL appears on LinkedIn, Twitter/X, Slack, Teams, Discord, Google, and WhatsApp.",
            href: "/inspector",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better SEO pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "64 patterns across 8 categories. Each shows the suboptimal approach, the recommended one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't SEO" />

      {/* Open source CTA */}
      <OpenSourceBanner
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant"
      />

      <SiteFooter />
    </Box>
  );
}
