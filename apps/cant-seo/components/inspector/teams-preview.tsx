"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Users } from "lucide-react";
import { PreviewCardBase } from "./preview-card-base";
import { ImagePlaceholder } from "./image-placeholder";
import type { InspectResponse } from "./types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

interface TeamsPreviewProps {
  data: InspectResponse;
}

export function TeamsPreview({ data }: TeamsPreviewProps) {
  const image = data.og.image ?? data.twitter.image ?? null;
  const title = data.og.title ?? data.title ?? "";
  const description = data.og.description ?? data.description ?? "";
  const domain = getDomain(data.finalUrl);

  return (
    <PreviewCardBase title="Microsoft Teams" icon={<Users size={16} />}>
      <Box
        sx={{
          maxWidth: 400,
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
          bgcolor: "#fff",
        }}
      >
        {image ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "52.36%",
              overflow: "hidden",
              bgcolor: "#f0f0f0",
            }}
          >
            <Box
              component="img"
              src={image}
              alt=""
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Box>
        ) : (
          <ImagePlaceholder aspectRatio="52.36%" />
        )}

        <Box sx={{ p: 1.5 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#242424",
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                fontSize: 12,
                color: "#616161",
                lineHeight: 1.4,
                mt: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {description}
            </Typography>
          )}

          <Typography sx={{ fontSize: 12, color: "#a0a0a0", mt: 0.75 }}>
            {domain}
          </Typography>
        </Box>
      </Box>
    </PreviewCardBase>
  );
}
