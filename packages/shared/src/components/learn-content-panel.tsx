import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { ContentMapEntry } from "./game/game";
import { codeBlockStyles } from "../lib/code-styles";
import { TicketCard } from "./ticket-card";

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
 * For molecule challenges it renders a styled chemistry card.
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
    case "ticket": {
      const ticket = side === "good" ? entry.goodTicket : entry.badTicket;
      return (
        <Box sx={{ p: 1.5 }}>
          <TicketCard data={ticket} />
        </Box>
      );
    }
    case "molecule": {
      const molecule = side === "good" ? entry.goodMolecule : entry.badMolecule;
      return (
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            gap: 1.5,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ textAlign: "center", color: "text.primary" }}
          >
            {molecule.name}
          </Typography>
          <Typography
            variant="h6"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              letterSpacing: "0.05em",
            }}
          >
            {molecule.formula}
          </Typography>
          {molecule.properties &&
            Object.keys(molecule.properties).length > 0 && (
              <Stack spacing={0.5} sx={{ mt: 1, width: "100%" }}>
                {Object.entries(molecule.properties).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 2,
                      py: 0.5,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {key}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontFamily="var(--font-geist-mono), monospace"
                      color="text.primary"
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
        </Box>
      );
    }
  }
}
