"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ChevronDown } from "lucide-react";
import type { InspectResponse } from "./types";

interface MetadataTableProps {
  data: InspectResponse;
}

export function MetadataTable({ data }: MetadataTableProps) {
  const metaCount = data.allMetaTags.length;
  const hasJsonLd = data.jsonLd.length > 0;

  // Show a preview of key tags in the accordion header
  const ogCount = data.allMetaTags.filter((t) =>
    t.property?.startsWith("og:"),
  ).length;
  const twitterCount = data.allMetaTags.filter((t) =>
    t.name?.startsWith("twitter:"),
  ).length;
  const otherCount = metaCount - ogCount - twitterCount;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>All Meta Tags</Typography>
            <Chip
              label={String(metaCount)}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            />
            {ogCount > 0 && (
              <Chip
                label={`${String(ogCount)} OG`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
            {twitterCount > 0 && (
              <Chip
                label={`${String(twitterCount)} Twitter`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
            {otherCount > 0 && (
              <Chip
                label={`${String(otherCount)} other`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {metaCount > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.allMetaTags.map((tag, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          wordBreak: "break-all",
                        }}
                      >
                        {tag.property
                          ? `property="${tag.property}"`
                          : `name="${tag.name ?? ""}"`}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, wordBreak: "break-all" }}>
                        {tag.content}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              No meta tags found.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {hasJsonLd && (
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ChevronDown size={20} />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ fontWeight: 600 }}>
                JSON-LD Structured Data
              </Typography>
              <Chip
                label={String(data.jsonLd.length)}
                size="small"
                color="success"
                sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {data.jsonLd.map((item, index) => (
              <Box
                key={index}
                component="pre"
                sx={{
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  p: 2,
                  overflow: "auto",
                  fontSize: 13,
                  fontFamily: "monospace",
                  mb: index < data.jsonLd.length - 1 ? 2 : 0,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <code>{JSON.stringify(item, null, 2)}</code>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
