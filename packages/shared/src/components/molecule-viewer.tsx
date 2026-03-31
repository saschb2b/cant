"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { GLViewer } from "3dmol";

interface MoleculeViewerProps {
  /** XYZ-format string to render. */
  xyzData: string;
  /** Label shown overlaid at the bottom. */
  label: string;
  /** Optional per-element styling overrides. When omitted uses default stick+sphere. */
  atomStyles?: Record<string, { color: string }>;
}

export function MoleculeViewer({
  xyzData,
  label,
  atomStyles,
}: MoleculeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let viewer: GLViewer | null = null;
    let cancelled = false;
    let spinInterval: ReturnType<typeof setInterval> | null = null;

    void import("3dmol").then(($3Dmol) => {
      if (cancelled || !containerRef.current) return;
      viewer = $3Dmol.createViewer(containerRef.current, {});
      viewer.setBackgroundColor(0xffffff, 0);
      viewer.addModel(xyzData, "xyz");

      if (atomStyles) {
        for (const [elem, style] of Object.entries(atomStyles)) {
          viewer.setStyle(
            { elem },
            {
              stick: { radius: 0.15, color: style.color },
              sphere: { scale: 0.35, color: style.color },
            },
          );
        }
      } else {
        viewer.setStyle(
          {},
          { stick: { radius: 0.15 }, sphere: { scale: 0.3 } },
        );
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
    });

    return () => {
      cancelled = true;
      if (spinInterval) clearInterval(spinInterval);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [xyzData, atomStyles]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: 240,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          flex: 1,
          minHeight: 200,
          position: "relative",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          py: 0.5,
          px: 1,
          background:
            "linear-gradient(transparent, rgba(var(--mui-palette-background-defaultChannel) / 0.85))",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
