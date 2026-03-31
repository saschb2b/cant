"use client";

import { SmilesCanvas } from "@cant/shared/components/smiles-canvas";

// ---------------------------------------------------------------------------
// ms-001: Aromatic vs non-aromatic stability
// ---------------------------------------------------------------------------

export function BenzeneAromatic() {
  return <SmilesCanvas smiles="c1ccccc1" label="Benzene (aromatic)" />;
}

export function CyclohexadieneNonAromatic() {
  return (
    <SmilesCanvas
      smiles="C1=CC=CCC1"
      label="1,3-Cyclohexadiene (non-aromatic)"
    />
  );
}

// ---------------------------------------------------------------------------
// ms-003: Carbocation stability
// ---------------------------------------------------------------------------

export function TertButylCation() {
  return (
    <SmilesCanvas smiles="CC([CH2+])C" label="Tert-butyl cation (tertiary)" />
  );
}

export function MethylCation() {
  return <SmilesCanvas smiles="[CH3+]" label="Methyl cation (primary)" />;
}

// ---------------------------------------------------------------------------
// ms-004: Ring strain
// ---------------------------------------------------------------------------

export function CyclohexaneRing() {
  return <SmilesCanvas smiles="C1CCCCC1" label="Cyclohexane (no strain)" />;
}

export function CyclopropaneRing() {
  return <SmilesCanvas smiles="C1CC1" label="Cyclopropane (ring strain)" />;
}
