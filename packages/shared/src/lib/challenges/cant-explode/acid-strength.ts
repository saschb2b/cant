import type { BaseChallenge } from "../../game/types";

export const acidStrengthChallenges: BaseChallenge[] = [
  {
    id: "as-001",
    category: "acid-strength",
    difficulty: "easy",
    title: "Hydrohalic acid comparison",
    prompt: "Which acid dissociates more readily in water?",
    content: {
      type: "molecule",
      left: {
        name: "Hydrochloric acid",
        formula: "HCl",
        smiles: "Cl",
        properties: {
          pKa: "-7",
          "Bond strength": "431 kJ/mol",
        },
      },
      right: {
        name: "Hydrofluoric acid",
        formula: "HF",
        smiles: "F",
        properties: {
          pKa: "3.17",
          "Bond strength": "568 kJ/mol",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "HCl is a much stronger acid than HF in water. Although fluorine is more electronegative, the H-F bond is significantly stronger (568 vs 431 kJ/mol), making it much harder to break. Bond strength dominates over electronegativity for this comparison.",
    explanationWrong:
      "Despite fluorine being the most electronegative element, HF is a weak acid (pKa 3.17) because the very strong H-F bond resists dissociation in water. HCl dissociates completely and is classified as a strong acid.",
    sourceUrl: "https://en.wikipedia.org/wiki/Hydrofluoric_acid#Acidity",
    sourceLabel: "Wikipedia: Hydrofluoric acid, Acidity",
  },
  {
    id: "as-002",
    category: "acid-strength",
    difficulty: "easy",
    title: "Carboxylic acid vs alcohol acidity",
    prompt: "Which compound donates a proton more easily?",
    content: {
      type: "molecule",
      left: {
        name: "Ethanol",
        formula: "C₂H₅OH",
        smiles: "CCO",
        properties: {
          pKa: "~16",
          "Conjugate base": "Ethoxide (CH₃CH₂O⁻)",
        },
      },
      right: {
        name: "Acetic acid",
        formula: "CH₃COOH",
        smiles: "CC(=O)O",
        properties: {
          pKa: "4.76",
          "Conjugate base": "Acetate (CH₃COO⁻)",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Acetic acid (pKa 4.76) is far more acidic than ethanol (pKa ~16). The acetate conjugate base is stabilized by resonance delocalization of the negative charge across two equivalent oxygen atoms.",
    explanationWrong:
      "Ethanol is a very weak acid because its conjugate base, ethoxide, has the negative charge localized on a single oxygen atom with no resonance stabilization. This makes deprotonation much less favorable.",
    sourceUrl: "https://en.wikipedia.org/wiki/Acetic_acid#Acidity_and_basicity",
    sourceLabel: "Wikipedia: Acetic acid, Acidity",
  },
  {
    id: "as-003",
    category: "acid-strength",
    difficulty: "medium",
    title: "Aromatic vs aliphatic alcohol acidity",
    prompt: "Which alcohol is more acidic?",
    content: {
      type: "molecule",
      left: {
        name: "Phenol",
        formula: "C₆H₅OH",
        smiles: "Oc1ccccc1",
        properties: {
          pKa: "10.0",
          "Conjugate base": "Phenoxide",
        },
      },
      right: {
        name: "Cyclohexanol",
        formula: "C₆H₁₁OH",
        smiles: "OC1CCCCC1",
        properties: {
          pKa: "~16",
          "Conjugate base": "Cyclohexanoxide",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Phenol is about a million times more acidic than cyclohexanol. The phenoxide conjugate base is stabilized by delocalization of the negative charge into the aromatic ring through resonance.",
    explanationWrong:
      "Cyclohexanol lacks an aromatic ring, so its conjugate base cannot delocalize the negative charge. The resulting cyclohexanoxide ion is much less stable than phenoxide, making cyclohexanol a weaker acid.",
    sourceUrl: "https://en.wikipedia.org/wiki/Phenol#Acidity",
    sourceLabel: "Wikipedia: Phenol, Acidity",
  },
  {
    id: "as-004",
    category: "acid-strength",
    difficulty: "medium",
    title: "Sulfuric acid vs phosphoric acid",
    prompt: "Which acid has a lower pKa value?",
    content: {
      type: "molecule",
      left: {
        name: "Sulfuric acid",
        formula: "H₂SO₄",
        smiles: "OS(=O)(=O)O",
        properties: {
          "pKa₁": "-3",
          "Oxygen atoms": "4",
        },
      },
      right: {
        name: "Phosphoric acid",
        formula: "H₃PO₄",
        smiles: "OP(=O)(O)O",
        properties: {
          "pKa₁": "2.15",
          "Oxygen atoms": "4",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Sulfuric acid is a much stronger acid than phosphoric acid. Sulfur is more electronegative than phosphorus and has a higher oxidation state in H₂SO₄, which stabilizes the conjugate base more effectively through charge delocalization.",
    explanationWrong:
      "Phosphoric acid is a moderate-strength acid (pKa₁ = 2.15) but not a strong acid. It does not fully dissociate in water, unlike sulfuric acid which completely donates its first proton.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Sulfuric_acid#Physical_properties",
    sourceLabel: "Wikipedia: Sulfuric acid",
  },
];
