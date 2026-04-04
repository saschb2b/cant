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
import { challenges } from "@cant/shared/lib/challenges/cant-orchestrate";
import { CATEGORY_ORDER } from "@/lib/learn/categories";

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
        titleLine1="Ship containers,"
        titleLine2="not mistakes."
        subtitle={
          <>
            Test your DevOps instincts with quick-fire challenges, and study{" "}
            {String(challenges.length)} patterns across{" "}
            {String(CATEGORY_ORDER.length)} categories side by side.
          </>
        }
        caption="free &middot; no signup &middot; takes 3 min"
        gimmick={{ href: "/explorer", label: "Explorer" }}
        visual={<HeroAnimation />}
      />

      {/* Features */}
      <FeatureGrid
        title="Two paths to mastery"
        subtitle="A pattern quiz and a reference library."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better orchestration pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: `${String(challenges.length)} patterns across ${String(CATEGORY_ORDER.length)} categories. Each shows the fragile approach, the resilient one, and why it matters.`,
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Orchestrate" />

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
