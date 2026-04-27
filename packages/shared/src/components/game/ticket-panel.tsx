"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import type { LottieRefCurrentProps } from "lottie-react";
import { useAppTheme } from "../../lib/app-theme-context";
import type { TicketCardData } from "../../lib/game/types";
import { TicketCard } from "../ticket-card";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type LottieAnimationData = Record<string, unknown>;

interface TicketPanelProps {
  ticket: TicketCardData;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

function CheckmarkOverlay({
  animationData,
  extraOverlay,
}: {
  animationData: LottieAnimationData;
  extraOverlay?: ReactNode;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    lottieRef.current?.setSpeed(0.5);
  }, []);

  if (isDone) return null;

  return (
    <>
      {extraOverlay}
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        onComplete={() => {
          setIsFadingOut(true);
          setTimeout(() => setIsDone(true), 400);
        }}
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: 48,
          height: 48,
          opacity: isFadingOut ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      />
    </>
  );
}

/**
 * Game panel that renders a structured ticket card. Used by cant-ticket
 * to compare two agile work items side by side. Mirrors the shell of
 * VisualPanel and CodePanel for selection states, animations, and the
 * better/worse header pill.
 */
export function TicketPanel({
  ticket,
  label,
  isSelectable,
  onSelect,
  result,
  isSelected,
}: TicketPanelProps) {
  const { labels, styling, slots } = useAppTheme();

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
        : styling.headerBackground;

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

      <Box sx={{ flex: 1, p: 1.5, bgcolor: "background.paper" }}>
        <TicketCard data={ticket} />
      </Box>

      {result === "correct" && isSelected && slots.checkmarkAnimation && (
        <CheckmarkOverlay
          animationData={slots.checkmarkAnimation}
          extraOverlay={slots.overlaySlot}
        />
      )}
    </Paper>
  );
}
