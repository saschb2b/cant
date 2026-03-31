"use client";

import { SmilesCanvas } from "@cant/shared/components/smiles-canvas";

// ---------------------------------------------------------------------------
// sf-001: Benzene representation
// ---------------------------------------------------------------------------

export function BenzeneKekule() {
  return (
    <SmilesCanvas
      smiles="C1=CC=CC=C1"
      label="Kekulé structure with alternating double bonds"
    />
  );
}

export function BenzeneDelocalized() {
  return (
    <SmilesCanvas
      smiles="c1ccccc1"
      label="Aromatic ring with delocalized electrons"
    />
  );
}

// ---------------------------------------------------------------------------
// sf-002: Ethanol vs dimethyl ether (same formula C2H6O)
// ---------------------------------------------------------------------------

export function EthanolStructure() {
  return <SmilesCanvas smiles="CCO" label="Ethanol (CH3CH2OH)" />;
}

export function DimethylEtherStructure() {
  return <SmilesCanvas smiles="COC" label="Dimethyl ether (CH3OCH3)" />;
}

// ---------------------------------------------------------------------------
// sf-003: Cis vs trans 2-butene
// ---------------------------------------------------------------------------

export function Cis2Butene() {
  return <SmilesCanvas smiles="C/C=C\C" label="cis-2-Butene (Z isomer)" />;
}

export function Trans2Butene() {
  return <SmilesCanvas smiles="C/C=C/C" label="trans-2-Butene (E isomer)" />;
}

// ---------------------------------------------------------------------------
// sf-004: Glucose open chain vs ring form
// ---------------------------------------------------------------------------

export function GlucoseOpenChain() {
  return (
    <SmilesCanvas
      smiles="OC[C@@H](O)[C@H](O)[C@@H](O)[C@@H](O)C=O"
      label="D-Glucose open-chain (Fischer projection)"
    />
  );
}

export function GlucoseRingForm() {
  return (
    <SmilesCanvas
      smiles="OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O"
      label="D-Glucopyranose (Haworth ring form)"
    />
  );
}
