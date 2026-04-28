"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChevronDown, Coffee } from "lucide-react";
import { DECK_GUIDE } from "@/lib/poker/deck";

export function DeckCheatSheet() {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "transparent",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={16} />}
        sx={{
          minHeight: 0,
          px: 0,
          "& .MuiAccordionSummary-content": { my: 0.5 },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          What do these mean?
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 1, pb: 0 }}>
        <Stack component="dl" spacing={1} sx={{ m: 0, "& dt, & dd": { m: 0 } }}>
          {DECK_GUIDE.map((row) => (
            <Box
              key={row.value}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "2.25rem 1fr",
                  sm: "2.5rem 6rem 1fr",
                },
                columnGap: { xs: 1.5, sm: 2 },
                rowGap: 0.25,
                alignItems: "baseline",
              }}
            >
              <Typography
                component="dt"
                variant="body2"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ textAlign: "center" }}
              >
                {row.value === "coffee" ? (
                  <Coffee size={16} style={{ verticalAlign: "middle" }} />
                ) : (
                  row.value
                )}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                fontWeight={600}
                sx={{ gridColumn: { xs: "2", sm: "auto" } }}
              >
                {row.label}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                color="text.secondary"
                sx={{ gridColumn: { xs: "2", sm: "auto" } }}
              >
                {row.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
