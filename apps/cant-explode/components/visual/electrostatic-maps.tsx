"use client";

import { MoleculeViewer } from "@cant/shared/components/molecule-viewer";

// ---------------------------------------------------------------------------
// em-001: Polar vs nonpolar molecule charge distribution
// ---------------------------------------------------------------------------

const WATER_XYZ = `3
Water
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const WATER_STYLES: Record<string, { color: string }> = {
  O: { color: "#cc0000" },
  H: { color: "#3366ff" },
};

const METHANE_XYZ = `5
Methane
C   0.000   0.000   0.000
H   0.629   0.629   0.629
H  -0.629  -0.629   0.629
H  -0.629   0.629  -0.629
H   0.629  -0.629  -0.629`;

const METHANE_STYLES: Record<string, { color: string }> = {
  C: { color: "#999999" },
  H: { color: "#aaaaaa" },
};

export function WaterChargeMap() {
  return (
    <MoleculeViewer
      xyzData={WATER_XYZ}
      atomStyles={WATER_STYLES}
      label="H₂O: O is δ⁻ (red), H is δ⁺ (blue)"
    />
  );
}

export function MethaneChargeMap() {
  return (
    <MoleculeViewer
      xyzData={METHANE_XYZ}
      atomStyles={METHANE_STYLES}
      label="CH₄: uniform charge (nonpolar)"
    />
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
  H: { color: "#3366ff" },
  Cl: { color: "#cc0000" },
};

const CL2_XYZ = `2
Cl2
Cl  0.000   0.000   0.000
Cl  1.988   0.000   0.000`;

const CL2_STYLES: Record<string, { color: string }> = {
  Cl: { color: "#55aa55" },
};

export function HClPolarBond() {
  return (
    <MoleculeViewer
      xyzData={HCL_XYZ}
      atomStyles={HCL_STYLES}
      label="HCl: polar bond (H δ⁺, Cl δ⁻)"
    />
  );
}

export function Cl2NoPolar() {
  return (
    <MoleculeViewer
      xyzData={CL2_XYZ}
      atomStyles={CL2_STYLES}
      label="Cl₂: nonpolar bond (equal sharing)"
    />
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
  C: { color: "#999999" },
  O: { color: "#cc0000" },
};

const H2O_DIPOLE_XYZ = `3
Water with net dipole
O   0.000   0.000   0.000
H   0.757   0.586   0.000
H  -0.757   0.586   0.000`;

const H2O_DIPOLE_STYLES: Record<string, { color: string }> = {
  O: { color: "#cc0000" },
  H: { color: "#3366ff" },
};

export function CO2NoNetDipole() {
  return (
    <MoleculeViewer
      xyzData={CO2_XYZ}
      atomStyles={CO2_STYLES}
      label="CO₂: symmetric, no net dipole"
    />
  );
}

export function H2ONetDipole() {
  return (
    <MoleculeViewer
      xyzData={H2O_DIPOLE_XYZ}
      atomStyles={H2O_DIPOLE_STYLES}
      label="H₂O: bent, net dipole moment"
    />
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
  Na: { color: "#0044ff" },
  Cl: { color: "#ff0000" },
};

const HF_XYZ = `2
HF covalent
H   0.000   0.000   0.000
F   0.917   0.000   0.000`;

const HF_STYLES: Record<string, { color: string }> = {
  H: { color: "#7799cc" },
  F: { color: "#cc7777" },
};

export function NaClIonic() {
  return (
    <MoleculeViewer
      xyzData={NACL_XYZ}
      atomStyles={NACL_STYLES}
      label="NaCl: full charge separation (ionic)"
    />
  );
}

export function HFCovalent() {
  return (
    <MoleculeViewer
      xyzData={HF_XYZ}
      atomStyles={HF_STYLES}
      label="HF: partial charge (polar covalent)"
    />
  );
}
