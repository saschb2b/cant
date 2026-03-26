import { CATEGORY_ORDER } from "@/lib/learn/categories";
export { hashSeed, createRng, generateSeed, seedFromKey, getTodayKey, getWeekKey } from "@cant/shared/lib/game/seeded-random";
import { encodeSeed as _encodeSeed, decodeSeed as _decodeSeed } from "@cant/shared/lib/game/seeded-random";

type ChallengeCategory = (typeof CATEGORY_ORDER)[number];

export function encodeSeed(rawSeed: string, excludedCategories: Set<ChallengeCategory>): string {
  return _encodeSeed(rawSeed, excludedCategories as Set<string>, CATEGORY_ORDER as string[]);
}

export function decodeSeed(seed: string): { rawSeed: string; excludedCategories: Set<ChallengeCategory> } {
  return _decodeSeed(seed, CATEGORY_ORDER as string[]) as { rawSeed: string; excludedCategories: Set<ChallengeCategory> };
}
