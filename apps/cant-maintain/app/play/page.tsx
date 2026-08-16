import type { Metadata } from "next";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshGradient } from "@cant/shared/components";
import {
  getHighlighter,
  highlightDual,
  buildContentMap,
} from "@cant/shared/lib";
import { challenges as _challenges } from "@cant/shared/lib/challenges/cant-maintain";
import type { Challenge } from "@/lib/learn/types";

const challenges = _challenges as Challenge[];

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the better React component API in 10 side-by-side code challenges. Covers props, composition, TypeScript patterns, and more.",
};

async function getContentMap() {
  "use cache";
  const highlighter = await getHighlighter();
  return buildContentMap(challenges, highlighter, highlightDual);
}

async function GameSection({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed: defaultSeed } = await searchParams;
  const contentMap = await getContentMap();
  return (
    <Game
      challenges={challenges}
      contentMap={contentMap}
      defaultSeed={defaultSeed}
    />
  );
}

export default function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
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
        <Suspense fallback={null}>
          <GameSection searchParams={searchParams} />
        </Suspense>
      </Container>

      <SiteFooter />
    </Box>
  );
}
