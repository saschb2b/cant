"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Coffee, Eye, RotateCcw } from "lucide-react";
import { DECK, type Vote } from "@/lib/poker/deck";
import type { ParticipantSnapshot } from "@/lib/poker/events";
import { computeRevealStats, type RevealStats } from "@/lib/poker/reveal-stats";

const VERDICT_LABEL: Record<RevealStats["verdict"] | "waiting", string> = {
  waiting: "Waiting",
  consensus: "Consensus",
  close: "Close",
  discuss: "Discuss",
  empty: "No numeric votes",
};

const VERDICT_COLOR: Record<
  RevealStats["verdict"] | "waiting",
  "default" | "success" | "warning"
> = {
  waiting: "default",
  consensus: "success",
  close: "default",
  discuss: "warning",
  empty: "default",
};

const VERDICT_TOOLTIP: Record<RevealStats["verdict"] | "waiting", string> = {
  waiting: "Round is open. Pick a card; reveal when ready.",
  consensus: "Everyone landed on the same card.",
  close: "Within one card of each other. Likely safe to lock in.",
  discuss:
    "Estimates are spread across more than one card. Talk through it before re-voting.",
  empty: "No numeric votes were cast this round.",
};

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export interface RoundStatusProps {
  revealed: boolean;
  participants: ParticipantSnapshot[];
  onReveal: () => void;
  onReset: () => void;
}

export function RoundStatus({
  revealed,
  participants,
  onReveal,
  onReset,
}: RoundStatusProps) {
  const voters = participants.filter((p) => !p.isSpectator);
  const total = voters.length;
  const voted = voters.filter((p) => p.hasVoted).length;
  const allVoted = total > 0 && voted === total;
  const stats = revealed ? computeRevealStats(participants) : null;
  const verdict = stats ? stats.verdict : "waiting";
  const resetLabel = !stats
    ? "New round"
    : stats.verdict === "discuss"
      ? "Discuss & re-vote"
      : stats.verdict === "consensus"
        ? "Lock in & next"
        : "New round";

  const distMap = new Map<Vote, number>();
  if (stats) {
    for (const d of stats.distribution) distMap.set(d.value, d.count);
  }
  const maxBarCount = stats
    ? Math.max(...stats.distribution.map((d) => d.count), 1)
    : 1;

  const subtitleParts: string[] = [];
  if (stats) {
    if (stats.unsureCount > 0) {
      subtitleParts.push(
        `${String(stats.unsureCount)} need${stats.unsureCount === 1 ? "s" : ""} more info`,
      );
    }
    if (stats.coffeeCount > 0) {
      subtitleParts.push(
        `${String(stats.coffeeCount)} on break${stats.coffeeCount > 1 ? "s" : ""}`,
      );
    }
    if (stats.abstainCount > 0) {
      subtitleParts.push(`${String(stats.abstainCount)} abstained`);
    }
  }

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        useFlexGap
      >
        <Tooltip title={VERDICT_TOOLTIP[verdict]}>
          <Chip
            label={VERDICT_LABEL[verdict]}
            color={VERDICT_COLOR[verdict]}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Tooltip>
        <Stack direction="row" spacing={1} flexShrink={0}>
          {!revealed && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Eye size={14} />}
              onClick={onReveal}
              disabled={voted === 0}
            >
              {allVoted ? "Reveal" : "Reveal anyway"}
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<RotateCcw size={14} />}
            onClick={onReset}
          >
            {resetLabel}
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ minHeight: 48 }}>
        {stats && stats.median !== null ? (
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="baseline"
            flexWrap="wrap"
            useFlexGap
          >
            <Stack direction="row" spacing={0.75} alignItems="baseline">
              <Typography
                variant="h5"
                fontWeight={800}
                fontFamily="var(--font-geist-mono), monospace"
                lineHeight={1}
              >
                {formatNumber(stats.median)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                median
              </Typography>
            </Stack>
            {stats.average !== null && stats.average !== stats.median && (
              <Stack direction="row" spacing={0.75} alignItems="baseline">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {formatNumber(stats.average)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  avg
                </Typography>
              </Stack>
            )}
            {stats.min !== null &&
              stats.max !== null &&
              stats.min !== stats.max && (
                <Stack direction="row" spacing={0.75} alignItems="baseline">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {String(stats.min)}-{String(stats.max)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    range
                  </Typography>
                </Stack>
              )}
          </Stack>
        ) : (
          <Stack spacing={1}>
            <Stack direction="row" spacing={0.75} alignItems="baseline">
              <Typography
                variant="h5"
                fontWeight={800}
                fontFamily="var(--font-geist-mono), monospace"
                lineHeight={1}
              >
                {voted}
                <Typography
                  component="span"
                  variant="h5"
                  color="text.disabled"
                  fontWeight={800}
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  /{total}
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                voted
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={total === 0 ? 0 : (voted / total) * 100}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Stack>
        )}
      </Box>

      <Box
        aria-hidden={!stats}
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${String(DECK.length)}, minmax(0, 1fr))`,
          gap: 0.75,
          alignItems: "end",
          opacity: stats ? 1 : 0.35,
          transition: "opacity 200ms",
        }}
      >
        {DECK.map((value) => {
          const count = distMap.get(value) ?? 0;
          const heightPct = stats ? (count / maxBarCount) * 100 : 12;
          const hasVote = count > 0;
          return (
            <Stack
              key={value}
              spacing={0.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 28,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  aria-label={
                    stats
                      ? `${String(count)} vote${count === 1 ? "" : "s"} for ${value}`
                      : undefined
                  }
                  sx={{
                    width: "100%",
                    height: `${String(heightPct)}%`,
                    minHeight: 4,
                    bgcolor: !stats
                      ? "action.disabledBackground"
                      : !hasVote
                        ? "action.hover"
                        : value === "?" || value === "coffee"
                          ? "warning.main"
                          : "primary.main",
                    opacity: stats && hasVote ? 0.9 : 1,
                    borderRadius: 0.5,
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  color: "text.secondary",
                }}
              >
                {value === "coffee" ? <Coffee size={11} /> : value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  fontWeight: 600,
                  color: stats ? "text.primary" : "text.disabled",
                }}
              >
                {stats ? count : "·"}
              </Typography>
            </Stack>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ minHeight: "1em" }}
      >
        {subtitleParts.length > 0 ? subtitleParts.join(" · ") : " "}
      </Typography>
    </Stack>
  );
}
