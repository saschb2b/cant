import { CATEGORY_ORDER } from "@/lib/learn/categories";
export {
  hashSeed,
  createRng,
  generateSeed,
  seedFromKey,
  getTodayKey,
  getWeekKey,
} from "@cant/shared/lib/game/seeded-random";
import {
  encodeSeed as _encodeSeed,
  decodeSeed as _decodeSeed,
} from "@cant/shared/lib/game/seeded-random";

export function encodeSeed(
  rawSeed: string,
  excludedCategories: Set<string>,
): string {
  return _encodeSeed(rawSeed, excludedCategories, CATEGORY_ORDER as string[]);
}

export function decodeSeed(seed: string): {
  rawSeed: string;
  excludedCategories: Set<string>;
} {
  return _decodeSeed(seed, CATEGORY_ORDER as string[]);
}
