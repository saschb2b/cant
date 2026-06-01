"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Check } from "lucide-react";

interface CategorySection {
  label: string;
  categories: string[];
}

interface CategoryFilterProps {
  sections: CategorySection[];
  categoryLabels: Record<string, string>;
  excluded: Set<string>;
  onToggleCategory: (category: string) => void;
  onToggleSection: (categories: string[]) => void;
  /** Whether the filter is disabled (e.g. when a seed with baked-in categories is active). */
  disabled?: boolean;
}

/**
 * Grouped category chip filter used in the game lobby.
 * Shows category sections with toggleable chips.
 */
export function CategoryFilter({
  sections,
  categoryLabels,
  excluded,
  onToggleCategory,
  onToggleSection,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <Stack spacing={2}>
      {sections.map((section) => {
        return (
          <Box key={section.label}>
            <Typography
              variant="overline"
              fontWeight={700}
              role={disabled ? undefined : "button"}
              tabIndex={disabled ? undefined : 0}
              sx={{
                display: "block",
                mb: 0.75,
                color: "text.secondary",
                cursor: disabled ? "default" : "pointer",
                "&:hover": disabled ? {} : { color: "text.primary" },
              }}
              onClick={
                disabled ? undefined : () => onToggleSection(section.categories)
              }
              onKeyDown={
                disabled
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggleSection(section.categories);
                      }
                    }
              }
            >
              {section.label}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {section.categories.map((cat) => {
                const isExcluded = excluded.has(cat);
                return (
                  <Chip
                    key={cat}
                    label={categoryLabels[cat]}
                    size="small"
                    aria-pressed={!isExcluded}
                    icon={
                      !isExcluded ? (
                        <Check size={12} strokeWidth={3} />
                      ) : undefined
                    }
                    onClick={disabled ? undefined : () => onToggleCategory(cat)}
                    variant={isExcluded ? "outlined" : "filled"}
                    sx={{
                      fontWeight: 500,
                      opacity: isExcluded ? 0.5 : 1,
                      cursor: disabled ? "default" : "pointer",
                      bgcolor: isExcluded ? "transparent" : "action.selected",
                      borderColor: isExcluded ? "divider" : "transparent",
                      color: isExcluded ? "text.disabled" : "text.primary",
                      transition: "all 0.15s ease",
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
