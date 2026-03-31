"use client";

import { PdbViewer } from "@cant/shared/components/pdb-viewer";

/* ==========================================================================
 * Real PDB structures from RCSB:
 *
 * 2RNM - short alpha-helical peptide (melittin fragment)
 * 1ICO - concanavalin A lectin, rich in beta sheets
 * 1BNA - Dickerson B-DNA dodecamer (classic DNA structure)
 * 1CRN - crambin, small protein with both helix and sheet
 * ========================================================================== */

/* ---------- Style definitions ---------- */

const HELIX_CARTOON = [
  { selector: {}, style: { cartoon: { color: "0xe53935" } } },
];

const SHEET_CARTOON = [
  { selector: {}, style: { cartoon: { color: "0x1e88e5" } } },
];

const DNA_DOUBLE_STICK = [
  {
    selector: { chain: "A" },
    style: { stick: { radius: 0.15, color: "0xe53935" } },
  },
  {
    selector: { chain: "B" },
    style: { stick: { radius: 0.15, color: "0x1e88e5" } },
  },
];

const DNA_SINGLE_STICK = [
  {
    selector: { chain: "A" },
    style: { stick: { radius: 0.15, color: "0xe53935" } },
  },
  { selector: { chain: "B" }, style: { stick: { radius: 0 } } },
];

const TERTIARY_CARTOON = [
  { selector: { ss: "h" }, style: { cartoon: { color: "0xe53935" } } },
  { selector: { ss: "s" }, style: { cartoon: { color: "0x1e88e5" } } },
  { selector: { ss: "c" }, style: { cartoon: { color: "0x90a4ae" } } },
];

const BACKBONE_STICK = [
  { selector: {}, style: { stick: { radius: 0.1, colorscheme: "Jmol" } } },
];

const SPECTRUM_CARTOON = [
  { selector: {}, style: { cartoon: { color: "spectrum" } } },
];

const SPHERE_FILL = [
  { selector: {}, style: { sphere: { radius: 0.8, colorscheme: "Jmol" } } },
];

/* ==========================================================================
 * EXPORTED COMPONENTS
 * ========================================================================== */

/* ps-001: Alpha helix vs Beta sheet */

export function AlphaHelixStructure() {
  return (
    <PdbViewer
      pdbId="2RNM"
      styles={HELIX_CARTOON}
      label="Alpha helix"
      sublabel="H-bonds along the chain (i to i+4)"
    />
  );
}

export function BetaSheetStructure() {
  return (
    <PdbViewer
      pdbId="1ICO"
      styles={SHEET_CARTOON}
      label="Beta sheet"
      sublabel="H-bonds between adjacent strands"
    />
  );
}

/* ps-002: DNA double helix vs single strand */

export function DnaDoubleHelix() {
  return (
    <PdbViewer
      pdbId="1BNA"
      styles={DNA_DOUBLE_STICK}
      label="Double-stranded DNA"
      sublabel="Two complementary strands form the double helix"
    />
  );
}

export function DnaSingleStrand() {
  return (
    <PdbViewer
      pdbId="1BNA"
      styles={DNA_SINGLE_STICK}
      label="Single-stranded DNA"
      sublabel="One strand, no base pairing"
    />
  );
}

/* ps-003: Tertiary (cartoon) vs Primary (stick) */

export function TertiaryStructure() {
  return (
    <PdbViewer
      pdbId="1CRN"
      styles={TERTIARY_CARTOON}
      label="Tertiary structure (3D fold)"
      sublabel="Helices, sheets, and loops folded together"
    />
  );
}

export function PrimaryStructure() {
  return (
    <PdbViewer
      pdbId="1CRN"
      styles={BACKBONE_STICK}
      label="Primary structure (backbone)"
      sublabel="Same protein shown as individual atoms"
    />
  );
}

/* ps-004: Cartoon (ribbon) vs space-filling (sphere) */

export function ProteinCartoon() {
  return (
    <PdbViewer
      pdbId="1CRN"
      styles={SPECTRUM_CARTOON}
      label="Cartoon (ribbon) model"
      sublabel="Shows secondary structure elements"
    />
  );
}

export function ProteinSphereFill() {
  return (
    <PdbViewer
      pdbId="1CRN"
      styles={SPHERE_FILL}
      label="Space-filling model"
      sublabel="Shows atom sizes, hides fold"
    />
  );
}
