"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface PdbStyle {
  selector: Record<string, unknown>;
  style: Record<string, unknown>;
}

interface PdbViewerBaseProps {
  /** Visual styles applied in order. */
  styles: PdbStyle[];
  /** Label shown below the viewer. */
  label: string;
  /** Optional sublabel. */
  sublabel?: string;
  /** Viewer width in pixels. */
  width?: number;
  /** Viewer height in pixels. */
  height?: number;
}

interface PdbViewerInlineProps extends PdbViewerBaseProps {
  /** PDB-format string to render. */
  pdbData: string;
  pdbId?: never;
}

interface PdbViewerFetchProps extends PdbViewerBaseProps {
  /** RCSB PDB ID to fetch (e.g. "1BNA"). */
  pdbId: string;
  pdbData?: never;
}

type PdbViewerProps = PdbViewerInlineProps | PdbViewerFetchProps;

const pdbCache = new Map<string, string>();

async function fetchPdb(pdbId: string): Promise<string> {
  const cached = pdbCache.get(pdbId);
  if (cached) return cached;

  const url = `https://files.rcsb.org/download/${pdbId}.pdb`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch PDB ${pdbId}: ${String(res.status)}`);
  const text = await res.text();
  pdbCache.set(pdbId, text);
  return text;
}

export function PdbViewer({
  pdbData,
  pdbId,
  styles,
  label,
  sublabel,
  width = 260,
  height = 200,
}: PdbViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(!!pdbId);

  useEffect(() => {
    let viewer: ReturnType<(typeof import("3dmol"))["createViewer"]> | null =
      null;
    let cancelled = false;
    let spinInterval: ReturnType<typeof setInterval> | null = null;

    async function init() {
      const [$3Dmol, data] = await Promise.all([
        import("3dmol"),
        pdbId ? fetchPdb(pdbId) : Promise.resolve(pdbData!),
      ]);

      if (cancelled || !containerRef.current) return;
      setLoading(false);

      viewer = $3Dmol.createViewer(containerRef.current, {});
      viewer.setBackgroundColor(0xffffff, 0);

      viewer.addModel(data, "pdb");

      for (const { selector, style } of styles) {
        viewer.setStyle(selector, style);
      }

      viewer.zoomTo();
      viewer.render();

      spinInterval = setInterval(() => {
        if (viewer) {
          try {
            viewer.rotate(2, "y");
            viewer.rotate(0.5, "x");
            viewer.render();
          } catch {
            // viewer may be disposed
          }
        }
      }, 30);
    }

    void init();

    return () => {
      cancelled = true;
      if (spinInterval) clearInterval(spinInterval);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [pdbData, pdbId, styles]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", width, height }}>
        <div
          ref={containerRef}
          style={{ width, height, position: "relative" }}
        />
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 600,
          color: "text.secondary",
          textAlign: "center",
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
      {sublabel && (
        <Typography
          sx={{
            fontSize: 8,
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          {sublabel}
        </Typography>
      )}
    </Box>
  );
}
