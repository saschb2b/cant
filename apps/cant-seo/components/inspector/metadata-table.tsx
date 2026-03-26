"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Meta Tags */}
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
          <Typography sx={{ fontWeight: 600 }}>
            All Meta Tags ({metaCount})
          </Typography>
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
                      <TableCell
                        sx={{
                          fontSize: 13,
                          wordBreak: "break-all",
                        }}
                      >
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

      {/* JSON-LD */}
      {hasJsonLd && (
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ChevronDown size={20} />}>
            <Typography sx={{ fontWeight: 600 }}>
              JSON-LD Structured Data ({data.jsonLd.length})
            </Typography>
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
