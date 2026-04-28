"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Coffee } from "lucide-react";
import type { RevealStats } from "@/lib/poker/reveal-stats";

const VERDICT_LABEL: Record<RevealStats["verdict"], string> = {
  consensus: "Consensus",
  close: "Close",
  discuss: "Discuss",
  empty: "No numeric votes",
};

const VERDICT_COLOR: Record<
  RevealStats["verdict"],
  "success" | "default" | "warning"
> = {
  consensus: "success",
  close: "default",
  discuss: "warning",
  empty: "default",
};

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export interface RevealSummaryProps {
  stats: RevealStats;
}

export function RevealSummary({ stats }: RevealSummaryProps) {
  const {
    verdict,
    median,
    average,
    min,
    max,
    unsureCount,
    coffeeCount,
    abstainCount,
    distribution,
  } = stats;

  const subtitleParts: string[] = [];
  if (unsureCount > 0) {
    subtitleParts.push(
      `${String(unsureCount)} need${unsureCount === 1 ? "s" : ""} more info`,
    );
  }
  if (coffeeCount > 0) {
    subtitleParts.push(
      `${String(coffeeCount)} on break${coffeeCount > 1 ? "s" : ""}`,
    );
  }
  if (abstainCount > 0) {
    subtitleParts.push(
      `${String(abstainCount)} abstain${abstainCount === 1 ? "ed" : "ed"}`,
    );
  }

  const maxBarCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Tooltip
          title={
            verdict === "discuss"
              ? "Estimates are spread across more than one card. Talk through it before re-voting."
              : verdict === "close"
                ? "Within one card of each other. Likely safe to lock in."
                : verdict === "consensus"
                  ? "Everyone landed on the same card."
                  : ""
          }
        >
          <Chip
            label={VERDICT_LABEL[verdict]}
            color={VERDICT_COLOR[verdict]}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Tooltip>
        {median !== null && (
          <Stack direction="row" spacing={1.5} alignItems="baseline">
            <Stack direction="row" spacing={0.75} alignItems="baseline">
              <Typography
                variant="body2"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {formatNumber(median)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                median
              </Typography>
            </Stack>
            {average !== null && average !== median && (
              <Stack direction="row" spacing={0.75} alignItems="baseline">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {formatNumber(average)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  avg
                </Typography>
              </Stack>
            )}
            {min !== null && max !== null && min !== max && (
              <Stack direction="row" spacing={0.75} alignItems="baseline">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {String(min)}-{String(max)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  range
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>

      {subtitleParts.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          {subtitleParts.join(" · ")}
        </Typography>
      )}

      {distribution.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${String(distribution.length)}, minmax(0, 1fr))`,
            gap: 0.75,
            alignItems: "end",
          }}
        >
          {distribution.map((d) => {
            const heightPct = (d.count / maxBarCount) * 100;
            return (
              <Stack
                key={d.value}
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
                    aria-label={`${String(d.count)} vote${d.count === 1 ? "" : "s"} for ${d.value}`}
                    sx={{
                      width: "100%",
                      height: `${String(heightPct)}%`,
                      minHeight: 4,
                      bgcolor:
                        d.value === "?" || d.value === "coffee"
                          ? "warning.main"
                          : "primary.main",
                      opacity: 0.85,
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
                  {d.value === "coffee" ? <Coffee size={11} /> : d.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    lineHeight: 1,
                    fontWeight: 600,
                  }}
                >
                  {d.count}
                </Typography>
              </Stack>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
