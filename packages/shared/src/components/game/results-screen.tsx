"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import { useTrackEvent } from "../../lib/analytics-context";
import { buildChallengeIssueUrl } from "../../lib/github-issue";
import { FormattedText } from "../formatted-text";
import {
  RotateCcw,
  Check,
  X,
  Zap,
  Clock,
  ExternalLink,
  BookOpen,
  Coffee,
  GitPullRequestArrow,
  Pencil,
  Share2,
  ClipboardCheck,
  Hash,
  Copy,
} from "lucide-react";

/** Minimum challenge shape the results screen needs. */
interface ResultsChallenge {
  id: string;
  title: string;
  category: string;
  explanationCorrect: string;
  explanationWrong?: string;
  sourceUrl: string;
  sourceLabel: string;
}

/** Minimum game state shape the results screen needs. */
interface ResultsGameState<C extends ResultsChallenge = ResultsChallenge> {
  challenges: C[];
  answers: Record<
    string,
    { result: "correct" | "wrong"; side: "left" | "right" }
  >;
  bestStreak: number;
  startedAt: number;
  finishedAt: number | null;
  thinkingTimeSec: number;
  seed: string;
}

interface ResultsConfig<S> {
  /** Domain-specific text for sharing, e.g. "responsive patterns". */
  shareSubject: string;
  /** Full share URL builder. */
  getShareUrl: (state: S) => string;
  /** Encode game results to a URL-safe string. */
  encodeResults: (state: S) => string;
  /** Get missed category labels from game state. */
  getMissedCategoryLabels: (state: S) => string[];
  /** GitHub repo URL for the contribute button. */
  githubUrl: string;
  /** Category labels map. */
  categoryLabels: Record<string, string>;
}

interface ResultsScreenProps<S extends ResultsGameState = ResultsGameState> {
  state: S;
  onRetry: () => void;
  onNewGame: () => void;
  config: ResultsConfig<S>;
  /** Render the rank display. Receives percentage. Default: plain text. */
  renderRank?: (percentage: number) => ReactNode;
  /** Extra content inside the hero card (e.g. sparkle field). */
  heroExtra?: ReactNode;
  /** Extra hero Paper sx overrides. */
  heroSx?: Record<string, unknown>;
}

export function ResultsScreen<S extends ResultsGameState>({
  state,
  onRetry,
  onNewGame,
  config,
  renderRank,
  heroExtra,
  heroSx,
}: ResultsScreenProps<S>) {
  const trackEvent = useTrackEvent();
  const total = state.challenges.length;
  const correct = Object.values(state.answers).filter(
    (a) => a.result === "correct",
  ).length;
  const percentage = Math.round((correct / total) * 100);
  const elapsed = state.thinkingTimeSec;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const scoreColor =
    percentage >= 70
      ? "success.main"
      : percentage >= 50
        ? "warning.main"
        : "error.main";

  const wrongChallenges = state.challenges.filter(
    (c) => state.answers[c.id]?.result === "wrong",
  );

  const correctChallenges = state.challenges.filter(
    (c) => state.answers[c.id]?.result === "correct",
  );

  const [hasCopied, setHasCopied] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);

  const buildShareText = useCallback(() => {
    const dots = state.challenges
      .map((c) =>
        state.answers[c.id]?.result === "correct" ? "\u{1F7E2}" : "\u{1F534}",
      )
      .join("");
    const shareUrl = config.getShareUrl(state);
    const missedLabels = config.getMissedCategoryLabels(state);

    const lines: string[] = [];

    if (correct === total) {
      lines.push(
        `Perfect ${String(correct)}/${String(total)} on spotting better ${config.shareSubject}!`,
      );
      lines.push("");
      lines.push(dots);
      lines.push("");
      lines.push(`Seed: ${state.seed}`);
      lines.push("Can you match a perfect score?");
    } else {
      lines.push(
        `I scored ${String(correct)}/${String(total)} on spotting better ${config.shareSubject}.`,
      );
      lines.push("");
      lines.push(dots);
      lines.push("");
      lines.push(`Seed: ${state.seed}`);
      lines.push(`Tripped up on ${missedLabels.join(" and ")}.`);
      lines.push("Can you beat my score?");
    }

    lines.push("");
    lines.push(shareUrl);

    return lines.join("\n");
  }, [state, correct, total, config]);

  const handleShare = useCallback(() => {
    trackEvent("game-shared", { score: correct, total });
    const text = buildShareText();

    if (typeof navigator.share === "function") {
      void navigator.share({ text }).catch(() => {
        void navigator.clipboard.writeText(text).then(() => {
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 2000);
        });
      });
      return;
    }

    void navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  }, [buildShareText, correct, total, trackEvent]);

  const resultsParam = useMemo(
    () => config.encodeResults(state),
    [state, config],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    window.history.replaceState(
      null,
      "",
      `/play/results?r=${resultsParam}&seed=${state.seed}`,
    );
    return () => window.history.replaceState(null, "", "/play");
  }, [resultsParam]);

  return (
    <Stack spacing={4} sx={{ py: { xs: 0, sm: 4 } }}>
      {/* Hero */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={[
            {
              position: "relative",
              overflow: "hidden",
              border: 1,
              borderColor: "divider",
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3 },
              textAlign: "center",
              maxWidth: { md: 600 },
              width: "100%",
            },
            ...(heroSx ? [heroSx] : []),
          ]}
        >
          {heroExtra}

          <Typography
            variant="h2"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ color: scoreColor, lineHeight: 1, position: "relative" }}
          >
            {correct}/{total}
          </Typography>

          <Box sx={{ mt: 1, position: "relative" }}>
            {renderRank ? (
              renderRank(percentage)
            ) : (
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ color: "text.primary" }}
              >
                {percentage >= 90
                  ? "Master"
                  : percentage >= 70
                    ? "Expert"
                    : percentage >= 50
                      ? "Getting There"
                      : "Keep Practicing"}
              </Typography>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={0.75}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {state.challenges.map((c) => {
              const isCorrect = state.answers[c.id]?.result === "correct";
              return (
                <Box
                  key={c.id}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: isCorrect ? "success.main" : "error.main",
                    opacity: 0.8,
                  }}
                />
              );
            })}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Zap size={14} color="var(--mui-palette-warning-main)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {state.bestStreak}x streak
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Clock size={14} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              onClick={() => {
                void navigator.clipboard.writeText(state.seed);
                setSeedCopied(true);
                setTimeout(() => setSeedCopied(false), 2000);
              }}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                px: 0.5,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Hash size={14} color="var(--mui-palette-text-secondary)" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {state.seed}
              </Typography>
              {seedCopied ? (
                <ClipboardCheck
                  size={12}
                  color="var(--mui-palette-success-main)"
                />
              ) : (
                <Copy size={12} color="var(--mui-palette-text-secondary)" />
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant={percentage >= 70 ? "contained" : "outlined"}
              size="medium"
              onClick={handleShare}
              startIcon={
                hasCopied ? <ClipboardCheck size={18} /> : <Share2 size={18} />
              }
              sx={{
                px: { sm: 2.75 },
                py: { sm: 1 },
                fontSize: { sm: "0.9375rem" },
              }}
            >
              {hasCopied ? "Copied!" : "Share"}
            </Button>
            <Button
              variant={percentage >= 70 ? "outlined" : "contained"}
              size="medium"
              onClick={onRetry}
              startIcon={<RotateCcw size={18} />}
              sx={{
                px: { sm: 2.75 },
                py: { sm: 1 },
                fontSize: { sm: "0.9375rem" },
              }}
            >
              Retry
            </Button>
            <Button
              variant="text"
              size="medium"
              onClick={onNewGame}
              sx={{
                px: { sm: 2.75 },
                py: { sm: 1 },
                fontSize: { sm: "0.9375rem" },
              }}
            >
              New Game
            </Button>
          </Stack>

          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
              position: "relative",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Enjoying the game?
            </Typography>
            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ rowGap: 1 }}
            >
              <Button
                component="a"
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<GitPullRequestArrow size={16} />}
                onClick={() =>
                  trackEvent("contribute-clicked", {
                    location: "result-card",
                  })
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "text.primary",
                    color: "text.primary",
                  },
                }}
              >
                Contribute challenges or fixes
              </Button>
              <Button
                component="a"
                href="https://buymeacoffee.com/qohreuukw"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<Coffee size={16} />}
                onClick={() =>
                  trackEvent("buymeacoffee-clicked", {
                    location: "result-card",
                  })
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderColor: "divider",
                  color: "warning.main",
                  "&:hover": {
                    borderColor: "warning.main",
                    bgcolor:
                      "rgba(var(--mui-palette-warning-mainChannel) / 0.08)",
                  },
                }}
              >
                Buy me a coffee
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* Review */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {wrongChallenges.length > 0 && (
          <Box
            sx={{
              gridColumn: correctChallenges.length > 0 ? undefined : "1 / -1",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <X size={16} color="var(--mui-palette-error-main)" />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                You missed ({String(wrongChallenges.length)})
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {wrongChallenges.map((challenge) => (
                <Paper
                  key={challenge.id}
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor:
                      "rgba(var(--mui-palette-error-mainChannel) / 0.3)",
                    bgcolor:
                      "rgba(var(--mui-palette-error-mainChannel) / 0.04)",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ px: 2, pt: 2, pb: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="error.main"
                      sx={{ flex: 1 }}
                    >
                      {challenge.title}
                    </Typography>
                    <Chip
                      label={config.categoryLabels[challenge.category]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        bgcolor:
                          "rgba(var(--mui-palette-error-mainChannel) / 0.1)",
                        color: "error.main",
                      }}
                    />
                  </Stack>

                  <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Box
                      sx={{
                        typography: "body2",
                        lineHeight: 1.7,
                        color: "text.primary",
                        mb: 1.5,
                      }}
                    >
                      <FormattedText
                        text={
                          challenge.explanationWrong ??
                          challenge.explanationCorrect
                        }
                      />
                    </Box>
                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ rowGap: 0.5 }}
                    >
                      <Link
                        href={challenge.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        onClick={() =>
                          trackEvent("source-link-clicked", {
                            challengeId: challenge.id,
                            category: challenge.category,
                            label: challenge.sourceLabel,
                          })
                        }
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          typography: "caption",
                          fontWeight: 500,
                          color: "primary.main",
                        }}
                      >
                        <ExternalLink size={12} />
                        {challenge.sourceLabel}
                      </Link>
                      <Link
                        href={`/learn/${challenge.category}`}
                        underline="hover"
                        onClick={() =>
                          trackEvent("learn-link-clicked", {
                            challengeId: challenge.id,
                            category: challenge.category,
                            label:
                              config.categoryLabels[challenge.category] ?? "",
                          })
                        }
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          typography: "caption",
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                      >
                        <BookOpen size={12} />
                        Review {config.categoryLabels[challenge.category]}
                      </Link>
                      <Link
                        href={buildChallengeIssueUrl(config.githubUrl, {
                          id: challenge.id,
                          title: challenge.title,
                          category: challenge.category,
                          categoryLabel:
                            config.categoryLabels[challenge.category],
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        onClick={() =>
                          trackEvent("contribute-clicked", {
                            location: "review-card",
                            challengeId: challenge.id,
                            category: challenge.category,
                          })
                        }
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          typography: "caption",
                          fontWeight: 500,
                          color: "text.secondary",
                          "&:hover": { color: "text.primary" },
                        }}
                      >
                        <Pencil size={12} />
                        Suggest a fix
                      </Link>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {correctChallenges.length > 0 && (
          <Stack
            spacing={3}
            sx={{
              gridColumn: wrongChallenges.length > 0 ? undefined : "1 / -1",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Check size={16} color="var(--mui-palette-success-main)" />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                >
                  You nailed ({String(correctChallenges.length)})
                </Typography>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                {correctChallenges.map((challenge, i) => (
                  <Stack
                    key={challenge.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderTop: i > 0 ? 1 : 0,
                      borderColor: "divider",
                    }}
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
                        flexShrink: 0,
                        color: "success.main",
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ flex: 1 }}
                    >
                      {challenge.title}
                    </Typography>
                    <Chip
                      label={config.categoryLabels[challenge.category]}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        bgcolor: "action.hover",
                        color: "text.secondary",
                      }}
                    />
                  </Stack>
                ))}
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
