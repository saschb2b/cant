"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link2 } from "lucide-react";
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

interface LinkedInPreviewProps {
  data: InspectResponse;
}

export function LinkedInPreview({ data }: LinkedInPreviewProps) {
  const image = data.og.image ?? data.twitter.image ?? null;
  const title = data.og.title ?? data.title ?? "";
  const description = data.og.description ?? data.description ?? "";
  const domain = getDomain(data.finalUrl);

  return (
    <PreviewCardBase title="LinkedIn" icon={<Link2 size={16} />}>
      <Box
        sx={{
          maxWidth: 552,
          border: 1,
          borderColor: "#e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
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
              bgcolor: "#f3f2ef",
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
          <ImagePlaceholder aspectRatio="52.36%" bgcolor="#f3f2ef" />
        )}

        <Box sx={{ p: 1.5, bgcolor: "#f3f2ef" }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(0,0,0,0.9)",
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
                color: "rgba(0,0,0,0.6)",
                lineHeight: 1.4,
                mt: 0.25,
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

          <Typography
            sx={{
              fontSize: 12,
              color: "rgba(0,0,0,0.6)",
              mt: 0.5,
              textTransform: "lowercase",
            }}
          >
            {domain}
          </Typography>
        </Box>
      </Box>
    </PreviewCardBase>
  );
}
