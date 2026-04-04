import type { BaseChallenge } from "../../game/types";

export const electrostaticMapsChallenges: BaseChallenge[] = [
  {
    id: "em-001",
    category: "electrostatic-maps",
    difficulty: "easy",
    title: "Polar vs nonpolar molecule",
    prompt: "Which molecule has a significant dipole moment?",
    content: {
      type: "visual",
      left: { componentId: "WaterChargeMap" },
      right: { componentId: "MethaneChargeMap" },
    },
    correctSide: "left",
    explanationCorrect:
      "Water has a large dipole moment (1.85 D) because its bent geometry prevents the two O-H bond dipoles from canceling. The oxygen atom carries a partial negative charge while the hydrogens carry partial positive charges.",
    explanationWrong:
      "Methane is nonpolar despite having slightly polar C-H bonds. The symmetric tetrahedral geometry causes all four bond dipoles to cancel exactly, resulting in zero net dipole moment.",
    sourceUrl: "https://en.wikipedia.org/wiki/Chemical_polarity",
    sourceLabel: "Wikipedia: Chemical polarity",
  },
  {
    id: "em-002",
    category: "electrostatic-maps",
    difficulty: "easy",
    title: "HCl vs Cl2 bond polarity",
    prompt: "Which molecule has a polar bond?",
    content: {
      type: "visual",
      left: { componentId: "HClPolarBond" },
      right: { componentId: "Cl2NoPolar" },
    },
    correctSide: "left",
    explanationCorrect:
      "HCl has a polar bond because chlorine (EN = 3.16) is more electronegative than hydrogen (EN = 2.20). The electronegativity difference of 0.96 creates a partial negative charge on chlorine and a partial positive charge on hydrogen.",
    explanationWrong:
      "Cl2 has a perfectly nonpolar bond because both atoms have identical electronegativity. The electrons are shared equally with no charge separation. This is why Cl2 is a gas at room temperature with weak London dispersion forces only.",
    sourceUrl: "https://en.wikipedia.org/wiki/Bond_polarity",
    sourceLabel: "Wikipedia: Bond polarity",
  },
  {
    id: "em-003",
    category: "electrostatic-maps",
    difficulty: "medium",
    title: "CO2 vs H2O net dipole",
    prompt: "Which molecule has a net dipole moment?",
    content: {
      type: "visual",
      left: { componentId: "CO2NoNetDipole" },
      right: { componentId: "H2ONetDipole" },
    },
    correctSide: "right",
    explanationCorrect:
      "Water's bent geometry (104.5 degrees) means the two O-H bond dipoles add up to a net dipole pointing from the hydrogens toward the oxygen. This makes water an excellent polar solvent with a high dielectric constant.",
    explanationWrong:
      "Although CO2 has two polar C=O bonds, the linear geometry (180 degrees) causes the bond dipoles to point in exactly opposite directions, canceling completely. CO2 has zero net dipole moment and is a nonpolar molecule.",
    sourceUrl: "https://en.wikipedia.org/wiki/Dipole#Molecular_dipoles",
    sourceLabel: "Wikipedia: Molecular dipoles",
  },
  {
    id: "em-004",
    category: "electrostatic-maps",
    difficulty: "hard",
    title: "Ionic vs polar covalent bonding",
    prompt: "Which molecule shows ionic character in its bonding?",
    content: {
      type: "visual",
      left: { componentId: "NaClIonic" },
      right: { componentId: "HFCovalent" },
    },
    correctSide: "left",
    explanationCorrect:
      "NaCl has a large electronegativity difference (2.23) resulting in nearly complete electron transfer from sodium to chlorine. The Na+ cation and Cl- anion are held together by electrostatic attraction, making NaCl a classic ionic compound.",
    explanationWrong:
      "HF has significant polarity (EN difference of 1.78) but remains a polar covalent molecule. The electrons are unequally shared rather than fully transferred. HF exists as discrete molecules in the gas phase, unlike the extended lattice of NaCl.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ionic_bonding",
    sourceLabel: "Wikipedia: Ionic bonding",
  },
];
