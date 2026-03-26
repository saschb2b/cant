"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Bot } from "lucide-react";
import { PreviewCardBase } from "./preview-card-base";
import type { InspectResponse } from "./types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

interface DiscordPreviewProps {
  data: InspectResponse;
}

export function DiscordPreview({ data }: DiscordPreviewProps) {
  const borderColor = data.themeColor ?? "#5865F2";
  const siteName = data.og.siteName ?? getDomain(data.finalUrl);
  const title = data.og.title ?? data.title ?? "";
  const description = data.og.description ?? data.description ?? "";
  const image = data.og.image ?? data.twitter.image ?? null;

  return (
    <PreviewCardBase title="Discord" icon={<Bot size={16} />}>
      <Box
        sx={{
          maxWidth: 520,
          display: "flex",
          borderRadius: "4px",
          overflow: "hidden",
          bgcolor: "#2B2D31",
        }}
      >
        {/* Left color border */}
        <Box
          sx={{
            width: 4,
            flexShrink: 0,
            bgcolor: borderColor,
            borderRadius: "4px 0 0 4px",
          }}
        />

        {/* Content */}
        <Box sx={{ p: 2, flex: 1, overflow: "hidden" }}>
          <Typography
            sx={{
              fontSize: 12,
              color: "#B5BAC1",
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            {siteName}
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "#00A8FC",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#DBDEE1",
                lineHeight: 1.4,
                mt: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {description}
            </Typography>
          )}

          {/* Image constrained to reasonable height */}
          {image && (
            <Box
              sx={{
                mt: 1.5,
                borderRadius: 1,
                overflow: "hidden",
                maxWidth: 400,
                maxHeight: 200,
              }}
            >
              <Box
                component="img"
                src={image}
                alt=""
                sx={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 1,
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </PreviewCardBase>
  );
}
