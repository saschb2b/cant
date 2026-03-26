"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Search } from "lucide-react";
import { PreviewCardBase } from "./preview-card-base";
import type { InspectResponse } from "./types";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getBreadcrumbUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return parsed.hostname;
    return `${parsed.hostname} > ${parts.join(" > ")}`;
  } catch {
    return url;
  }
}

interface GooglePreviewProps {
  data: InspectResponse;
}

export function GooglePreview({ data }: GooglePreviewProps) {
  const title = data.og.title ?? data.title ?? data.finalUrl;
  const description = data.og.description ?? data.description ?? "";
  const displayUrl = data.canonical ?? data.finalUrl;
  const domain = getDomain(displayUrl);
  const favicon = data.favicon;

  return (
    <PreviewCardBase title="Google" icon={<Search size={16} />}>
      <Box sx={{ maxWidth: 600 }}>
        {/* URL line with favicon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {favicon ? (
            <Box
              component="img"
              src={favicon}
              alt=""
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                flexShrink: 0,
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: "#dadce0",
                flexShrink: 0,
              }}
            />
          )}
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                color: "#202124",
                lineHeight: 1.3,
              }}
            >
              {domain}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "#4d5156",
                lineHeight: 1.3,
              }}
            >
              {getBreadcrumbUrl(displayUrl)}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: 20,
            color: "#1a0dab",
            lineHeight: 1.3,
            mb: 0.5,
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

        {/* Description */}
        {description && (
          <Typography
            sx={{
              fontSize: 14,
              color: "#4d5156",
              lineHeight: 1.58,
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
      </Box>
    </PreviewCardBase>
  );
}
