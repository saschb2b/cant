"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ImageOff } from "lucide-react";

interface ImagePlaceholderProps {
  /** Aspect ratio as paddingTop percentage (e.g. "52.36%" for 1.91:1) */
  aspectRatio: string;
  /** Background color for the placeholder */
  bgcolor?: string;
}

export function ImagePlaceholder({
  aspectRatio,
  bgcolor = "#f0f0f0",
}: ImagePlaceholderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: aspectRatio,
        bgcolor,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          border: "2px dashed",
          borderColor: "rgba(0,0,0,0.15)",
          m: 0.5,
          borderRadius: 1,
        }}
      >
        <ImageOff size={24} color="rgba(0,0,0,0.25)" />
        <Typography
          sx={{
            fontSize: 11,
            color: "rgba(0,0,0,0.35)",
            fontWeight: 500,
            textAlign: "center",
            px: 1,
          }}
        >
          No og:image found
        </Typography>
      </Box>
    </Box>
  );
}
