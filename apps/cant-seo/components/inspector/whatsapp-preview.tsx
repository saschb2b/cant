"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MessageCircle } from "lucide-react";
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

interface WhatsAppPreviewProps {
  data: InspectResponse;
}

export function WhatsAppPreview({ data }: WhatsAppPreviewProps) {
  const image = data.og.image ?? data.twitter.image ?? null;
  const title = data.og.title ?? data.title ?? "";
  const description = data.og.description ?? data.description ?? "";
  const domain = getDomain(data.finalUrl);

  return (
    <PreviewCardBase title="WhatsApp" icon={<MessageCircle size={16} />}>
      <Box
        sx={{
          maxWidth: 400,
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
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
              bgcolor: "#e9edef",
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
          <ImagePlaceholder aspectRatio="52.36%" bgcolor="#e9edef" />
        )}

        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#111b21",
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
                fontSize: 13,
                color: "#667781",
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
              color: "#25D366",
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
