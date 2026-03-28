"use client";

import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 250;

function useColorScheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function useSmilesDrawer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  smiles: string,
) {
  const isDark = useColorScheme();
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
  }, [canvasRef, smiles, isDark]);
}

// ---------------------------------------------------------------------------
// fg-001: Reactivity with NaOH — Carboxylic acid vs Alcohol
// ---------------------------------------------------------------------------

export function CarboxylicAcidStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CC(=O)O");
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
        Acetic acid (carboxylic acid)
      </Typography>
    </Box>
  );
}

export function AlcoholStructure() {
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
        Ethanol (alcohol)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// fg-002: Nucleophilic addition — Aldehyde vs Ketone
// ---------------------------------------------------------------------------

export function AldehydeStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CC=O");
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
        Acetaldehyde (aldehyde)
      </Typography>
    </Box>
  );
}

export function KetoneStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CC(=O)C");
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
        Acetone (ketone)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// fg-003: Basicity — Amine vs Amide
// ---------------------------------------------------------------------------

export function AmineStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CN");
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
        Methylamine (primary amine)
      </Typography>
    </Box>
  );
}

export function AmideStructure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useSmilesDrawer(ref, "CC(=O)N");
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
        Acetamide (amide)
      </Typography>
    </Box>
  );
}
