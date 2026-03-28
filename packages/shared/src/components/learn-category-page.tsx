import type { ReactNode } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { LearnContentPanel } from "./learn-content-panel";
import { ChallengeAnchor } from "./challenge-anchor";
import { ChallengeListToggle } from "./challenge-list-toggle";
import type { ContentMapEntry } from "./game/game";
import type { BaseChallenge, Difficulty } from "../lib/game/types";

function difficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "rgba(var(--mui-palette-success-mainChannel) / 0.15)";
    case "medium":
      return "rgba(var(--mui-palette-warning-mainChannel) / 0.15)";
    case "hard":
      return "rgba(var(--mui-palette-error-mainChannel) / 0.15)";
  }
}

interface LearnCategoryPageProps {
  /** Current category label (e.g. "Media Queries") */
  label: string;
  /** Category description text */
  description: string;
  /** Challenges for this category, sorted by difficulty */
  challenges: BaseChallenge[];
  /** Pre-built content map from buildContentMap() */
  contentMap: Record<string, ContentMapEntry>;
  /** Previous category for navigation, or undefined */
  prev?: { href: string; label: string };
  /** Next category for navigation, or undefined */
  next?: { href: string; label: string };
  /**
   * Render function for the explanation section of each challenge card.
   * This is the ONLY part that varies between apps:
   * - cant-maintain: simple single explanation + manual link
   * - others: "Why avoid" + "Why prefer" two-section layout with SourceLink
   */
  renderExplanation: (challenge: BaseChallenge) => ReactNode;
  /**
   * Background color for comparison panels.
   * Defaults to "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)".
   */
  panelBg?: string;
  /**
   * Optional custom content panel renderer. When provided, replaces the
   * default LearnContentPanel. Useful for apps with visual challenges that
   * need a component registry to resolve componentIds.
   */
  renderContentPanel?: (
    entry: ContentMapEntry | undefined,
    side: "good" | "bad",
  ) => ReactNode;
  /** Label for the "bad" panel header. Defaults to "Avoid". */
  badLabel?: string;
  /** Label for the "good" panel header. Defaults to "Prefer". */
  goodLabel?: string;
}

export function LearnCategoryPage({
  label,
  description,
  challenges,
  contentMap,
  prev,
  next,
  renderExplanation,
  renderContentPanel,
  badLabel = "Avoid",
  goodLabel = "Prefer",
}: LearnCategoryPageProps) {
  return (
    <>
      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 3 }}>
        <NextLink
          href="/learn"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 500,
            color: "inherit",
          }}
        >
          <Typography variant="body2" component="span" color="text.secondary">
            Learn
          </Typography>
        </NextLink>
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={600}
        >
          {label}
        </Typography>
      </Stack>

      {/* Page header */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {label}
          </Typography>
          <Chip
            label={`${String(challenges.length)} patterns`}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "background.paper",
            }}
          />
        </Stack>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7, maxWidth: 560 }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Challenges */}
      <ChallengeListToggle>
        <Stack spacing={3}>
          {challenges.map((challenge) => (
            <Paper
              key={challenge.id}
              id={challenge.id}
              elevation={0}
              sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}
            >
              {/* Header */}
              <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChallengeAnchor id={challenge.id} title={challenge.title} />
                  <Chip
                    label={challenge.difficulty}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      bgcolor: difficultyColor(challenge.difficulty),
                    }}
                  />
                </Stack>
              </Box>

              {/* Code comparison */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}
              >
                <Box
                  className="compact-hide"
                  sx={{
                    flex: "1 1 50%",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ px: 2, pt: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor:
                          "rgba(var(--mui-palette-error-mainChannel) / 0.12)",
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
                      {badLabel}
                    </Typography>
                  </Stack>
                  {renderContentPanel ? (
                    renderContentPanel(contentMap[challenge.id], "bad")
                  ) : (
                    <LearnContentPanel
                      entry={contentMap[challenge.id]}
                      side="bad"
                    />
                  )}
                </Box>

                <Divider
                  className="compact-hide"
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
                <Divider
                  className="compact-hide"
                  sx={{ display: { sm: "none" } }}
                />

                <Box
                  className="compact-full-width"
                  sx={{
                    flex: "1 1 50%",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ px: 2, pt: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor:
                          "rgba(var(--mui-palette-success-mainChannel) / 0.12)",
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
                      {goodLabel}
                    </Typography>
                  </Stack>
                  {renderContentPanel ? (
                    renderContentPanel(contentMap[challenge.id], "good")
                  ) : (
                    <LearnContentPanel
                      entry={contentMap[challenge.id]}
                      side="good"
                    />
                  )}
                </Box>
              </Stack>

              {/* Explanation */}
              <Box
                className="compact-hide"
                sx={{ px: 2.5, py: 2, maxWidth: 720 }}
              >
                {renderExplanation(challenge)}
              </Box>
            </Paper>
          ))}
        </Stack>
      </ChallengeListToggle>

      {/* Previous / Next navigation */}
      <Stack
        direction="row"
        justifyContent={prev ? "space-between" : "flex-end"}
        sx={{ mt: 5 }}
      >
        {prev && (
          <NextLink
            href={prev.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                px: 2.5,
                py: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <ArrowLeft size={16} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    Previous
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {prev.label}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </NextLink>
        )}
        {next && (
          <NextLink
            href={next.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                px: 2.5,
                py: 2,
                textAlign: "right",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    Next
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {next.label}
                  </Typography>
                </Box>
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <ArrowRight size={16} />
                </Box>
              </Stack>
            </Paper>
          </NextLink>
        )}
      </Stack>
    </>
  );
}
