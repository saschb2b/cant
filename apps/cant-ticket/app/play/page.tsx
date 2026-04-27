import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@cant/shared/components";
import { buildContentMap } from "@cant/shared/lib";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import type { Challenge } from "@/lib/learn/types";
import { challenges as _challenges } from "@cant/shared/lib/challenges/cant-ticket";

const challenges = _challenges as Challenge[];

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the cleaner ticket in 10 side-by-side challenges. Covers stories, acceptance criteria, story points, splitting, and team practices.",
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed: defaultSeed } = await searchParams;

  const highlighter = await getHighlighter();
  const contentMap = buildContentMap(challenges, highlighter, highlightDual);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <MeshGradient />
      <SiteHeader />

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Game
          challenges={challenges}
          contentMap={contentMap}
          defaultSeed={defaultSeed}
        />
      </Container>

      <SiteFooter />
    </Box>
  );
}
