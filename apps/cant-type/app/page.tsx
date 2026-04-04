import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Gamepad2, BookOpen, FlaskConical, Sparkles } from "lucide-react";
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
import { challenges } from "@cant/shared/lib/challenges/cant-type";
import { CATEGORY_ORDER } from "@/lib/learn/categories";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { codeBlockStyles } from "@cant/shared/lib";
import { SparkleField } from "@/components/sparkle-field";

const HERO_SPELL = `type DeepReadonly<T> = {
  readonly [K in keyof T]:
    T[K] extends object
      ? DeepReadonly<T[K]>
      : T[K];
};`;

const HERO_REVEAL = `type DeepReadonly<Settings> = {
  readonly theme: {
    readonly mode: "light" | "dark";
    readonly accent: string;
  };
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
  };
};`;

function HeroCodeVisual({
  spellHtml,
  revealHtml,
}: {
  spellHtml: string;
  revealHtml: string;
}) {
  return (
    <Stack spacing={0} aria-hidden>
      {/* Spell: the type incantation */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
          }}
        >
          <Typography
            variant="caption"
            fontWeight={600}
            fontFamily="var(--font-geist-mono), monospace"
            color="primary.main"
          >
            The spell
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
            ...codeBlockStyles,
            "& pre": {
              ...codeBlockStyles["& pre"],
              fontSize: "0.7rem",
              lineHeight: 1.6,
              p: 1.5,
            },
          }}
          dangerouslySetInnerHTML={{ __html: spellHtml }}
        />
      </Paper>

      {/* Sparkle divider */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1.5,
          color: "primary.main",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={16} />
        </Box>
      </Box>

      {/* Reveal: the expanded result */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "rgba(var(--mui-palette-success-mainChannel) / 0.4)",
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(var(--mui-palette-success-mainChannel) / 0.1), 0 4px 24px rgba(var(--mui-palette-success-mainChannel) / 0.06)",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderBottom: 1,
            borderColor: "rgba(var(--mui-palette-success-mainChannel) / 0.3)",
            bgcolor: "rgba(var(--mui-palette-success-mainChannel) / 0.06)",
          }}
        >
          <Typography
            variant="caption"
            fontWeight={600}
            fontFamily="var(--font-geist-mono), monospace"
            color="success.main"
          >
            Revealed
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
            ...codeBlockStyles,
            "& pre": {
              ...codeBlockStyles["& pre"],
              fontSize: "0.7rem",
              lineHeight: 1.6,
              p: 1.5,
            },
          }}
          dangerouslySetInnerHTML={{ __html: revealHtml }}
        />
      </Paper>
    </Stack>
  );
}

export default async function LandingPage() {
  const highlighter = await getHighlighter();
  const spellHtml = highlightDual(highlighter, HERO_SPELL);
  const revealHtml = highlightDual(highlighter, HERO_REVEAL);
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
        titleLine1="Type magic,"
        titleLine2="demystified."
        subtitle={
          <>
            Test your TypeScript instincts with quick-fire challenges, and study{" "}
            {String(challenges.length)} patterns across{" "}
            {String(CATEGORY_ORDER.length)} categories side by side.
          </>
        }
        caption="free &middot; no signup &middot; takes 3 min"
        gimmick={{ href: "/playground", label: "Sandbox" }}
        visual={
          <HeroCodeVisual spellHtml={spellHtml} revealHtml={revealHtml} />
        }
        gradientOverlay={<SparkleField />}
      />

      {/* Features */}
      <FeatureGrid
        title="Three paths to mastery"
        subtitle="A pattern quiz, a spell book, and a type sandbox."
        cards={[
          {
            icon: <Gamepad2 size={20} />,
            title: "Play",
            desc: "Pick the better TypeScript pattern in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: `${String(challenges.length)} patterns across ${String(CATEGORY_ORDER.length)} categories. Each shows the fragile approach, the resilient one, and why it matters.`,
            href: "/learn",
          },
          {
            icon: <FlaskConical size={20} />,
            title: "Sandbox",
            desc: "Write TypeScript types and see them fully expanded. Explore utility types, mapped types, conditionals, and more.",
            href: "/playground",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Type" />

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
