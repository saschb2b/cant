import type { ElementType, ElementDef } from "./types";

export const ELEMENTS: Record<ElementType, ElementDef> = {
  // Meta
  empty: {
    behavior: "static",
    baseColor: [0, 0, 0],
    density: 0,
    flammable: false,
  },

  // --- Solids ---
  sand: {
    behavior: "powder",
    baseColor: [194, 178, 128],
    density: 3,
    flammable: false,
  },
  stone: {
    behavior: "static",
    baseColor: [105, 105, 105],
    density: 99,
    flammable: false,
  },
  iron: {
    behavior: "powder",
    baseColor: [138, 138, 138],
    density: 5,
    flammable: false,
  },
  copper: {
    behavior: "powder",
    baseColor: [184, 115, 51],
    density: 5,
    flammable: false,
  },
  gold: {
    behavior: "powder",
    baseColor: [218, 165, 32],
    density: 8,
    flammable: false,
  },
  coal: {
    behavior: "powder",
    baseColor: [40, 40, 40],
    density: 3,
    flammable: true,
  },
  wood: {
    behavior: "static",
    baseColor: [139, 90, 43],
    density: 99,
    flammable: true,
  },
  ice: {
    behavior: "static",
    baseColor: [180, 220, 255],
    density: 2,
    flammable: false,
  },
  glass: {
    behavior: "static",
    baseColor: [200, 220, 230],
    density: 99,
    flammable: false,
  },
  gunpowder: {
    behavior: "powder",
    baseColor: [60, 60, 55],
    density: 3,
    flammable: true,
  },
  salt: {
    behavior: "powder",
    baseColor: [240, 240, 235],
    density: 3,
    flammable: false,
  },
  rust: {
    behavior: "static",
    baseColor: [183, 65, 14],
    density: 99,
    flammable: false,
  },
  ash: {
    behavior: "powder",
    baseColor: [140, 140, 135],
    density: 2,
    flammable: false,
  },
  charcoal: {
    behavior: "powder",
    baseColor: [50, 45, 40],
    density: 2,
    flammable: true,
  },
  patina: {
    behavior: "static",
    baseColor: [80, 160, 120],
    density: 99,
    flammable: false,
  },

  // --- Reactive metals ---
  sodium: {
    behavior: "powder",
    baseColor: [232, 232, 224],
    density: 2,
    flammable: false,
  },
  potassium: {
    behavior: "powder",
    baseColor: [210, 200, 220],
    density: 2,
    flammable: false,
  },
  magnesium: {
    behavior: "powder",
    baseColor: [220, 220, 215],
    density: 3,
    flammable: false,
  },

  // --- Liquids ---
  water: {
    behavior: "liquid",
    baseColor: [74, 144, 217],
    density: 2,
    flammable: false,
  },
  acid: {
    behavior: "liquid",
    baseColor: [173, 255, 47],
    density: 2,
    flammable: false,
  },
  oil: {
    behavior: "liquid",
    baseColor: [74, 55, 40],
    density: 1,
    flammable: true,
  },
  lava: {
    behavior: "liquid",
    baseColor: [220, 80, 20],
    density: 6,
    flammable: false,
  },
  mercury: {
    behavior: "liquid",
    baseColor: [190, 190, 200],
    density: 7,
    flammable: false,
  },

  // --- Gases ---
  chlorine: {
    behavior: "gas",
    baseColor: [144, 238, 144],
    density: 0,
    flammable: false,
  },
  hydrogen: {
    behavior: "gas",
    baseColor: [200, 200, 255],
    density: 0,
    flammable: true,
    lifetime: 120,
  },
  oxygen: {
    behavior: "gas",
    baseColor: [180, 210, 255],
    density: 0,
    flammable: false,
    lifetime: 120,
  },
  smoke: {
    behavior: "gas",
    baseColor: [160, 160, 160],
    density: 0,
    flammable: false,
    lifetime: 60,
  },
  steam: {
    behavior: "gas",
    baseColor: [200, 220, 255],
    density: 0,
    flammable: false,
    lifetime: 200,
  },
  co2: {
    behavior: "gas",
    baseColor: [180, 180, 170],
    density: 0,
    flammable: false,
    lifetime: 80,
  },
  methane: {
    behavior: "gas",
    baseColor: [160, 180, 140],
    density: 0,
    flammable: true,
    lifetime: 200,
  },

  // --- Energy ---
  fire: {
    behavior: "fire",
    baseColor: [255, 69, 0],
    density: 0,
    flammable: false,
    lifetime: 25,
  },
  spark: {
    behavior: "fire",
    baseColor: [255, 255, 100],
    density: 0,
    flammable: false,
    lifetime: 5,
  },

  // --- Organic ---
  seed: {
    behavior: "powder",
    baseColor: [90, 65, 30],
    density: 2,
    flammable: true,
  },
  plant: {
    behavior: "plant",
    baseColor: [34, 139, 34],
    density: 99,
    flammable: true,
  },
  stem: {
    behavior: "static",
    baseColor: [80, 60, 30],
    density: 99,
    flammable: true,
  },
  leaf: {
    behavior: "static",
    baseColor: [50, 160, 50],
    density: 99,
    flammable: true,
  },
  vine: {
    behavior: "vine",
    baseColor: [50, 120, 50],
    density: 99,
    flammable: true,
  },
  flower: {
    behavior: "static",
    baseColor: [220, 80, 160],
    density: 99,
    flammable: true,
  },
  grass: {
    behavior: "static",
    baseColor: [80, 180, 60],
    density: 99,
    flammable: true,
  },
  moss: {
    behavior: "static",
    baseColor: [60, 130, 60],
    density: 99,
    flammable: true,
  },
  algae: {
    behavior: "static",
    baseColor: [30, 110, 50],
    density: 99,
    flammable: true,
  },
  fruit: {
    behavior: "powder",
    baseColor: [200, 40, 60],
    density: 2,
    flammable: true,
  },
  mushroom: {
    behavior: "static",
    baseColor: [180, 150, 120],
    density: 99,
    flammable: true,
  },
  pollen: {
    behavior: "gas",
    baseColor: [240, 220, 80],
    density: 0,
    flammable: true,
    lifetime: 300,
  },
  soil: {
    behavior: "powder",
    baseColor: [90, 60, 30],
    density: 3,
    flammable: false,
  },
  compost: {
    behavior: "powder",
    baseColor: [65, 50, 25],
    density: 2,
    flammable: false,
  },

  // --- Creatures ---
  worm: {
    behavior: "critter",
    baseColor: [160, 100, 80],
    density: 3,
    flammable: false,
    lifetime: 15000,
  },
  bee: {
    behavior: "critter",
    baseColor: [220, 190, 40],
    density: 0,
    flammable: false,
    lifetime: 8000,
  },
  human: {
    behavior: "critter",
    baseColor: [210, 170, 130],
    density: 3,
    flammable: false,
    lifetime: 0,
  },
  bird: {
    behavior: "critter",
    baseColor: [100, 80, 60],
    density: 0,
    flammable: false,
    lifetime: 12000,
  },

  // --- Engineered ---
  fuse: {
    behavior: "fuse",
    baseColor: [160, 120, 80],
    density: 99,
    flammable: false,
  },
  tnt: {
    behavior: "explosive",
    baseColor: [200, 50, 40],
    density: 4,
    flammable: false,
  },
  wax: {
    behavior: "static",
    baseColor: [245, 235, 200],
    density: 3,
    flammable: true,
  },
  dust: {
    behavior: "powder",
    baseColor: [180, 160, 140],
    density: 1,
    flammable: true,
  },
};

/** Element groups for the picker toolbar. */
export const ELEMENT_GROUPS: { label: string; elements: ElementType[] }[] = [
  {
    label: "Nature",
    elements: ["sand", "stone", "water", "ice", "wood", "oil", "lava"],
  },
  {
    label: "Metals",
    elements: ["iron", "copper", "gold", "sodium", "potassium", "magnesium"],
  },
  {
    label: "Reactive",
    elements: ["acid", "chlorine", "hydrogen", "oxygen", "methane"],
  },
  {
    label: "Organic",
    elements: ["wax", "coal", "dust"],
  },
  {
    label: "Boom",
    elements: ["fire", "fuse", "gunpowder", "tnt"],
  },
  {
    label: "Build",
    elements: ["mercury", "glass"],
  },
  {
    label: "Life",
    elements: ["human"],
  },
];

/** Flat list of all pickable elements. */
export const PICKABLE_ELEMENTS: ElementType[] = ELEMENT_GROUPS.flatMap(
  (g) => g.elements,
);

/** Elements that get extra color diversity. */
const HIGH_VARIATION: Record<string, number> = {
  leaf: 30,
  plant: 25,
  grass: 25,
  vine: 20,
  moss: 20,
  algae: 20,
  flower: 40,
  fruit: 35,
  mushroom: 25,
  soil: 20,
};

/**
 * Create a particle color with random variation from the base color.
 * Vegetation elements get extra diversity for a natural look.
 */
export function variedColor(
  base: [number, number, number],
  element?: string,
): [number, number, number] {
  const vary = (element ? HIGH_VARIATION[element] : undefined) ?? 15;
  const result: [number, number, number] = [
    Math.max(
      0,
      Math.min(255, base[0] + Math.floor(Math.random() * vary * 2 - vary)),
    ),
    Math.max(
      0,
      Math.min(255, base[1] + Math.floor(Math.random() * vary * 2 - vary)),
    ),
    Math.max(
      0,
      Math.min(255, base[2] + Math.floor(Math.random() * vary * 2 - vary)),
    ),
  ];

  // Flowers get random hue shifts for variety (pink, purple, yellow, orange)
  if (element === "flower") {
    const hue = Math.random();
    if (hue < 0.25) {
      // Pink
      result[0] = 200 + Math.floor(Math.random() * 55);
      result[1] = 60 + Math.floor(Math.random() * 60);
      result[2] = 120 + Math.floor(Math.random() * 80);
    } else if (hue < 0.5) {
      // Yellow
      result[0] = 230 + Math.floor(Math.random() * 25);
      result[1] = 200 + Math.floor(Math.random() * 40);
      result[2] = 30 + Math.floor(Math.random() * 40);
    } else if (hue < 0.75) {
      // Purple
      result[0] = 140 + Math.floor(Math.random() * 60);
      result[1] = 50 + Math.floor(Math.random() * 60);
      result[2] = 180 + Math.floor(Math.random() * 75);
    } else {
      // White
      result[0] = 230 + Math.floor(Math.random() * 25);
      result[1] = 230 + Math.floor(Math.random() * 25);
      result[2] = 220 + Math.floor(Math.random() * 25);
    }
  }

  // Fruit gets random hue shifts (red, orange, purple, blue berries)
  if (element === "fruit") {
    const hue = Math.random();
    if (hue < 0.3) {
      // Red berry
      result[0] = 180 + Math.floor(Math.random() * 75);
      result[1] = 20 + Math.floor(Math.random() * 40);
      result[2] = 30 + Math.floor(Math.random() * 40);
    } else if (hue < 0.5) {
      // Orange
      result[0] = 220 + Math.floor(Math.random() * 35);
      result[1] = 120 + Math.floor(Math.random() * 60);
      result[2] = 10 + Math.floor(Math.random() * 30);
    } else if (hue < 0.7) {
      // Purple/plum
      result[0] = 100 + Math.floor(Math.random() * 60);
      result[1] = 20 + Math.floor(Math.random() * 40);
      result[2] = 120 + Math.floor(Math.random() * 80);
    } else if (hue < 0.85) {
      // Blueberry
      result[0] = 40 + Math.floor(Math.random() * 40);
      result[1] = 40 + Math.floor(Math.random() * 50);
      result[2] = 140 + Math.floor(Math.random() * 80);
    } else {
      // Golden/yellow
      result[0] = 230 + Math.floor(Math.random() * 25);
      result[1] = 180 + Math.floor(Math.random() * 50);
      result[2] = 20 + Math.floor(Math.random() * 30);
    }
  }

  // Mushroom cap color variety (tan, brown, reddish, pale)
  if (element === "mushroom") {
    const hue = Math.random();
    if (hue < 0.3) {
      // Classic tan
      result[0] = 180 + Math.floor(Math.random() * 40);
      result[1] = 150 + Math.floor(Math.random() * 30);
      result[2] = 110 + Math.floor(Math.random() * 30);
    } else if (hue < 0.5) {
      // Red-brown toadstool
      result[0] = 160 + Math.floor(Math.random() * 60);
      result[1] = 50 + Math.floor(Math.random() * 50);
      result[2] = 40 + Math.floor(Math.random() * 40);
    } else if (hue < 0.7) {
      // Pale/white
      result[0] = 220 + Math.floor(Math.random() * 30);
      result[1] = 215 + Math.floor(Math.random() * 30);
      result[2] = 200 + Math.floor(Math.random() * 30);
    } else {
      // Deep brown
      result[0] = 90 + Math.floor(Math.random() * 40);
      result[1] = 60 + Math.floor(Math.random() * 30);
      result[2] = 30 + Math.floor(Math.random() * 30);
    }
  }

  return result;
}
