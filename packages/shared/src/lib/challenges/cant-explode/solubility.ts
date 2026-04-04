import type { BaseChallenge } from "../../game/types";

export const solubilityChallenges: BaseChallenge[] = [
  {
    id: "sol-001",
    category: "solubility",
    difficulty: "easy",
    title: "Polar vs nonpolar solvent miscibility",
    prompt: "Which molecule is more soluble in water?",
    content: {
      type: "molecule",
      left: {
        name: "Ethanol",
        formula: "C₂H₅OH",
        smiles: "CCO",
        properties: {
          "Water solubility": "Miscible (infinite)",
          "Hydrogen bonding": "Yes (O-H group)",
          "Dipole moment": "1.69 D",
        },
      },
      right: {
        name: "Hexane",
        formula: "C₆H₁₄",
        smiles: "CCCCCC",
        properties: {
          "Water solubility": "Immiscible (~0.001%)",
          "Hydrogen bonding": "No",
          "Dipole moment": "~0 D",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Ethanol is completely miscible with water because its hydroxyl group forms strong hydrogen bonds with water molecules. The short two-carbon chain is not large enough to overcome this favorable polar interaction.",
    explanationWrong:
      "Hexane is a nonpolar hydrocarbon with no ability to form hydrogen bonds. Mixing hexane with water would require breaking the strong hydrogen bond network in water without any compensating favorable interactions.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ethanol#Solvent_properties",
    sourceLabel: "Wikipedia: Ethanol, Solvent properties",
  },
  {
    id: "sol-002",
    category: "solubility",
    difficulty: "medium",
    title: "Ionic salt solubility comparison",
    prompt: "Which salt dissolves more in water?",
    content: {
      type: "molecule",
      left: {
        name: "Sodium chloride",
        formula: "NaCl",
        smiles: "[Na+].[Cl-]",
        properties: {
          "Solubility (25°C)": "360 g/L",
          Ksp: "~38 (fully soluble)",
        },
      },
      right: {
        name: "Silver chloride",
        formula: "AgCl",
        smiles: "[Ag+].[Cl-]",
        properties: {
          "Solubility (25°C)": "0.0019 g/L",
          Ksp: "1.77 x 10⁻¹⁰",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "NaCl is highly soluble in water (360 g/L) because the strong ion-dipole interactions between water and Na⁺/Cl⁻ ions easily overcome the lattice energy. The small, highly charged Na⁺ ion is particularly well hydrated.",
    explanationWrong:
      "AgCl is nearly insoluble in water (Ksp = 1.77 x 10⁻¹⁰). The Ag⁺ ion has significant covalent character in its bonding with Cl⁻, creating a very strong lattice that water's ion-dipole forces cannot easily break apart.",
    sourceUrl: "https://en.wikipedia.org/wiki/Solubility_table",
    sourceLabel: "Wikipedia: Solubility table",
  },
  {
    id: "sol-003",
    category: "solubility",
    difficulty: "easy",
    title: "Hydrophilic vs hydrophobic biomolecule",
    prompt: "Which biomolecule dissolves better in water?",
    content: {
      type: "molecule",
      left: {
        name: "Cholesterol",
        formula: "C₂₇H₄₆O",
        smiles: "OC1CCC2(C)C(CCC3C2CCC2(C)C(CCC(C)CCCC(C)C)C32)C1",
        properties: {
          "Water solubility": "~0.002 g/L",
          "OH groups": "1",
          Character: "Largely hydrophobic",
        },
      },
      right: {
        name: "Glucose",
        formula: "C₆H₁₂O₆",
        smiles: "OCC(O)C(O)C(O)C(O)C=O",
        properties: {
          "Water solubility": "~910 g/L",
          "OH groups": "5",
          Character: "Hydrophilic",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Glucose is extremely soluble in water (~910 g/L) because its five hydroxyl groups form extensive hydrogen bonds with water molecules. The molecule is small and highly polar relative to its size.",
    explanationWrong:
      "Cholesterol is nearly insoluble in water despite having one hydroxyl group. Its large hydrophobic steroid ring system and long hydrocarbon tail overwhelm the single polar group, making the overall molecule strongly hydrophobic.",
    sourceUrl: "https://en.wikipedia.org/wiki/Glucose#Physical_properties",
    sourceLabel: "Wikipedia: Glucose, Physical properties",
  },
  {
    id: "sol-004",
    category: "solubility",
    difficulty: "easy",
    title: "Short vs long chain alcohol solubility",
    prompt: "Which alcohol mixes better with water?",
    content: {
      type: "molecule",
      left: {
        name: "Methanol",
        formula: "CH₃OH",
        smiles: "CO",
        properties: {
          "Water solubility": "Miscible (infinite)",
          "Carbon chain length": "1",
          "Hydrogen bonding": "Strong",
        },
      },
      right: {
        name: "1-Octanol",
        formula: "C₈H₁₇OH",
        smiles: "CCCCCCCCO",
        properties: {
          "Water solubility": "~0.54 g/L",
          "Carbon chain length": "8",
          "Hydrogen bonding": "Weak (overall)",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Methanol is fully miscible with water because its single carbon chain is too small to disrupt the hydrogen bonding network. The hydroxyl group dominates the molecule's properties.",
    explanationWrong:
      "1-Octanol is nearly insoluble in water because its eight-carbon hydrocarbon chain is too large and nonpolar. The single hydroxyl group at the end cannot overcome the hydrophobic effect of the long chain.",
    sourceUrl: "https://en.wikipedia.org/wiki/Methanol#Properties",
    sourceLabel: "Wikipedia: Methanol, Properties",
  },
];
