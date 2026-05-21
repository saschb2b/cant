"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@emotion/react";
import { createAvatar } from "@dicebear/core";
import * as bigSmile from "@dicebear/big-smile";

const cache = new Map<string, string>();

function svgFor(seed: string): string {
  const cached = cache.get(seed);
  if (cached !== undefined) return cached;
  const svg = createAvatar(bigSmile, { seed, radius: 50 }).toString();
  cache.set(seed, svg);
  return svg;
}

const thinkingAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const votedAnim = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

const coffeeAnim = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const unsureAnim = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-6deg); }
  75% { transform: rotate(6deg); }
`;

const outlierAnim = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(-1.5px) rotate(-4deg); }
  60% { transform: translateX(1.5px) rotate(4deg); }
`;

const revealPop = keyframes`
  0% { transform: scale(0.92); }
  60% { transform: scale(1.06); }
  100% { transform: scale(1); }
`;

export type AvatarState =
  | "thinking"
  | "voted"
  | "settled"
  | "coffee"
  | "unsure"
  | "outlier"
  | "spectator"
  | "static";

const ANIMATION_BY_STATE: Record<AvatarState, string | null> = {
  thinking: `${thinkingAnim} 1.8s ease-in-out infinite`,
  voted: `${votedAnim} 2.4s ease-in-out infinite`,
  settled: `${revealPop} 0.45s ease-out`,
  coffee: `${coffeeAnim} 3.2s ease-in-out infinite`,
  unsure: `${unsureAnim} 1.6s ease-in-out infinite`,
  outlier: `${outlierAnim} 0.9s ease-in-out infinite`,
  spectator: null,
  static: null,
};

export interface ParticipantAvatarProps {
  seed: string;
  size?: number;
  title?: string;
  state?: AvatarState;
}

export function ParticipantAvatar({
  seed,
  size = 32,
  title,
  state = "thinking",
}: ParticipantAvatarProps) {
  const svg = useMemo(() => svgFor(seed), [seed]);
  return (
    <Box
      role="img"
      aria-label={title ?? `${seed} avatar`}
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        bgcolor: "action.hover",
        borderRadius: "50%",
        display: "block",
        transformOrigin: "center",
        animation: ANIMATION_BY_STATE[state],
        opacity: state === "spectator" ? 0.55 : 1,
        filter: state === "spectator" ? "grayscale(0.4)" : "none",
        "& svg": { width: "100%", height: "100%", display: "block" },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
