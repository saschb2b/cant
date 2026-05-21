import Box from "@mui/material/Box";
import { Gamepad2, BookOpen, DoorOpen } from "lucide-react";
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
import { challenges } from "@cant/shared/lib/challenges/cant-ticket";
import { CATEGORY_ORDER } from "@/lib/learn/categories";
import { TicketCanvas } from "@/components/ticket-canvas";

const TOTAL = challenges.length;
const CATEGORIES = CATEGORY_ORDER.length;

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
        titleLine1="Stories,"
        titleLine2="not braindumps."
        subtitle={`Train your eye for clean tickets. Side-by-side comparisons of stories, acceptance criteria, estimates, and splits across ${String(CATEGORIES)} categories.`}
        caption="free &middot; no signup &middot; based on the blog"
        gimmick={{ href: "/rooms", label: "Open a room" }}
        visual={<HeroTicket />}
        gradientOverlay={<TicketCanvas />}
      />

      <FeatureGrid
        title="Three ways to level up"
        subtitle="A pattern quiz, a reference library, and live team rooms."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the cleaner ticket in 10 side-by-side challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: `${String(TOTAL)} comparisons across ${String(CATEGORIES)} categories. Each shows a messy ticket, a cleaner one, and why it matters.`,
            href: "/learn",
          },
          {
            icon: <DoorOpen size={20} />,
            title: "Rooms",
            desc: "Planning poker and sprint retro. Open a room, share the link, run the ceremony. Ephemeral, no signup.",
            href: "/rooms",
          },
        ]}
      />

      <CantSeriesGrid currentAppName="Can't Ticket" />

      <OpenSourceBanner
        title="Open source"
        description="Built with Next.js, Material UI, and TypeScript. Contributions welcome."
        githubUrl="https://github.com/saschb2b/cant"
      />

      <SiteFooter />
    </Box>
  );
}

function HeroTicket() {
  return (
    <Box
      sx={{
        width: { xs: 220, md: 320 },
        height: { xs: 220, md: 320 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: "100%", height: "100%" }}
      >
        <rect
          x="32"
          y="38"
          width="156"
          height="120"
          rx="14"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.15"
          fill="var(--mui-palette-background-paper)"
        />
        <line
          x1="58"
          y1="72"
          x2="172"
          y2="72"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="58"
          y1="98"
          x2="148"
          y2="98"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="58"
          y1="124"
          x2="124"
          y2="124"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polyline
          points="58,162 76,180 116,138"
          stroke="#A16207"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </Box>
  );
}
