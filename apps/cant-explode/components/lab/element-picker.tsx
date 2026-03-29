"use client";

import Box from "@mui/material/Box";
import type { ElementType } from "@/lib/lab/types";
import { ELEMENTS, ELEMENT_GROUPS } from "@/lib/lab/elements";

interface ElementPickerProps {
  selected: ElementType;
  onSelect: (element: ElementType) => void;
}

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
        width: { xs: 36, sm: 40 },
        height: { xs: 36, sm: 40 },
        p: 0,
        border: "2px solid",
        borderColor: isSelected ? color : "transparent",
        borderRadius: 1,
        bgcolor: isSelected
          ? `rgba(${String(r)}, ${String(g)}, ${String(b)}, 0.15)`
          : "transparent",
        cursor: "pointer",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
        color: "inherit",
        fontFamily: "inherit",
        transition: "border-color 0.1s, background-color 0.1s",
        "&:hover": {
          bgcolor: `rgba(${String(r)}, ${String(g)}, ${String(b)}, 0.1)`,
        },
        "&:active": {
          transform: "scale(0.95)",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 14, sm: 16 },
          height: { xs: 14, sm: 16 },
          borderRadius: "50%",
          bgcolor: color,
          boxShadow: isSelected ? `0 0 6px ${color}` : "none",
        }}
      />
      <Box
        component="span"
        sx={{
          fontSize: { xs: "0.45rem", sm: "0.5rem" },
          lineHeight: 1,
          color: "text.secondary",
          fontWeight: isSelected ? 700 : 400,
          textTransform: "capitalize",
        }}
      >
        {el.length > 6 ? el.slice(0, 4) + "." : el}
      </Box>
    </Box>
  );
}

export function ElementPicker({ selected, onSelect }: ElementPickerProps) {
  return (
    <Box
      sx={{
        mb: 1.5,
        display: "flex",
        gap: { xs: 0.5, sm: 1 },
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {ELEMENT_GROUPS.map((group, gi) => (
        <Box
          key={group.label}
          sx={{
            display: "flex",
            gap: "2px",
            // Visual group separation
            ...(gi > 0 && {
              ml: { xs: 0, sm: 0.5 },
              pl: { xs: 0, sm: 0.5 },
              borderLeft: { xs: "none", sm: "1px solid" },
              borderColor: "divider",
            }),
          }}
        >
          {group.elements.map((el) => (
            <ElementButton
              key={el}
              el={el}
              isSelected={el === selected}
              onClick={() => onSelect(el)}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
