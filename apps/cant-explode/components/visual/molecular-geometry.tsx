"use client";

import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function use3DmolViewer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  xyzData: string,
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
      viewer.setStyle(
        {},
        { stick: { radius: 0.15 }, sphere: { scale: 0.3 } },
      );
      viewer.zoomTo();
      viewer.render();
    });

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [containerRef, xyzData]);
}

// ---------------------------------------------------------------------------
// mg-001: Water molecule geometry — bent vs linear
// ---------------------------------------------------------------------------

const WATER_BENT_XYZ = `3
Water - bent 104.5 degrees
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const WATER_LINEAR_XYZ = `3
Water - linear 180 degrees
O   0.000   0.000   0.000
H   0.960   0.000   0.000
H  -0.960   0.000   0.000`;

export function WaterBent() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, WATER_BENT_XYZ);
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
        H₂O bent (104.5°)
      </Typography>
    </Box>
  );
}

export function WaterLinear() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, WATER_LINEAR_XYZ);
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
        H₂O linear (180°)
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// mg-002: Methane — tetrahedral vs square planar
// ---------------------------------------------------------------------------

const METHANE_TETRAHEDRAL_XYZ = `5
Methane - tetrahedral
C   0.000   0.000   0.000
H   0.629   0.629   0.629
H  -0.629  -0.629   0.629
H  -0.629   0.629  -0.629
H   0.629  -0.629  -0.629`;

const METHANE_SQUARE_PLANAR_XYZ = `5
Methane - square planar
C   0.000   0.000   0.000
H   1.090   0.000   0.000
H   0.000   1.090   0.000
H  -1.090   0.000   0.000
H   0.000  -1.090   0.000`;

export function MethaneTetrahedral() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, METHANE_TETRAHEDRAL_XYZ);
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
        CH₄ tetrahedral
      </Typography>
    </Box>
  );
}

export function MethaneSquarePlanar() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, METHANE_SQUARE_PLANAR_XYZ);
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
        CH₄ square planar
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// mg-003: Ammonia — trigonal pyramidal vs trigonal planar
// ---------------------------------------------------------------------------

const AMMONIA_PYRAMIDAL_XYZ = `4
Ammonia - trigonal pyramidal
N   0.000   0.000   0.000
H   0.940   0.000  -0.330
H  -0.470   0.815  -0.330
H  -0.470  -0.815  -0.330`;

const AMMONIA_PLANAR_XYZ = `4
Ammonia - trigonal planar
N   0.000   0.000   0.000
H   1.010   0.000   0.000
H  -0.505   0.875   0.000
H  -0.505  -0.875   0.000`;

export function AmmoniaPyramidal() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, AMMONIA_PYRAMIDAL_XYZ);
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
        NH₃ trigonal pyramidal
      </Typography>
    </Box>
  );
}

export function AmmoniaPlanar() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, AMMONIA_PLANAR_XYZ);
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
        NH₃ trigonal planar
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// mg-004: SF₆ — octahedral vs trigonal prismatic
// ---------------------------------------------------------------------------

const SF6_OCTAHEDRAL_XYZ = `7
SF6 - octahedral
S   0.000   0.000   0.000
F   1.560   0.000   0.000
F  -1.560   0.000   0.000
F   0.000   1.560   0.000
F   0.000  -1.560   0.000
F   0.000   0.000   1.560
F   0.000   0.000  -1.560`;

const SF6_TRIGONAL_PRISMATIC_XYZ = `7
SF6 - trigonal prismatic
S   0.000   0.000   0.000
F   1.350   0.000   0.780
F  -0.675   1.169   0.780
F  -0.675  -1.169   0.780
F   1.350   0.000  -0.780
F  -0.675   1.169  -0.780
F  -0.675  -1.169  -0.780`;

export function SF6Octahedral() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, SF6_OCTAHEDRAL_XYZ);
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
        SF₆ octahedral
      </Typography>
    </Box>
  );
}

export function SF6Trigonal() {
  const containerRef = useRef<HTMLDivElement>(null);
  use3DmolViewer(containerRef, SF6_TRIGONAL_PRISMATIC_XYZ);
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
        SF₆ trigonal prismatic
      </Typography>
    </Box>
  );
}
