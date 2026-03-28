"use client";

import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 250;

function useSmilesDrawer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  smiles: string,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${String(CANVAS_WIDTH)}px`;
    canvas.style.height = `${String(CANVAS_HEIGHT)}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    void import("smiles-drawer").then((mod) => {
      if (cancelled) return;
      const SmilesDrawer =
        (mod.default as typeof import("smiles-drawer") | undefined) ?? mod;
      const isDark = document.documentElement.classList.contains("dark");
      const bondColor = isDark ? "#ffffff" : "#000000";
      const drawer = new SmilesDrawer.Drawer({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        themes: {
          dark: {
            C: "#ffffff",
            O: "#ff6666",
            N: "#6699ff",
            S: "#ffcc33",
            F: "#66ff66",
            Cl: "#66ff66",
            Br: "#cc6633",
            I: "#cc66ff",
            H: "#cccccc",
            BACKGROUND: "transparent",
          },
          light: {
            C: "#000000",
            O: "#cc0000",
            N: "#0033cc",
            S: "#cc9900",
            F: "#009900",
            Cl: "#009900",
            Br: "#993300",
            I: "#6600cc",
            H: "#666666",
            BACKGROUND: "transparent",
          },
        },
        bondThickness: isDark ? 2 : 1.5,
      });
      SmilesDrawer.parse(
        smiles,
        (tree: unknown) => {
          if (!cancelled) {
            drawer.draw(tree, canvas, isDark ? "dark" : "light", false);
          }
        },
        () => {
          // parse error, silently ignore
        },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [canvasRef, smiles]);
}

// ---------------------------------------------------------------------------
// sf-001: Benzene representation
// ---------------------------------------------------------------------------

export function BenzeneKekule() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "C1=CC=CC=C1");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        Kekul&eacute; structure with alternating double bonds
      </Typography>
    </Box>
  );
}

export function BenzeneDelocalized() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "c1ccccc1");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        Aromatic ring with delocalized electrons
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// sf-002: Ethanol vs dimethyl ether (same formula C2H6O)
// ---------------------------------------------------------------------------

export function EthanolStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CCO");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        Ethanol (CH3CH2OH)
      </Typography>
    </Box>
  );
}

export function DimethylEtherStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "COC");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        Dimethyl ether (CH3OCH3)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// sf-003: Cis vs trans 2-butene
// ---------------------------------------------------------------------------

export function Cis2Butene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "C/C=C\\C");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        cis-2-Butene (Z isomer)
      </Typography>
    </Box>
  );
}

export function Trans2Butene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "C/C=C/C");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        trans-2-Butene (E isomer)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// sf-004: Glucose open chain vs ring form
// ---------------------------------------------------------------------------

export function GlucoseOpenChain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "OC[C@@H](O)[C@H](O)[C@@H](O)[C@@H](O)C=O");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        D-Glucose open-chain (Fischer projection)
      </Typography>
    </Box>
  );
}

export function GlucoseRingForm() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <canvas ref={ref} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        D-Glucopyranose (Haworth ring form)
      </Typography>
    </Box>
  );
}
