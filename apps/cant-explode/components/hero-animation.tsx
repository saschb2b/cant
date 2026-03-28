"use client";

import { useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MOLECULES = [
  "H\u2082O",
  "CO\u2082",
  "NaCl",
  "C\u2086H\u2086",
  "NH\u2083",
  "CH\u2084",
  "H\u2082SO\u2084",
  "C\u2082H\u2085OH",
  "O\u2082",
  "N\u2082",
  "HCl",
  "NaOH",
  "Fe\u2082O\u2083",
  "CaCO\u2083",
];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function HeroAnimation() {
  const mounted = useIsMounted();

  if (!mounted) return <Box sx={{ width: 280, height: 200 }} />;

  return (
    <Box
      sx={{
        position: "relative",
        width: 280,
        height: 200,
        overflow: "hidden",
      }}
    >
      {MOLECULES.map((formula, i) => (
        <Typography
          key={formula}
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{
            position: "absolute",
            color: "primary.main",
            opacity: 0.15 + (i % 3) * 0.1,
            fontSize: 12 + (i % 4) * 4,
            fontWeight: 600,
            left: `${String((i * 47) % 85)}%`,
            top: `${String((i * 31) % 80)}%`,
            animation: `floatMolecule ${String(3 + (i % 3))}s ease-in-out ${String(i * 0.4)}s infinite alternate`,
            "@keyframes floatMolecule": {
              "0%": { transform: "translateY(0px)" },
              "100%": {
                transform: `translateY(${String(-8 - (i % 3) * 4)}px)`,
              },
            },
          }}
        >
          {formula}
        </Typography>
      ))}
    </Box>
  );
}
