import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { Check, X, Gamepad2, BookOpen, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Hero,
  FeatureGrid,
  CantSeriesGrid,
  OpenSourceBanner,
  MeshGradient,
} from "@cant/shared/components";
import { LiveRibbon } from "@cant/shared/components/game";
import { fetchRecentResults } from "@/lib/game/actions";
import {
  getHighlighter,
  highlightDual,
  codeBlockStyles,
} from "@cant/shared/lib";

const BAD_CODE = `interface UserCardProps {
  data: User;
  active: boolean;
  click: () => void;
}`;

const GOOD_CODE = `interface UserCardProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}`;

function HeroCodeComparison({
  badCodeHtml,
  goodCodeHtml,
}: {
  badCodeHtml: string;
  goodCodeHtml: string;
}) {
  return (
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
          px: 2,
          py: 1,
          bgcolor: "secondary.main",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ letterSpacing: "0.05em" }}
        >
          WHICH IS BETTER?
        </Typography>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
          />
        }
      >
        {/* Bad code */}
        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ px: 2, pt: { xs: 1, sm: 1.5 } }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "error.main",
              }}
            >
              <X size={11} strokeWidth={3} />
            </Box>
            <Typography
              variant="caption"
              fontWeight={600}
              fontFamily="var(--font-geist-mono), monospace"
              color="error.main"
            >
              Worse
            </Typography>
          </Stack>
          <Box
            sx={{
              ...codeBlockStyles,
              "& pre": {
                ...codeBlockStyles["& pre"],
                p: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                lineHeight: { xs: 1.5, sm: 1.7 },
              },
            }}
            dangerouslySetInnerHTML={{ __html: badCodeHtml }}
          />
        </Box>

        {/* Divider on mobile */}
        <Divider sx={{ display: { sm: "none" } }} />

        {/* Good code */}
        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ px: 2, pt: { xs: 1, sm: 1.5 } }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "success.main",
              }}
            >
              <Check size={11} strokeWidth={3} />
            </Box>
            <Typography
              variant="caption"
              fontWeight={600}
              fontFamily="var(--font-geist-mono), monospace"
              color="success.main"
            >
              Better
            </Typography>
          </Stack>
          <Box
            sx={{
              ...codeBlockStyles,
              "& pre": {
                ...codeBlockStyles["& pre"],
                p: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                lineHeight: { xs: 1.5, sm: 1.7 },
              },
            }}
            dangerouslySetInnerHTML={{ __html: goodCodeHtml }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export default async function LandingPage() {
  const highlighter = await getHighlighter();
  const badCodeHtml = highlightDual(highlighter, BAD_CODE);
  const goodCodeHtml = highlightDual(highlighter, GOOD_CODE);
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
        titleLine1="One component."
        titleLine2="Two APIs."
        subtitle="Can you tell which props your future self will thank you for? Train your eye in under 5 minutes."
        caption="10 challenges &middot; no signup &middot; takes 3 min"
        visual={
          <HeroCodeComparison
            badCodeHtml={badCodeHtml}
            goodCodeHtml={goodCodeHtml}
          />
        }
      />

      {/* What you'll learn */}
      <FeatureGrid
        title="Train your eye for code that lasts"
        subtitle="Real conventions from React, MUI, and production codebases."
        cards={[
          {
            icon: <Zap size={20} />,
            title: "Play",
            desc: "Pick the better component API in 10 side-by-side code challenges. Daily and weekly seeds included.",
            href: "/play",
          },
          {
            icon: <BookOpen size={20} />,
            title: "Learn",
            desc: "Callback naming, boolean props, prop specificity, and more. Each pattern shows both sides and why it matters.",
            href: "/learn",
          },
          {
            icon: <Gamepad2 size={20} />,
            title: "Practice",
            desc: "Train with real conventions from React, MUI, and production codebases until clean APIs become second nature.",
            href: "/play",
          },
        ]}
      />

      {/* Can't series */}
      <CantSeriesGrid currentAppName="Can't Maintain" />

      {/* Open source */}
      <OpenSourceBanner githubUrl="https://github.com/saschb2b/cant" />

      <SiteFooter />
    </Box>
  );
}
