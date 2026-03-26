"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { CheckCircle2, XCircle } from "lucide-react";
import type { InspectResponse } from "./types";

interface SeoScoreProps {
  data: InspectResponse;
}

interface CheckItem {
  label: string;
  present: boolean;
}

export function SeoScore({ data }: SeoScoreProps) {
  const checks: CheckItem[] = [
    { label: "title", present: data.title !== null },
    { label: "description", present: data.description !== null },
    { label: "og:title", present: data.og.title !== null },
    { label: "og:description", present: data.og.description !== null },
    { label: "og:image", present: data.og.image !== null },
    { label: "og:type", present: data.og.type !== null },
    { label: "twitter:card", present: data.twitter.card !== null },
    { label: "twitter:image", present: data.twitter.image !== null },
    { label: "canonical", present: data.canonical !== null },
    { label: "robots", present: data.robots !== null },
    { label: "favicon", present: data.favicon !== null },
    { label: "structured data", present: data.jsonLd.length > 0 },
  ];

  const found = checks.filter((c) => c.present).length;
  const total = checks.length;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          SEO Checklist
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: found === total ? "success.main" : "warning.main",
          }}
        >
          {found}/{total} elements found
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 1,
        }}
      >
        {checks.map((check) => (
          <Chip
            key={check.label}
            icon={
              check.present ? <CheckCircle2 size={18} /> : <XCircle size={18} />
            }
            label={check.label}
            variant="outlined"
            color={check.present ? "success" : "error"}
            sx={{
              justifyContent: "flex-start",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}
