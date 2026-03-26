"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Hash } from "lucide-react";
import { PreviewCardBase } from "./preview-card-base";
import type { InspectResponse } from "./types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

interface SlackPreviewProps {
  data: InspectResponse;
}

export function SlackPreview({ data }: SlackPreviewProps) {
  const siteName = data.og.siteName ?? getDomain(data.finalUrl);
  const title = data.og.title ?? data.title ?? "";
  const description = data.og.description ?? data.description ?? "";
  const image = data.og.image ?? data.twitter.image ?? null;
  const borderColor = data.themeColor ?? "#1264a3";

  return (
    <PreviewCardBase title="Slack" icon={<Hash size={16} />}>
      <Box
        sx={{
          maxWidth: 560,
          display: "flex",
          borderLeft: `4px solid ${borderColor}`,
          bgcolor: "background.paper",
          borderRadius: "0 4px 4px 0",
          p: 1.5,
          gap: 2,
        }}
      >
        {/* Text content */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "text.secondary",
              lineHeight: 1.4,
              mb: 0.25,
            }}
          >
            {siteName}
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1264a3",
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                fontSize: 15,
                color: "text.secondary",
                lineHeight: 1.46,
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
        </Box>

        {/* Thumbnail */}
        {image && (
          <Box
            sx={{
              width: 80,
              height: 80,
              flexShrink: 0,
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "#f0f0f0",
            }}
          >
            <Box
              component="img"
              src={image}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Box>
        )}
      </Box>
    </PreviewCardBase>
  );
}
