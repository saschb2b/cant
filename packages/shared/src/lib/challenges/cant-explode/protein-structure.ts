import type { BaseChallenge } from "../../game/types";

export const proteinStructureChallenges: BaseChallenge[] = [
  {
    id: "ps-001",
    category: "protein-structure",
    difficulty: "easy",
    title: "Intra-chain H-bonds: alpha helix vs beta sheet",
    prompt:
      "Which secondary structure is stabilized by hydrogen bonds within the same chain?",
    content: {
      type: "visual",
      left: { componentId: "AlphaHelixStructure" },
      right: { componentId: "BetaSheetStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "The alpha helix is stabilized by hydrogen bonds between the C=O of residue i and the N-H of residue i+4 within the same polypeptide chain. This creates a right-handed coil with 3.6 residues per turn. The regularity of these intra-chain bonds makes it one of the most common secondary structures.",
    explanationWrong:
      "The beta sheet is stabilized by hydrogen bonds between adjacent polypeptide strands, not within a single chain. Strands can run parallel or antiparallel. While also a common secondary structure, the question asks about intra-chain hydrogen bonding, which defines the alpha helix.",
    sourceUrl: "https://en.wikipedia.org/wiki/Alpha_helix",
    sourceLabel: "Wikipedia: Alpha helix",
  },
  {
    id: "ps-002",
    category: "protein-structure",
    difficulty: "easy",
    title: "Genomic DNA: double helix vs single strand",
    prompt: "Which form of DNA carries genetic information in living cells?",
    content: {
      type: "visual",
      left: { componentId: "DnaDoubleHelix" },
      right: { componentId: "DnaSingleStrand" },
    },
    correctSide: "left",
    explanationCorrect:
      "Double-stranded DNA (dsDNA) is the form found in chromosomes. The two complementary strands provide redundancy: if one strand is damaged, the other serves as a template for repair. The double helix also enables semiconservative replication, where each daughter molecule inherits one original strand.",
    explanationWrong:
      "Single-stranded DNA (ssDNA) exists transiently during replication and in some viruses, but it is not the primary form for storing genetic information in cells. Without a complementary strand, ssDNA cannot use base-pair-directed repair and is more vulnerable to chemical damage.",
    sourceUrl: "https://en.wikipedia.org/wiki/DNA#Structure",
    sourceLabel: "Wikipedia: DNA structure",
  },
  {
    id: "ps-003",
    category: "protein-structure",
    difficulty: "medium",
    title: "Biological function: tertiary fold vs amino acid sequence",
    prompt: "Which level of protein structure determines biological function?",
    content: {
      type: "visual",
      left: { componentId: "TertiaryStructure" },
      right: { componentId: "PrimaryStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "Tertiary structure, the complete 3D fold of a single polypeptide chain, is what gives a protein its biological function. It creates the active site geometry, binding pockets, and surface properties. Stabilized by hydrophobic interactions, disulfide bridges, salt bridges, and hydrogen bonds between distant residues in the sequence.",
    explanationWrong:
      "Primary structure (the amino acid sequence) encodes the information needed to fold, but the linear chain alone has no enzymatic activity or binding capability. A denatured protein retains its primary structure but loses function because the tertiary fold is disrupted.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Protein_structure#Tertiary_structure",
    sourceLabel: "Wikipedia: Protein tertiary structure",
  },
  {
    id: "ps-004",
    category: "protein-structure",
    difficulty: "medium",
    title: "Revealing secondary structure: ribbon vs space-filling",
    prompt:
      "Which 3D representation best reveals a protein's secondary structure?",
    content: {
      type: "visual",
      left: { componentId: "ProteinCartoon" },
      right: { componentId: "ProteinSphereFill" },
    },
    correctSide: "left",
    explanationCorrect:
      "The cartoon (ribbon) representation traces the protein backbone and uses distinct shapes for secondary structure elements: coiled ribbons for alpha helices, flat arrows for beta strands, and thin tubes for loops. This makes the fold architecture immediately visible, which is why it is the default in structural biology publications.",
    explanationWrong:
      "Space-filling models show the van der Waals radius of every atom, revealing the protein's surface shape and solvent accessibility. However, they completely obscure the internal backbone fold, making it impossible to identify helices, sheets, or domain boundaries from the outside.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ribbon_diagram",
    sourceLabel: "Wikipedia: Ribbon diagram",
  },
];
