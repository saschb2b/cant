"use client";

import Typography from "@mui/material/Typography";
import { CodePanel as SharedCodePanel } from "@cant/shared/components/game/code-panel";
import checkmarkAnimation from "./checkmark-animation.json";

const betterLabel = (
  <Typography variant="caption" fontWeight={500} color="success.main">
    Better
  </Typography>
);

interface CodePanelProps {
  highlightedHtml: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export function CodePanel(props: CodePanelProps) {
  return (
    <SharedCodePanel
      {...props}
      checkmarkAnimation={checkmarkAnimation}
      headerBackground="secondary.main"
      codeBackground="rgba(var(--mui-palette-secondary-mainChannel) / 0.5)"
      betterLabel={betterLabel}
    />
  );
}
