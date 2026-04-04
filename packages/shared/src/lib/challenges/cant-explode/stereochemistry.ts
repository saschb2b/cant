import type { BaseChallenge } from "../../game/types";

export const stereochemistryChallenges: BaseChallenge[] = [
  {
    id: "st-001",
    category: "stereochemistry",
    difficulty: "easy",
    title: "Ethane conformations",
    prompt: "Which Newman projection shows the more stable conformation?",
    content: {
      type: "visual",
      left: { componentId: "NewmanStaggered" },
      right: { componentId: "NewmanEclipsed" },
    },
    correctSide: "left",
    explanationCorrect:
      "The staggered conformation has a 60-degree dihedral angle between adjacent C-H bonds, maximizing the distance between electron clouds. It is about 12.5 kJ/mol more stable than the eclipsed form due to reduced torsional strain.",
    explanationWrong:
      "The eclipsed conformation has a 0-degree dihedral angle, placing all bonds directly behind each other. This maximizes electron-electron repulsion (torsional strain) and represents an energy maximum during rotation about the C-C bond.",
    sourceUrl: "https://en.wikipedia.org/wiki/Conformational_isomerism#Ethane",
    sourceLabel: "Wikipedia: Ethane conformations",
  },
  {
    id: "st-002",
    category: "stereochemistry",
    difficulty: "medium",
    title: "Fischer projection of glyceraldehyde",
    prompt: "Which Fischer projection shows (R)-glyceraldehyde?",
    content: {
      type: "visual",
      left: { componentId: "FischerR" },
      right: { componentId: "FischerS" },
    },
    correctSide: "left",
    explanationCorrect:
      "In a Fischer projection of (R)-glyceraldehyde, the OH group appears on the right side. This corresponds to D-glyceraldehyde, which serves as the reference compound for assigning D/L configuration to sugars and amino acids.",
    explanationWrong:
      "With OH on the left, this is (S)-glyceraldehyde (L-glyceraldehyde). While it has the same connectivity, the mirror-image arrangement at the chiral center gives it opposite optical rotation and different biological activity.",
    sourceUrl: "https://en.wikipedia.org/wiki/Fischer_projection",
    sourceLabel: "Wikipedia: Fischer projection",
  },
  {
    id: "st-003",
    category: "stereochemistry",
    difficulty: "medium",
    title: "Chair cyclohexane substitution",
    prompt: "Which chair conformation is more stable for methylcyclohexane?",
    content: {
      type: "visual",
      left: { componentId: "ChairAxialMethyl" },
      right: { componentId: "ChairEquatorialMethyl" },
    },
    correctSide: "right",
    explanationCorrect:
      "The equatorial methyl group points outward from the ring, avoiding 1,3-diaxial interactions with axial hydrogens on C3 and C5. This conformation is about 7.6 kJ/mol more stable and predominates at equilibrium (~95%).",
    explanationWrong:
      "The axial methyl group points straight up or down, coming within van der Waals distance of the axial hydrogens two carbons away. These 1,3-diaxial interactions create steric strain that destabilizes this conformation.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Cyclohexane_conformation#Monosubstituted_cyclohexane",
    sourceLabel: "Wikipedia: Cyclohexane chair conformations",
  },
  {
    id: "st-004",
    category: "stereochemistry",
    difficulty: "hard",
    title: "Decalin ring fusion",
    prompt: "Which decalin isomer is more rigid?",
    content: {
      type: "visual",
      left: { componentId: "CisDecalin" },
      right: { componentId: "TransDecalin" },
    },
    correctSide: "right",
    explanationCorrect:
      "Trans-decalin has its ring junction hydrogen atoms on opposite sides, locking both rings in the chair conformation. The molecule cannot undergo ring flipping because that would require the trans ring junction bonds to become impossibly strained.",
    explanationWrong:
      "Cis-decalin has both ring junction hydrogens on the same side, allowing the molecule to undergo ring flipping between two equivalent chair-chair conformations. This flexibility makes it less rigid than trans-decalin.",
    sourceUrl: "https://en.wikipedia.org/wiki/Decalin",
    sourceLabel: "Wikipedia: Decalin",
  },
];
