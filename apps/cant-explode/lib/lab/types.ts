export type ElementType =
  | "empty"
  // Solids
  | "sand"
  | "stone"
  | "iron"
  | "copper"
  | "gold"
  | "coal"
  | "wood"
  | "ice"
  | "glass"
  | "gunpowder"
  | "salt"
  | "rust"
  | "ash"
  | "charcoal"
  | "patina"
  // Reactive metals
  | "sodium"
  | "potassium"
  | "magnesium"
  // Liquids
  | "water"
  | "acid"
  | "oil"
  | "lava"
  | "mercury"
  // Gases
  | "chlorine"
  | "hydrogen"
  | "oxygen"
  | "smoke"
  | "steam"
  | "co2"
  | "methane"
  // Energy
  | "fire"
  | "spark"
  // Organic
  | "seed"
  | "plant"
  | "stem"
  | "leaf"
  | "vine"
  | "flower"
  | "grass"
  | "moss"
  | "algae"
  | "fruit"
  | "mushroom"
  | "pollen"
  | "soil"
  | "compost"
  // Creatures
  | "worm"
  | "bee"
  | "human"
  | "bird"
  // Engineered
  | "fuse"
  | "tnt"
  | "wax"
  | "dust";

export type Behavior =
  | "powder"
  | "liquid"
  | "gas"
  | "fire"
  | "static"
  | "plant"
  | "vine"
  | "fuse"
  | "explosive"
  | "critter";

export interface ElementDef {
  behavior: Behavior;
  baseColor: [number, number, number];
  density: number;
  flammable: boolean;
  lifetime?: number;
}

export interface Particle {
  element: ElementType;
  r: number;
  g: number;
  b: number;
  lifetime: number;
  updated: boolean;
}

export interface Grid {
  width: number;
  height: number;
  cells: (Particle | null)[];
}

export interface ReactionRule {
  a: ElementType;
  b: ElementType;
  produceA: ElementType | null;
  produceB: ElementType | null;
  probability: number;
  /** Short description for the reaction book. */
  desc: string;
  /** Category group for the reaction book. */
  group: string;
}
