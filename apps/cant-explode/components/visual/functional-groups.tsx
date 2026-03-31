"use client";

import { SmilesCanvas } from "@cant/shared/components/smiles-canvas";

// ---------------------------------------------------------------------------
// fg-001: Reactivity with NaOH — Carboxylic acid vs Alcohol
// ---------------------------------------------------------------------------

export function CarboxylicAcidStructure() {
  return (
    <SmilesCanvas smiles="CC(=O)O" label="Acetic acid (carboxylic acid)" />
  );
}

export function AlcoholStructure() {
  return <SmilesCanvas smiles="CCO" label="Ethanol (alcohol)" />;
}

// ---------------------------------------------------------------------------
// fg-002: Nucleophilic addition — Aldehyde vs Ketone
// ---------------------------------------------------------------------------

export function AldehydeStructure() {
  return <SmilesCanvas smiles="CC=O" label="Acetaldehyde (aldehyde)" />;
}

export function KetoneStructure() {
  return <SmilesCanvas smiles="CC(=O)C" label="Acetone (ketone)" />;
}

// ---------------------------------------------------------------------------
// fg-003: Basicity — Amine vs Amide
// ---------------------------------------------------------------------------

export function AmineStructure() {
  return <SmilesCanvas smiles="CN" label="Methylamine (primary amine)" />;
}

export function AmideStructure() {
  return <SmilesCanvas smiles="CC(=O)N" label="Acetamide (amide)" />;
}
