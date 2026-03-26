"use client";

import { CodePanel as SharedCodePanel } from "@cant/shared/components/game/code-panel";
import checkmarkAnimation from "./checkmark-animation.json";

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
      defaultHeaderBgcolor="secondary.main"
      codeBgcolor="rgba(var(--mui-palette-secondary-mainChannel) / 0.5)"
    />
  );
}
