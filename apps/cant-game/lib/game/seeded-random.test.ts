import { describe, it, expect } from "vitest";
import {
  hashSeed,
  createRng,
  seedFromKey,
  encodeSeed,
  decodeSeed,
} from "./seeded-random";
import { CATEGORY_ORDER } from "../learn/categories";

describe("hashSeed", () => {
  it("is deterministic for the same input", () => {
    expect(hashSeed("daily-2026-06-01")).toBe(hashSeed("daily-2026-06-01"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const h = hashSeed("anything");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });

  it("differs for different inputs", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });
});

describe("createRng", () => {
  it("produces a deterministic sequence for a given seed", () => {
    const a = createRng(12345);
    const b = createRng(12345);
    expect([a(), a(), a(), a()]).toEqual([b(), b(), b(), b()]);
  });

  it("produces values in [0, 1)", () => {
    const rng = createRng(1);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
});

describe("seedFromKey", () => {
  it("is deterministic and 6 chars from the unambiguous alphabet", () => {
    const s1 = seedFromKey("daily-2026-06-01");
    expect(seedFromKey("daily-2026-06-01")).toBe(s1);
    expect(s1).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
  });

  it("differs for different keys", () => {
    expect(seedFromKey("daily-2026-06-01")).not.toBe(
      seedFromKey("daily-2026-06-02"),
    );
  });
});

describe("encodeSeed / decodeSeed", () => {
  it("returns the raw seed unchanged when nothing is excluded", () => {
    expect(encodeSeed("ABC123", new Set())).toBe("ABC123");
  });

  it("round-trips excluded categories through the bitmask suffix", () => {
    expect(CATEGORY_ORDER.length).toBeGreaterThanOrEqual(3);
    // First and third categories; filtering the array (not index access)
    // keeps the element type and avoids `undefined`.
    const excluded = new Set(
      CATEGORY_ORDER.filter((_, i) => i === 0 || i === 2),
    );

    const encoded = encodeSeed("ABC123", excluded);
    expect(encoded).not.toBe("ABC123"); // a mask suffix was appended

    const decoded = decodeSeed(encoded);
    expect(decoded.rawSeed).toBe("ABC123");
    expect(decoded.excludedCategories).toEqual(excluded);
  });

  it("decodes a plain seed to an empty exclusion set", () => {
    const decoded = decodeSeed("ABC123");
    expect(decoded.rawSeed).toBe("ABC123");
    expect(decoded.excludedCategories.size).toBe(0);
  });
});
