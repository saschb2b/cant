"use client";

import Typography from "@mui/material/Typography";
import { ResultsScreen as SharedResultsScreen } from "@cant/shared/components/game";
import { CATEGORY_LABELS } from "@/lib/learn/categories";
import {
  getRank,
  getShareUrl,
  getMissedCategoryLabels,
  encodeResults,
} from "@/lib/game/share";
import type { GameState } from "@/lib/learn/types";
import { SparkleField } from "@/components/sparkle-field";

const config = {
  shareSubject: "TypeScript patterns",
  getShareUrl,
  encodeResults,
  getMissedCategoryLabels,
  githubUrl: "https://github.com/saschb2b/cant",
  categoryLabels: CATEGORY_LABELS,
};

interface ResultsScreenProps {
  state: GameState;
  onRetry: () => void;
  onNewGame: () => void;
}

export function ResultsScreen(props: ResultsScreenProps) {
  const correct = Object.values(props.state.answers).filter(
    (a) => a.result === "correct",
  ).length;
  const percentage = Math.round(
    (correct / props.state.challenges.length) * 100,
  );

  return (
    <SharedResultsScreen
      {...props}
      config={config}
      renderRank={() => (
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: "text.primary" }}
        >
          {getRank(percentage)}
        </Typography>
      )}
      heroExtra={percentage >= 70 ? <SparkleField /> : undefined}
      heroSx={
        percentage >= 90
          ? {
              borderColor: "rgba(var(--mui-palette-success-mainChannel) / 0.4)",
              boxShadow:
                "0 0 0 1px rgba(var(--mui-palette-success-mainChannel) / 0.1), 0 4px 24px rgba(var(--mui-palette-success-mainChannel) / 0.08)",
            }
          : undefined
      }
    />
  );
}
