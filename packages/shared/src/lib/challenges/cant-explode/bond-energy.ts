import type { BaseChallenge } from "../../game/types";

export const bondEnergyChallenges: BaseChallenge[] = [
  {
    id: "be-001",
    category: "bond-energy",
    difficulty: "easy",
    title: "Triple bond vs single bond strength",
    prompt: "Which nitrogen bond requires more energy to break?",
    content: {
      type: "molecule",
      left: {
        name: "Molecular nitrogen (N₂)",
        formula: "N₂",
        smiles: "N#N",
        properties: {
          "Bond type": "Triple bond (N≡N)",
          "Bond energy": "945 kJ/mol",
        },
      },
      right: {
        name: "Hydrazine (N-N bond)",
        formula: "N₂H₄",
        smiles: "NN",
        properties: {
          "Bond type": "Single bond (N-N)",
          "Bond energy": "167 kJ/mol",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "The N≡N triple bond in molecular nitrogen is one of the strongest bonds in chemistry at 945 kJ/mol. Three shared electron pairs create an extremely strong and short bond, which is why N₂ is so chemically inert.",
    explanationWrong:
      "The N-N single bond in hydrazine is relatively weak at only 167 kJ/mol. With just one shared electron pair, it is about 5.7 times weaker than the triple bond in N₂.",
    sourceUrl: "https://en.wikipedia.org/wiki/Bond-dissociation_energy",
    sourceLabel: "Wikipedia: Bond-dissociation energy",
  },
  {
    id: "be-002",
    category: "bond-energy",
    difficulty: "medium",
    title: "Carbon-fluorine vs carbon-iodine bond",
    prompt: "Which carbon-halogen bond is stronger?",
    content: {
      type: "molecule",
      left: {
        name: "Fluoromethane",
        formula: "CH₃F",
        smiles: "CF",
        properties: {
          "C-F bond energy": "485 kJ/mol",
          "Bond length": "1.39 A",
        },
      },
      right: {
        name: "Iodomethane",
        formula: "CH₃I",
        smiles: "CI",
        properties: {
          "C-I bond energy": "213 kJ/mol",
          "Bond length": "2.14 A",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "The C-F bond (485 kJ/mol) is more than twice as strong as the C-I bond (213 kJ/mol). Fluorine's small atomic radius allows excellent orbital overlap with carbon, and its high electronegativity creates a very strong polar bond.",
    explanationWrong:
      "The C-I bond is relatively weak because iodine's large atomic radius results in poor orbital overlap with the small carbon 2p orbitals. This longer, weaker bond makes alkyl iodides excellent leaving groups in substitution reactions.",
    sourceUrl:
      "https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Supplemental_Modules_(Organic_Chemistry)/Fundamentals/Bond_Energies",
    sourceLabel: "LibreTexts: Bond Energies",
  },
  {
    id: "be-003",
    category: "bond-energy",
    difficulty: "easy",
    title: "Double bond vs single bond in carbon",
    prompt: "Which carbon-carbon bond has higher energy?",
    content: {
      type: "molecule",
      left: {
        name: "Ethane (C-C)",
        formula: "C₂H₆",
        smiles: "CC",
        properties: {
          "Bond type": "C-C single bond",
          "Bond energy": "346 kJ/mol",
        },
      },
      right: {
        name: "Ethylene (C=C)",
        formula: "C₂H₄",
        smiles: "C=C",
        properties: {
          "Bond type": "C=C double bond",
          "Bond energy": "614 kJ/mol",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "The C=C double bond (614 kJ/mol) is stronger than the C-C single bond (346 kJ/mol) because it consists of one sigma bond and one pi bond. Note that the double bond is not twice as strong, since the pi bond is weaker than the sigma bond.",
    explanationWrong:
      "While a C-C single bond is strong and stable at 346 kJ/mol, it consists of only one sigma bond. The double bond adds a pi bond on top of the sigma bond, providing 268 kJ/mol of additional bond energy.",
    sourceUrl: "https://en.wikipedia.org/wiki/Carbon%E2%80%93carbon_bond",
    sourceLabel: "Wikipedia: Carbon-carbon bond",
  },
  {
    id: "be-004",
    category: "bond-energy",
    difficulty: "medium",
    title: "O-H vs S-H bond strength",
    prompt: "Which hydride bond is harder to break?",
    content: {
      type: "molecule",
      left: {
        name: "Water",
        formula: "H₂O",
        smiles: "O",
        properties: {
          "O-H bond energy": "459 kJ/mol",
          "Bond length": "0.96 A",
        },
      },
      right: {
        name: "Hydrogen sulfide",
        formula: "H₂S",
        smiles: "S",
        properties: {
          "S-H bond energy": "363 kJ/mol",
          "Bond length": "1.34 A",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "The O-H bond (459 kJ/mol) is stronger than the S-H bond (363 kJ/mol). Oxygen is smaller and more electronegative than sulfur, allowing better orbital overlap with hydrogen and a shorter, stronger bond.",
    explanationWrong:
      "The S-H bond is weaker because sulfur's larger 3p orbitals overlap less effectively with hydrogen's 1s orbital compared to oxygen's smaller 2p orbitals. This weaker bond also explains why H₂S is a stronger acid than water.",
    sourceUrl: "https://en.wikipedia.org/wiki/Bond-dissociation_energy",
    sourceLabel: "Wikipedia: Bond-dissociation energy",
  },
];
