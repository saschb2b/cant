"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import { createAvatar } from "@dicebear/core";
import * as bottts from "@dicebear/bottts";

const cache = new Map<string, string>();

function svgFor(seed: string): string {
  const cached = cache.get(seed);
  if (cached !== undefined) return cached;
  const svg = createAvatar(bottts, { seed, radius: 50 }).toString();
  cache.set(seed, svg);
  return svg;
}

export interface ParticipantAvatarProps {
  seed: string;
  size?: number;
  title?: string;
}

export function ParticipantAvatar({
  seed,
  size = 32,
  title,
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
        "& svg": { width: "100%", height: "100%", display: "block" },
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
