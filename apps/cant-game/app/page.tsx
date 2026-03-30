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
        titleLine1="Level up."
        titleLine2="Ship games."
        subtitle="Test your game dev instincts with quick-fire challenges, and study patterns across game loops, physics, rendering, AI, shaders, and netcode."
        caption="free &middot; no signup &middot; 8 categories"
        visual={<HeroAnimation />}
      />

      {/* Features */}
      <FeatureGrid
        title="Two ways to level up"
        subtitle="A pattern quiz and a reference library."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better game dev pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "Patterns across 8 categories. Each shows the naive approach, the robust one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Game" />

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
