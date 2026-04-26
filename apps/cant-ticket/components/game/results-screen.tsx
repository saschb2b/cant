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
import type { GameState } from "@/lib/game/types";

const config = {
  shareSubject: "UX patterns",
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
  const percentage = Math.round(
    (Object.values(props.state.answers).filter((a) => a.result === "correct")
      .length /
      props.state.challenges.length) *
      100,
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
    />
  );
}
