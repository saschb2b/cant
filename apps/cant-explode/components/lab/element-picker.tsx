"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import type { ElementType } from "@/lib/lab/types";
import { ELEMENTS, ELEMENT_GROUPS } from "@/lib/lab/elements";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface LabToolbarProps {
  selected: ElementType;
  onSelect: (element: ElementType) => void;
  eraserActive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Element button                                                     */
/* ------------------------------------------------------------------ */

function ElementButton({
  el,
  isSelected,
  onClick,
}: {
  el: ElementType;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [r, g, b] = ELEMENTS[el].baseColor;
  const color = `rgb(${String(r)}, ${String(g)}, ${String(b)})`;

  return (
    <Box
      component="button"
      onClick={onClick}
      title={el.charAt(0).toUpperCase() + el.slice(1)}
      sx={{
        // 44px minimum touch target
        width: 48,
        height: 48,
        p: 0,
        border: "2px solid",
        borderColor: isSelected ? color : "transparent",
        borderRadius: 1.5,
        bgcolor: isSelected
          ? `rgba(${String(r)}, ${String(g)}, ${String(b)}, 0.25)`
          : "transparent",
        cursor: "pointer",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
        color: "inherit",
        fontFamily: "inherit",
        flexShrink: 0,
        transition: "border-color 0.1s, background-color 0.1s",
        "&:hover": {
          bgcolor: `rgba(${String(r)}, ${String(g)}, ${String(b)}, 0.15)`,
        },
        "&:active": {
          transform: "scale(0.95)",
        },
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          bgcolor: color,
          boxShadow: isSelected ? `0 0 6px ${color}` : "none",
        }}
      />
      <Box
        component="span"
        sx={{
          fontSize: "0.55rem",
          lineHeight: 1,
          color: "grey.400",
          fontWeight: isSelected ? 700 : 400,
          textTransform: "capitalize",
        }}
      >
        {el.length > 6 ? el.slice(0, 4) + "." : el}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Category tab                                                       */
/* ------------------------------------------------------------------ */

function GroupTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        // 44px minimum touch height
        px: 1.5,
        py: 1,
        minHeight: 44,
        display: "flex",
        alignItems: "center",
        border: "none",
        borderRadius: 1,
        bgcolor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
        color: isActive ? "grey.100" : "grey.500",
        cursor: "pointer",
        outline: "none",
        fontSize: "0.7rem",
        fontWeight: isActive ? 700 : 500,
        fontFamily: "inherit",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "background-color 0.1s, color 0.1s",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.1)",
          color: "grey.300",
        },
      }}
    >
      {label}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Main toolbar                                                       */
/* ------------------------------------------------------------------ */

export function LabToolbar({
  selected,
  onSelect,
  eraserActive,
}: LabToolbarProps) {
  const [activeGroup, setActiveGroup] = useState(0);

  const group = ELEMENT_GROUPS[activeGroup];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(0, 0, 0, 0.35)",
        flexShrink: 0,
      }}
    >
      {/* Row 1: Category tabs (full width) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {ELEMENT_GROUPS.map((g, i) => (
          <GroupTab
            key={g.label}
            label={g.label}
            isActive={i === activeGroup}
            onClick={() => setActiveGroup(i)}
          />
        ))}
      </Box>

      {/* Row 2: Elements (full width) */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          px: 1,
          py: 0.5,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {group?.elements.map((el) => (
          <ElementButton
            key={el}
            el={el}
            isSelected={!eraserActive && el === selected}
            onClick={() => onSelect(el)}
          />
        ))}
      </Box>
    </Box>
  );
}
