import Box from "@mui/material/Box";
import { Monitor, Gamepad2, BookOpen } from "lucide-react";
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
        titleLine1="One site."
        titleLine2="Every screen."
        subtitle="Preview your site on every device at once, test your knowledge with quick-fire challenges, and study 128 responsive patterns side by side."
        caption="free &middot; no signup &middot; works with localhost"
        gimmick={{ href: "/canvas", label: "Viewer" }}
        visual={<HeroAnimation />}
      />

      {/* Features */}
      <FeatureGrid
        title="Three ways to level up"
        subtitle="A multi-device viewer, a pattern quiz, and a reference library."
        cards={[
          {
            icon: <Monitor size={20} />,
            title: "Viewer",
            desc: "Preview any URL on phones, tablets, and desktops with synced scroll, click, and navigation.",
            href: "/canvas",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better responsive pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "128 patterns across 16 categories. Each shows the fragile approach, the resilient one, and why it matters.",
            href: "/learn",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Resize" />

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
