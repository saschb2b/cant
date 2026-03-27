import Image from "next/image";
import Box from "@mui/material/Box";
import type { ContentMapEntry } from "./game/game";
import { codeBlockStyles } from "../lib/code-styles";

interface LearnContentPanelProps {
  /** The content entry for this challenge from the content map. */
  entry: ContentMapEntry | undefined;
  /** Which side to render: "good" or "bad". */
  side: "good" | "bad";
}

/**
 * Renders the content area of a learn-page challenge card.
 *
 * For code challenges this outputs syntax-highlighted HTML (same as before).
 * For image challenges it renders a responsive `next/image`.
 * For visual challenges it renders a placeholder (apps provide their own registry).
 */
export function LearnContentPanel({ entry, side }: LearnContentPanelProps) {
  if (!entry) return null;
  switch (entry.type) {
    case "code": {
      const html = side === "good" ? entry.goodHtml : entry.badHtml;
      return (
        <Box sx={codeBlockStyles} dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    case "image": {
      const src = side === "good" ? entry.goodImage : entry.badImage;
      const alt =
        side === "good"
          ? (entry.goodImageAlt ?? "Preferred approach")
          : (entry.badImageAlt ?? "Approach to avoid");
      return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 600px) 100vw, 50vw"
            style={{ width: "100%", height: "auto", borderRadius: 4 }}
          />
        </Box>
      );
    }
    case "visual": {
      const componentId =
        side === "good" ? entry.goodComponentId : entry.badComponentId;
      return (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            color: "text.secondary",
            typography: "body2",
          }}
          data-component-id={componentId}
        >
          {/* Apps mount their component registry here via a wrapper */}
          Visual component: {componentId}
        </Box>
      );
    }
  }
}
