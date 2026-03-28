import Box from "@mui/material/Box";
import { Gamepad2, BookOpen, FlaskConical } from "lucide-react";
import {
  Hero,
  FeatureGrid,
  CantSeriesGrid,
  OpenSourceBanner,
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
      <SiteHeader />
      <LiveRibbon fetchResults={fetchRecentResults} />

      <Hero
        titleLine1="Two molecules."
        titleLine2="One survives."
        subtitle="Compare molecular stability, acid strength, bond energy, and more. 28 chemistry challenges across 8 categories, all side by side."
        caption="free &middot; no signup &middot; learn chemistry"
        visual={<HeroAnimation />}
      />

      <FeatureGrid
        title="Three ways to learn chemistry"
        subtitle="A molecule quiz, a pattern reference, and a challenge game."
        cards={[
          {
            icon: <FlaskConical size={20} />,
            title: "Molecules",
            desc: "Compare chemical structures, formulas, and properties side by side with clear explanations.",
            href: "/learn",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better molecule in 10 quick-fire chemistry challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "28 comparisons across 8 categories. Each shows the weaker option, the stronger one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      <CantSeriesGrid currentAppName="Can't Explode" />

      <OpenSourceBanner
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant"
      />

      <SiteFooter />
    </Box>
  );
}
