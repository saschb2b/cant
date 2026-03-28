"use client";

import { ResultsScreen as SharedResultsScreen } from "@cant/shared/components/game";
import Typography from "@mui/material/Typography";
import type { GameState } from "@/lib/game/types";
import { CATEGORY_LABELS } from "@/lib/game/categories";
import {
  getRank,
  getShareUrl,
  getMissedCategoryLabels,
  encodeResults,
} from "@/lib/game/share";

interface ResultsScreenProps {
  state: GameState;
  onRetry: () => void;
  onNewGame: () => void;
}

export function ResultsScreen(props: ResultsScreenProps) {
  return (
    <SharedResultsScreen
      {...props}
      config={{
        shareSubject: "React component APIs",
        githubUrl: "https://github.com/saschb2b/cant",
        categoryLabels: CATEGORY_LABELS,
        getShareUrl,
        getMissedCategoryLabels,
        encodeResults,
      }}
      renderRank={(percentage) => {
        const rank = getRank(percentage);
        return (
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            {rank}
          </Typography>
        );
      }}
    />
  );
}
