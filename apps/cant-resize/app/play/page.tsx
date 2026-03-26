import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Game } from "@/components/game/game";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { challenges } from "@/lib/learn/challenges";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Pick the better responsive pattern in 10 side-by-side code challenges. Covers media queries, flexbox, grid, MUI, and more.",
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed: defaultSeed } = await searchParams;
  const highlighter = await getHighlighter();

  const highlightMap: Record<string, { goodHtml: string; badHtml: string }> =
    {};
  for (const challenge of challenges) {
    const lang = challenge.lang ?? "tsx";
    highlightMap[challenge.id] = {
      goodHtml: highlightDual(highlighter, challenge.goodCode, lang),
      badHtml: highlightDual(highlighter, challenge.badCode, lang),
    };
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Mesh gradient background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(var(--mui-palette-primary-mainChannel) / 0.08) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 50% at 85% 75%, rgba(var(--mui-palette-primary-mainChannel) / 0.05) 0%, transparent 100%)",
            "radial-gradient(circle at 50% 50%, rgba(var(--mui-palette-error-mainChannel) / 0.02) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <SiteHeader />

      <Container
        maxWidth="lg"
        component="section"
        sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
      >
        <Game
          challenges={challenges}
          highlightMap={highlightMap}
          defaultSeed={defaultSeed}
        />
      </Container>

      <SiteFooter />
    </Box>
  );
}
