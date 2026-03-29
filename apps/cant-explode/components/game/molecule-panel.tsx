"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import type { MoleculePanelSlotProps } from "@cant/shared/components/game";
import { useAppTheme } from "@cant/shared/lib/app-theme-context";

export function MoleculePanel({
  molecule,
  label,
  isSelectable,
  onSelect,
  result,
  isSelected,
}: MoleculePanelSlotProps) {
  const { labels } = useAppTheme();

  const borderColor =
    result === "correct"
      ? "success.main"
      : result === "wrong"
        ? "error.main"
        : "divider";

  const ringColor =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.3)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.3)"
        : undefined;

  const headerBg =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.1)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.1)"
        : "action.selected";

  const headerBorderColor =
    result === "correct"
      ? "rgba(var(--mui-palette-success-mainChannel) / 0.3)"
      : result === "wrong"
        ? "rgba(var(--mui-palette-error-mainChannel) / 0.3)"
        : "divider";

  return (
    <Paper
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : -1}
      aria-label={`Option ${label}`}
      onClick={isSelectable ? onSelect : undefined}
      onKeyDown={
        isSelectable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      elevation={0}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: 2,
        borderColor,
        overflow: "hidden",
        cursor: isSelectable ? "pointer" : "default",
        transition: "all 0.3s ease",
        boxShadow: ringColor ? `0 0 0 3px ${ringColor}` : undefined,
        ...(result === "correct" &&
          isSelected && {
            animation: "panelCorrect 0.4s ease",
            "@keyframes panelCorrect": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.015)" },
              "100%": { transform: "scale(1)" },
            },
          }),
        ...(result === "wrong" &&
          isSelected && {
            animation: "panelWrong 0.3s ease",
            "@keyframes panelWrong": {
              "0%": { transform: "translateX(0)" },
              "25%": { transform: "translateX(-3px)" },
              "50%": { transform: "translateX(3px)" },
              "75%": { transform: "translateX(-2px)" },
              "100%": { transform: "translateX(0)" },
            },
          }),
        "&:hover": isSelectable
          ? {
              borderColor: "text.secondary",
              transform: "translateY(-2px)",
              boxShadow: 8,
            }
          : undefined,
        "&:focus-visible": isSelectable
          ? {
              borderColor: "primary.main",
              outline: "none",
              boxShadow:
                "0 0 0 3px rgba(var(--mui-palette-primary-mainChannel) / 0.3)",
            }
          : undefined,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: headerBorderColor,
          bgcolor: headerBg,
        }}
      >
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={700}
          sx={{
            color:
              result === "correct"
                ? "success.main"
                : result === "wrong"
                  ? "error.main"
                  : "text.primary",
          }}
        >
          {label}
        </Typography>
        <Fade in={result === "correct"} timeout={300} unmountOnExit>
          <Typography variant="caption" fontWeight={500} color="success.main">
            {labels.betterLabel}
          </Typography>
        </Fade>
        <Fade in={result === "wrong"} timeout={300} unmountOnExit>
          <Typography variant="caption" fontWeight={500} color="error.main">
            {labels.worseLabel}
          </Typography>
        </Fade>
      </Box>

      {/* Molecule content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          minHeight: 240,
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ textAlign: "center", color: "text.primary" }}
        >
          {molecule.name}
        </Typography>
        <Typography
          variant="h6"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            letterSpacing: "0.05em",
          }}
        >
          {molecule.formula}
        </Typography>
        {molecule.properties && Object.keys(molecule.properties).length > 0 && (
          <Stack spacing={0.5} sx={{ mt: 1, width: "100%" }}>
            {Object.entries(molecule.properties).map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  py: 0.75,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {key}
                </Typography>
                <Typography
                  variant="caption"
                  fontFamily="var(--font-geist-mono), monospace"
                  color="text.primary"
                  fontWeight={500}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
