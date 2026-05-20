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
import { DesignCanvas } from "@/components/design-canvas";

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
        titleLine1="Spot the"
        titleLine2="better design."
        subtitle="Train your design eye with side-by-side UX comparisons. Learn typography, spacing, color, hierarchy, and more through 28 patterns across 7 categories."
        caption="free &middot; no signup &middot; visual comparisons"
        visual={<HeroAnimation />}
        gradientOverlay={<DesignCanvas />}
      />

      {/* Features */}
      <FeatureGrid
        title="Two ways to level up"
        subtitle="A pattern quiz and a reference library for UX design."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better UX pattern in 10 side-by-side visual challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "28 patterns across 7 categories. Each shows the weak approach, the strong one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't UX" />

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
