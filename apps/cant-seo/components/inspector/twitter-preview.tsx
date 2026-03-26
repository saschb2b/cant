"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AtSign, Lock, ImageOff } from "lucide-react";
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

interface TwitterPreviewProps {
  data: InspectResponse;
}

export function TwitterPreview({ data }: TwitterPreviewProps) {
  const cardType = data.twitter.card ?? "summary";
  const image = data.twitter.image ?? data.og.image ?? null;
  const title = data.twitter.title ?? data.og.title ?? data.title ?? "";
  const description =
    data.twitter.description ?? data.og.description ?? data.description ?? "";
  const domain = getDomain(data.finalUrl);

  const isLargeImage = cardType === "summary_large_image";

  return (
    <PreviewCardBase title="Twitter / X" icon={<AtSign size={16} />}>
      {isLargeImage ? (
        <Box
          sx={{
            maxWidth: 504,
            borderRadius: "16px",
            border: 1,
            borderColor: "#cfd9de",
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {image ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "50%",
                overflow: "hidden",
                bgcolor: "#e1e8ed",
                borderBottom: 1,
                borderColor: "#cfd9de",
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
            <Box sx={{ borderBottom: 1, borderColor: "#cfd9de" }}>
              <ImagePlaceholder aspectRatio="50%" bgcolor="#e1e8ed" />
            </Box>
          )}

          <Box sx={{ p: 1.5 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f1419",
                lineHeight: 1.3,
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
                  fontSize: 15,
                  color: "#536471",
                  lineHeight: 1.3,
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <Lock size={12} color="#536471" />
              <Typography sx={{ fontSize: 15, color: "#536471" }}>
                {domain}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 504,
            borderRadius: "16px",
            border: 1,
            borderColor: "#cfd9de",
            overflow: "hidden",
            display: "flex",
            bgcolor: "#fff",
          }}
        >
          {image ? (
            <Box
              sx={{
                width: 130,
                minHeight: 130,
                flexShrink: 0,
                bgcolor: "#e1e8ed",
                borderRight: 1,
                borderColor: "#cfd9de",
                position: "relative",
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
            <Box
              sx={{
                width: 130,
                minHeight: 130,
                flexShrink: 0,
                borderRight: 1,
                borderColor: "#cfd9de",
                bgcolor: "#e1e8ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <ImageOff size={20} color="rgba(0,0,0,0.25)" />
              <Typography
                sx={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontWeight: 500 }}
              >
                No image
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.25,
              }}
            >
              <Lock size={12} color="#536471" />
              <Typography sx={{ fontSize: 15, color: "#536471" }}>
                {domain}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f1419",
                lineHeight: 1.3,
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
                  fontSize: 15,
                  color: "#536471",
                  lineHeight: 1.3,
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
          </Box>
        </Box>
      )}
    </PreviewCardBase>
  );
}
