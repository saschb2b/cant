"use client";

import { MoleculeViewer } from "@cant/shared/components/molecule-viewer";

// ---------------------------------------------------------------------------
// mg-001: Water molecule geometry
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
  return <MoleculeViewer xyzData={WATER_BENT_XYZ} label="H₂O bent (104.5°)" />;
}

export function WaterLinear() {
  return (
    <MoleculeViewer xyzData={WATER_LINEAR_XYZ} label="H₂O linear (180°)" />
  );
}

// ---------------------------------------------------------------------------
// mg-002: Methane
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
  return (
    <MoleculeViewer xyzData={METHANE_TETRAHEDRAL_XYZ} label="CH₄ tetrahedral" />
  );
}

export function MethaneSquarePlanar() {
  return (
    <MoleculeViewer
      xyzData={METHANE_SQUARE_PLANAR_XYZ}
      label="CH₄ square planar"
    />
  );
}

// ---------------------------------------------------------------------------
// mg-003: Ammonia
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
  return (
    <MoleculeViewer
      xyzData={AMMONIA_PYRAMIDAL_XYZ}
      label="NH₃ trigonal pyramidal"
    />
  );
}

export function AmmoniaPlanar() {
  return (
    <MoleculeViewer xyzData={AMMONIA_PLANAR_XYZ} label="NH₃ trigonal planar" />
  );
}

// ---------------------------------------------------------------------------
// mg-004: SF₆
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
  return <MoleculeViewer xyzData={SF6_OCTAHEDRAL_XYZ} label="SF₆ octahedral" />;
}

export function SF6Trigonal() {
  return (
    <MoleculeViewer
      xyzData={SF6_TRIGONAL_PRISMATIC_XYZ}
      label="SF₆ trigonal prismatic"
    />
  );
}
