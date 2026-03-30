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
        titleLine1="GET better."
        titleLine2="POST results."
        subtitle="Test your API design instincts with quick-fire challenges, and study patterns across REST, GraphQL, WebSockets, auth, and more."
        caption="free &middot; no signup &middot; 7 categories"
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
            desc: "Pick the better API pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "Patterns across 7 categories. Each shows the fragile approach, the resilient one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Query" />

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
