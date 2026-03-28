"use client";

import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function useChargeViewer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  xyzData: string,
  atomStyles: Record<string, { color: string }>,
) {
  useEffect(() => {
    if (!containerRef.current) return;
    let viewer: any;
    let cancelled = false;

    import("3dmol").then(($3Dmol) => {
      if (cancelled || !containerRef.current) return;
      viewer = $3Dmol.createViewer(containerRef.current, {
        backgroundColor: "0x000000", backgroundAlpha: 0,
      });
      viewer.addModel(xyzData, "xyz");

      // Apply per-element coloring to visualize partial charges
      for (const [elem, style] of Object.entries(atomStyles)) {
        viewer.setStyle(
          { elem },
          {
            stick: { radius: 0.15, color: style.color },
            sphere: { scale: 0.35, color: style.color },
          },
        );
      }

      viewer.zoomTo();
      viewer.render();
    });

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [containerRef, xyzData, atomStyles]);
}

// ---------------------------------------------------------------------------
// em-001: Polar vs nonpolar molecule charge distribution
// ---------------------------------------------------------------------------

const WATER_XYZ = `3
Water
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const WATER_STYLES: Record<string, { color: string }> = {
  O: { color: "#cc0000" }, // red, electronegative (delta minus)
  H: { color: "#3366ff" }, // blue, electropositive (delta plus)
};

const METHANE_XYZ = `5
Methane
C   0.000   0.000   0.000
H   0.629   0.629   0.629
H  -0.629  -0.629   0.629
H  -0.629   0.629  -0.629
H   0.629  -0.629  -0.629`;

const METHANE_STYLES: Record<string, { color: string }> = {
  C: { color: "#999999" }, // neutral gray
  H: { color: "#aaaaaa" }, // neutral gray, nonpolar
};

export function WaterChargeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, WATER_XYZ, WATER_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        H₂O: O is δ⁻ (red), H is δ⁺ (blue)
      </Typography>
    </Box>
  );
}

export function MethaneChargeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, METHANE_XYZ, METHANE_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        CH₄: uniform charge (nonpolar)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// em-002: HCl vs Cl₂ bond polarity
// ---------------------------------------------------------------------------

const HCL_XYZ = `2
HCl
H   0.000   0.000   0.000
Cl  1.275   0.000   0.000`;

const HCL_STYLES: Record<string, { color: string }> = {
  H: { color: "#3366ff" },  // blue, electropositive
  Cl: { color: "#cc0000" }, // red, electronegative
};

const CL2_XYZ = `2
Cl2
Cl  0.000   0.000   0.000
Cl  1.988   0.000   0.000`;

const CL2_STYLES: Record<string, { color: string }> = {
  Cl: { color: "#55aa55" }, // uniform green, nonpolar
};

export function HClPolarBond() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, HCL_XYZ, HCL_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        HCl: polar bond (H δ⁺, Cl δ⁻)
      </Typography>
    </Box>
  );
}

export function Cl2NoPolar() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, CL2_XYZ, CL2_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        Cl₂: nonpolar bond (equal sharing)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// em-003: CO₂ vs H₂O polarity comparison
// ---------------------------------------------------------------------------

const CO2_XYZ = `3
CO2
C   0.000   0.000   0.000
O   1.160   0.000   0.000
O  -1.160   0.000   0.000`;

const CO2_STYLES: Record<string, { color: string }> = {
  C: { color: "#999999" }, // neutral center
  O: { color: "#cc0000" }, // red, electronegative but symmetric
};

const H2O_DIPOLE_XYZ = `3
Water with net dipole
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const H2O_DIPOLE_STYLES: Record<string, { color: string }> = {
  O: { color: "#cc0000" }, // strongly red, net negative pole
  H: { color: "#3366ff" }, // strongly blue, net positive pole
};

export function CO2NoNetDipole() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, CO2_XYZ, CO2_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        CO₂: symmetric, no net dipole
      </Typography>
    </Box>
  );
}

export function H2ONetDipole() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, H2O_DIPOLE_XYZ, H2O_DIPOLE_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        H₂O: bent, net dipole moment
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// em-004: NaCl ion pair vs HF covalent
// ---------------------------------------------------------------------------

const NACL_XYZ = `2
NaCl ion pair
Na  0.000   0.000   0.000
Cl  2.360   0.000   0.000`;

const NACL_STYLES: Record<string, { color: string }> = {
  Na: { color: "#0044ff" }, // deep blue, full cation
  Cl: { color: "#ff0000" }, // deep red, full anion
};

const HF_XYZ = `2
HF covalent
H   0.000   0.000   0.000
F   0.917   0.000   0.000`;

const HF_STYLES: Record<string, { color: string }> = {
  H: { color: "#7799cc" }, // slightly blue, partial positive
  F: { color: "#cc7777" }, // slightly red, partial negative
};

export function NaClIonic() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, NACL_XYZ, NACL_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        NaCl: full charge separation (ionic)
      </Typography>
    </Box>
  );
}

export function HFCovalent() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChargeViewer(containerRef, HF_XYZ, HF_STYLES);
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
      <Box
        ref={containerRef}
        sx={{ width: 280, height: 220, position: "relative" }}
      />
      <Typography variant="caption" color="text.secondary">
        HF: partial charge (polar covalent)
      </Typography>
    </Box>
  );
}
