import type { ElementType, ElementDef } from "./types";

export const ELEMENTS: Record<ElementType, ElementDef> = {
  // Meta
  empty: { behavior: "static", baseColor: [0, 0, 0], density: 0, flammable: false },

  // --- Solids ---
  sand: { behavior: "powder", baseColor: [194, 178, 128], density: 3, flammable: false },
  stone: { behavior: "static", baseColor: [105, 105, 105], density: 99, flammable: false },
  iron: { behavior: "powder", baseColor: [138, 138, 138], density: 5, flammable: false },
  copper: { behavior: "powder", baseColor: [184, 115, 51], density: 5, flammable: false },
  gold: { behavior: "powder", baseColor: [218, 165, 32], density: 8, flammable: false },
  coal: { behavior: "powder", baseColor: [40, 40, 40], density: 3, flammable: true },
  wood: { behavior: "static", baseColor: [139, 90, 43], density: 99, flammable: true },
  ice: { behavior: "static", baseColor: [180, 220, 255], density: 2, flammable: false },
  glass: { behavior: "static", baseColor: [200, 220, 230], density: 99, flammable: false },
  gunpowder: { behavior: "powder", baseColor: [60, 60, 55], density: 3, flammable: true },
  salt: { behavior: "powder", baseColor: [240, 240, 235], density: 3, flammable: false },
  rust: { behavior: "static", baseColor: [183, 65, 14], density: 99, flammable: false },
  ash: { behavior: "powder", baseColor: [140, 140, 135], density: 1, flammable: false },
  charcoal: { behavior: "powder", baseColor: [50, 45, 40], density: 2, flammable: true },
  patina: { behavior: "static", baseColor: [80, 160, 120], density: 99, flammable: false },

  // --- Reactive metals ---
  sodium: { behavior: "powder", baseColor: [232, 232, 224], density: 2, flammable: false },
  potassium: { behavior: "powder", baseColor: [210, 200, 220], density: 2, flammable: false },
  magnesium: { behavior: "powder", baseColor: [220, 220, 215], density: 3, flammable: false },

  // --- Liquids ---
  water: { behavior: "liquid", baseColor: [74, 144, 217], density: 2, flammable: false },
  acid: { behavior: "liquid", baseColor: [173, 255, 47], density: 2, flammable: false },
  oil: { behavior: "liquid", baseColor: [74, 55, 40], density: 1, flammable: true },
  lava: { behavior: "liquid", baseColor: [220, 80, 20], density: 6, flammable: false },
  mercury: { behavior: "liquid", baseColor: [190, 190, 200], density: 7, flammable: false },

  // --- Gases ---
  chlorine: { behavior: "gas", baseColor: [144, 238, 144], density: 0, flammable: false },
  hydrogen: { behavior: "gas", baseColor: [200, 200, 255], density: 0, flammable: true, lifetime: 120 },
  oxygen: { behavior: "gas", baseColor: [180, 210, 255], density: 0, flammable: false, lifetime: 120 },
  smoke: { behavior: "gas", baseColor: [160, 160, 160], density: 0, flammable: false, lifetime: 60 },
  steam: { behavior: "gas", baseColor: [200, 220, 255], density: 0, flammable: false, lifetime: 40 },
  co2: { behavior: "gas", baseColor: [180, 180, 170], density: 0, flammable: false, lifetime: 80 },

  // --- Energy ---
  fire: { behavior: "fire", baseColor: [255, 69, 0], density: 0, flammable: false, lifetime: 25 },
  spark: { behavior: "fire", baseColor: [255, 255, 100], density: 0, flammable: false, lifetime: 5 },
};

/** Element groups for the picker toolbar. */
export const ELEMENT_GROUPS: { label: string; elements: ElementType[] }[] = [
  {
    label: "Basic",
    elements: ["sand", "stone", "water", "ice", "wood"],
  },
  {
    label: "Metals",
    elements: ["iron", "copper", "gold", "sodium", "potassium", "magnesium"],
  },
  {
    label: "Reactive",
    elements: ["acid", "chlorine", "hydrogen", "oxygen", "gunpowder"],
  },
  {
    label: "Other",
    elements: ["oil", "coal", "lava", "mercury", "fire"],
  },
];

/** Flat list of all pickable elements. */
export const PICKABLE_ELEMENTS: ElementType[] = ELEMENT_GROUPS.flatMap(
  (g) => g.elements,
);

/**
 * Create a particle color with slight random variation from the base color.
 */
export function variedColor(
  base: [number, number, number],
): [number, number, number] {
  const vary = 15;
  return [
    Math.max(0, Math.min(255, base[0] + Math.floor(Math.random() * vary * 2 - vary))),
    Math.max(0, Math.min(255, base[1] + Math.floor(Math.random() * vary * 2 - vary))),
    Math.max(0, Math.min(255, base[2] + Math.floor(Math.random() * vary * 2 - vary))),
  ];
}
