"use client";

import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 250;

/** Minimal type surface for the smiles-drawer library (untyped). */
interface SmilesDrawerModule {
  Drawer: new (options: Record<string, unknown>) => SmilesDrawerInstance;
  parse: (
    smiles: string,
    onSuccess: (tree: unknown) => void,
    onError: () => void,
  ) => void;
  default?: SmilesDrawerModule;
}

interface SmilesDrawerInstance {
  draw: (
    tree: unknown,
    canvas: HTMLCanvasElement,
    theme: string,
    debug: boolean,
  ) => void;
}

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

interface SmilesCanvasProps {
  /** SMILES notation string to render. */
  smiles: string;
  /** Caption shown below the structure. */
  label: string;
  /** Canvas width in CSS pixels. Defaults to 300. */
  width?: number;
  /** Canvas height in CSS pixels. Defaults to 250. */
  height?: number;
}

export function SmilesCanvas({
  smiles,
  label,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SmilesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useColorScheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${String(width)}px`;
    canvas.style.height = `${String(height)}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    void import("smiles-drawer").then((rawMod: unknown) => {
      if (cancelled) return;
      const mod = rawMod as SmilesDrawerModule;
      const SmilesDrawer = mod.default ?? mod;
      const drawer = new SmilesDrawer.Drawer({
        width,
        height,
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
  }, [smiles, isDark, width, height]);

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
      <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
