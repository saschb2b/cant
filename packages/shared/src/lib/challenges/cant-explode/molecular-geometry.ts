import type { BaseChallenge } from "../../game/types";

export const molecularGeometryChallenges: BaseChallenge[] = [
  {
    id: "mg-001",
    category: "molecular-geometry",
    difficulty: "easy",
    title: "Water molecule shape",
    prompt: "Which geometry correctly describes the water molecule?",
    content: {
      type: "visual",
      left: { componentId: "WaterBent" },
      right: { componentId: "WaterLinear" },
    },
    correctSide: "left",
    explanationCorrect:
      "Water is bent at 104.5 degrees because oxygen has two lone pairs that repel the bonding pairs. VSEPR theory predicts a tetrahedral electron geometry with a bent molecular geometry for molecules with two bonding pairs and two lone pairs.",
    explanationWrong:
      "A linear geometry would require 180 degrees between the H-O-H bonds. This only occurs when there are no lone pairs on the central atom (like CO2). The two lone pairs on oxygen compress the bond angle below the tetrahedral ideal of 109.5 degrees.",
    sourceUrl: "https://en.wikipedia.org/wiki/VSEPR_theory#AX2E2:_Bent",
    sourceLabel: "Wikipedia: VSEPR bent geometry",
  },
  {
    id: "mg-002",
    category: "molecular-geometry",
    difficulty: "easy",
    title: "Methane geometry",
    prompt: "Which geometry is correct for methane (CH4)?",
    content: {
      type: "visual",
      left: { componentId: "MethaneTetrahedral" },
      right: { componentId: "MethaneSquarePlanar" },
    },
    correctSide: "left",
    explanationCorrect:
      "Methane adopts a tetrahedral geometry with bond angles of 109.5 degrees. With four equivalent bonding pairs and no lone pairs, VSEPR theory predicts maximum separation in three dimensions, resulting in a tetrahedron.",
    explanationWrong:
      "Square planar geometry has 90 degree bond angles, placing all atoms in one plane. This arrangement would bring the hydrogen atoms closer together than necessary. Square planar geometry typically requires d-orbital participation, as seen in certain transition metal complexes.",
    sourceUrl: "https://en.wikipedia.org/wiki/VSEPR_theory#AX4:_Tetrahedral",
    sourceLabel: "Wikipedia: VSEPR tetrahedral geometry",
  },
  {
    id: "mg-003",
    category: "molecular-geometry",
    difficulty: "medium",
    title: "Ammonia shape",
    prompt: "Which geometry correctly describes ammonia (NH3)?",
    content: {
      type: "visual",
      left: { componentId: "AmmoniaPyramidal" },
      right: { componentId: "AmmoniaPlanar" },
    },
    correctSide: "left",
    explanationCorrect:
      "Ammonia is trigonal pyramidal with bond angles of about 107 degrees. The nitrogen lone pair occupies more space than bonding pairs, compressing the H-N-H angle below the ideal tetrahedral angle of 109.5 degrees.",
    explanationWrong:
      "Trigonal planar geometry (120 degree angles) would only be correct if nitrogen had no lone pairs, as in boron trifluoride (BF3). The lone pair on nitrogen pushes the three N-H bonds downward, creating the pyramidal shape.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/VSEPR_theory#AX3E:_Trigonal_pyramidal",
    sourceLabel: "Wikipedia: VSEPR trigonal pyramidal",
  },
  {
    id: "mg-004",
    category: "molecular-geometry",
    difficulty: "hard",
    title: "SF6 geometry",
    prompt: "Which geometry is correct for sulfur hexafluoride (SF6)?",
    content: {
      type: "visual",
      left: { componentId: "SF6Octahedral" },
      right: { componentId: "SF6Trigonal" },
    },
    correctSide: "left",
    explanationCorrect:
      "SF6 is octahedral with six equivalent S-F bonds at 90 degree angles. Sulfur uses expanded octet bonding with its 3d orbitals to accommodate six bonding pairs. All F-S-F angles are exactly 90 or 180 degrees.",
    explanationWrong:
      "Trigonal prismatic geometry is extremely rare for main group compounds. It would create unequal F-F distances and higher steric strain. This geometry is occasionally observed in some transition metal complexes but not in SF6.",
    sourceUrl: "https://en.wikipedia.org/wiki/Sulfur_hexafluoride",
    sourceLabel: "Wikipedia: Sulfur hexafluoride",
  },
];
