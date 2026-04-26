import type { BaseChallenge } from "../../game/types";

export const structuralFormulasChallenges: BaseChallenge[] = [
  {
    id: "sf-001",
    category: "structural-formulas",
    difficulty: "easy",
    title: "Benzene representation",
    prompt: "Which structure better represents benzene's bonding?",
    content: {
      type: "visual",
      left: { componentId: "BenzeneKekule" },
      right: { componentId: "BenzeneDelocalized" },
    },
    correctSide: "right",
    explanationCorrect:
      "The delocalized circle notation accurately represents benzene's equal bond lengths and electron delocalization across all six carbons. The pi electrons are shared equally, making all C-C bonds identical at 1.40 angstroms.",
    explanationWrong:
      "The Kekule structure with alternating single and double bonds incorrectly implies unequal bond lengths. While historically important, it does not capture the true nature of aromatic bonding.",
    sourceUrl: "https://en.wikipedia.org/wiki/Benzene#Structure",
    sourceLabel: "Wikipedia: Benzene structure",
  },
  {
    id: "sf-002",
    category: "structural-formulas",
    difficulty: "easy",
    title: "Ethanol vs dimethyl ether",
    prompt: "Which molecule can form hydrogen bonds with water?",
    content: {
      type: "visual",
      left: { componentId: "EthanolStructure" },
      right: { componentId: "DimethylEtherStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "Ethanol (CH3CH2OH) has an O-H group that can donate and accept hydrogen bonds with water. This makes ethanol miscible with water in all proportions and gives it a much higher boiling point than dimethyl ether.",
    explanationWrong:
      "Dimethyl ether (CH3OCH3) has the same molecular formula C2H6O but lacks an O-H group. It can only accept hydrogen bonds, not donate them, resulting in much weaker intermolecular interactions with water.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ethanol#Physical_properties",
    sourceLabel: "Wikipedia: Ethanol physical properties",
  },
  {
    id: "sf-003",
    category: "structural-formulas",
    difficulty: "medium",
    title: "Geometric isomers of 2-butene",
    prompt: "Which isomer has the higher boiling point?",
    content: {
      type: "visual",
      left: { componentId: "Cis2Butene" },
      right: { componentId: "Trans2Butene" },
    },
    correctSide: "left",
    explanationCorrect:
      "Cis-2-butene (Z isomer) has a net dipole moment because the methyl groups are on the same side of the double bond. This gives it stronger intermolecular forces and a higher boiling point (3.7 degrees C vs 0.9 degrees C for trans).",
    explanationWrong:
      "Trans-2-butene (E isomer) has methyl groups on opposite sides, creating a symmetric molecule with no net dipole. Its weaker intermolecular forces result in a lower boiling point despite having the same molecular formula.",
    sourceUrl: "https://en.wikipedia.org/wiki/2-Butene",
    sourceLabel: "Wikipedia: 2-Butene",
  },
  {
    id: "sf-004",
    category: "structural-formulas",
    difficulty: "hard",
    title: "Glucose forms",
    prompt: "Which form predominates in aqueous solution?",
    content: {
      type: "visual",
      left: { componentId: "GlucoseOpenChain" },
      right: { componentId: "GlucoseRingForm" },
    },
    correctSide: "right",
    explanationCorrect:
      "The cyclic glucopyranose form accounts for over 99% of glucose in aqueous solution. The six-membered ring is thermodynamically stable, and the intramolecular hemiacetal formation is strongly favored at equilibrium.",
    explanationWrong:
      "The open-chain aldehyde form of glucose exists as less than 0.003% of total glucose in water. While it is the reactive form in many biochemical assays, it rapidly cyclizes back to the pyranose ring.",
    sourceUrl: "https://en.wikipedia.org/wiki/Glucose#Cyclic_forms",
    sourceLabel: "Wikipedia: Glucose cyclic forms",
  },
];
