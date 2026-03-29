import { CATEGORY_ORDER } from "@/lib/game/categories";

export {
  hashSeed,
  createRng,
  generateSeed,
  seedFromKey,
  getTodayKey,
  getWeekKey,
} from "@cant/shared/lib/game";

import {
  encodeSeed as _encodeSeed,
  decodeSeed as _decodeSeed,
} from "@cant/shared/lib/game";

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
