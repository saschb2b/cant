"use client";

import { VisualPanel as SharedVisualPanel } from "@cant/shared/components/game";
import { visualRegistry } from "@/components/visual/registry";

interface VisualPanelWrapperProps {
  componentId: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export function VisualPanelWrapper(props: VisualPanelWrapperProps) {
  const Component = visualRegistry[props.componentId];
  if (!Component) return null;
  return (
    <SharedVisualPanel
      component={Component}
      label={props.label}
      isSelectable={props.isSelectable}
      onSelect={props.onSelect}
      result={props.result}
      isSelected={props.isSelected}
    />
  );
}
