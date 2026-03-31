import Box from "@mui/material/Box";
import { Gamepad2, BookOpen } from "lucide-react";
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
        titleLine1="Don't trust."
        titleLine2="Verify."
        subtitle="Learn why trust is the problem in traditional finance and how Bitcoin removes the need for it. From money origins through the 1971 Nixon shock to cryptography, consensus, and self-custody."
        caption="free &middot; no signup &middot; 18 categories"
        visual={<HeroAnimation />}
      />

      {/* Features */}
      <FeatureGrid
        title="Two ways to learn"
        subtitle="A pattern quiz and a reference library."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better approach in 10 side-by-side challenges covering money, banking, inflation, and crypto.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "Patterns across 18 categories. Each shows the flawed approach, the better one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Trust" />

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
