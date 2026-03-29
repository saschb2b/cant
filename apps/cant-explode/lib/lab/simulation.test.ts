import { describe, it, expect } from "vitest";
import { createGrid, getCell, setCell } from "./grid";
import { createParticle, tickSimulation } from "./simulation";
import type { Grid, ElementType } from "./types";

/** Helper: place a particle at (x,y) */
function place(grid: Grid, x: number, y: number, element: ElementType) {
  setCell(grid, x, y, createParticle(element));
}

/** Helper: get element name at (x,y) or null */
function elementAt(grid: Grid, x: number, y: number): ElementType | null {
  return getCell(grid, x, y)?.element ?? null;
}

/** Helper: run N ticks with full daylight */
function runTicks(grid: Grid, n: number, daylight = 1) {
  for (let i = 0; i < n; i++) {
    tickSimulation(grid, i, daylight);
  }
}

/** Helper: check if any cell contains the given element */
function hasElement(grid: Grid, element: ElementType): boolean {
  return grid.cells.some((c) => c?.element === element);
}

/** Helper: count cells with the given element */
function countElement(grid: Grid, element: ElementType): number {
  return grid.cells.filter((c) => c?.element === element).length;
}

describe("sand falls", () => {
  it("should fall to the bottom", () => {
    const grid = createGrid(5, 10);
    place(grid, 2, 0, "sand");
    runTicks(grid, 20);
    expect(elementAt(grid, 2, 9)).toBe("sand");
    expect(elementAt(grid, 2, 0)).toBeNull();
  });
});

describe("ash forms from burning wood", () => {
  it("fire + wood produces charcoal or ash", () => {
    const grid = createGrid(10, 10);
    // Wood block with fire touching it from multiple sides
    for (let x = 3; x <= 6; x++) {
      for (let y = 4; y <= 6; y++) {
        place(grid, x, y, "wood");
      }
    }
    // Fire surrounding wood
    for (let x = 2; x <= 7; x++) {
      place(grid, x, 3, "fire");
    }
    place(grid, 2, 4, "fire");
    place(grid, 2, 5, "fire");
    place(grid, 7, 4, "fire");
    place(grid, 7, 5, "fire");

    // Keep adding fire to sustain combustion (fire has short lifetime)
    for (let round = 0; round < 10; round++) {
      runTicks(grid, 50);
      // Re-ignite edges
      for (let x = 2; x <= 7; x++) {
        if (!getCell(grid, x, 3)) place(grid, x, 3, "fire");
      }
    }

    // Should have some ash, charcoal, or smoke (combustion products)
    const ashCount = countElement(grid, "ash");
    const charcoalCount = countElement(grid, "charcoal");
    expect(ashCount + charcoalCount).toBeGreaterThan(0);
  });
});

describe("ash + sand = soil", () => {
  it("ash touching sand should react to form soil", () => {
    const grid = createGrid(5, 5);
    // Sand on bottom, ash on top - they'll touch
    place(grid, 2, 4, "sand");
    place(grid, 2, 3, "ash");

    // Run many ticks - reaction probability is 0.008
    runTicks(grid, 2000);

    expect(hasElement(grid, "soil")).toBe(true);
  });
});

describe("wet soil spontaneously sprouts seeds", () => {
  it("soil + water should eventually produce vegetation", () => {
    const grid = createGrid(15, 7);
    // Stone floor + wide soil layer for higher probability
    for (let x = 0; x <= 14; x++) {
      place(grid, x, 6, "stone");
      place(grid, x, 5, "soil");
    }
    // Water pool
    for (let x = 2; x <= 12; x++) {
      place(grid, x, 4, "water");
    }

    // Run enough ticks for spontaneous seed generation and sprouting
    runTicks(grid, 3000);

    const vegetation =
      countElement(grid, "plant") +
      countElement(grid, "stem") +
      countElement(grid, "leaf") +
      countElement(grid, "grass") +
      countElement(grid, "seed");
    expect(vegetation).toBeGreaterThan(0);
  });

  it("dry soil should NOT sprout", () => {
    const grid = createGrid(7, 7);
    for (let x = 0; x <= 6; x++) {
      place(grid, x, 6, "stone");
      place(grid, x, 5, "soil");
    }
    // No water!

    runTicks(grid, 500);

    expect(hasElement(grid, "seed")).toBe(false);
    expect(hasElement(grid, "plant")).toBe(false);
  });

  it("sand + water should NOT sprout (no soil)", () => {
    const grid = createGrid(7, 7);
    for (let x = 0; x <= 6; x++) {
      place(grid, x, 6, "stone");
      place(grid, x, 5, "sand");
    }
    place(grid, 3, 4, "water");
    place(grid, 4, 4, "water");

    runTicks(grid, 500);

    expect(hasElement(grid, "seed")).toBe(false);
    expect(hasElement(grid, "plant")).toBe(false);
  });
});

describe("full user scenario: sand -> burn wood -> water -> life emerges", () => {
  it("should eventually grow vegetation from soil + water alone", () => {
    const grid = createGrid(20, 20);

    // Sand base
    for (let x = 2; x <= 17; x++) {
      place(grid, x, 18, "sand");
      place(grid, x, 19, "sand");
    }

    // Ash layer on top (simulating burned wood result)
    for (let x = 4; x <= 15; x++) {
      place(grid, x, 17, "ash");
    }

    // Let ash + sand react to form soil
    runTicks(grid, 3000);

    const soilCount = countElement(grid, "soil");
    expect(soilCount).toBeGreaterThan(0);

    // Add water - no seeds! Life should emerge from wet soil
    for (let x = 5; x <= 14; x++) {
      place(grid, x, 15, "water");
      place(grid, x, 16, "water");
    }

    // Let life emerge and grow
    runTicks(grid, 4000);

    // Should have vegetation
    const vegetation =
      countElement(grid, "plant") +
      countElement(grid, "stem") +
      countElement(grid, "leaf") +
      countElement(grid, "grass") +
      countElement(grid, "seed");

    expect(vegetation).toBeGreaterThan(0);
  });
});

describe("water conservation", () => {
  it("mature vegetation should not drain all water", () => {
    const grid = createGrid(15, 15);

    // Soil base
    for (let x = 2; x <= 12; x++) {
      place(grid, x, 13, "stone");
      place(grid, x, 12, "soil");
    }

    // Pre-place some vegetation
    place(grid, 7, 11, "plant");
    for (let x = 5; x <= 9; x++) {
      place(grid, x, 10, "leaf");
      place(grid, x, 9, "leaf");
    }

    // Add water
    const initialWater = 20;
    for (let i = 0; i < initialWater; i++) {
      const x = 3 + (i % 10);
      const y = 11;
      if (!getCell(grid, x, y)) {
        place(grid, x, y, "water");
      }
    }

    const waterBefore = countElement(grid, "water");
    runTicks(grid, 100);
    const waterAfter = countElement(grid, "water");

    // Water should not be completely drained
    // Some will be consumed by growth, but not all
    expect(waterAfter).toBeGreaterThan(0);
    // Should retain at least 30% of water
    expect(waterAfter).toBeGreaterThan(waterBefore * 0.3);
  });
});

describe("night stops plant growth", () => {
  it("plants should not grow at night", () => {
    const grid = createGrid(10, 10);
    place(grid, 5, 8, "stone");
    place(grid, 5, 7, "soil");
    place(grid, 5, 6, "plant");
    place(grid, 4, 6, "water");
    place(grid, 6, 6, "water");
    place(grid, 5, 5, "water");

    const vegBefore =
      countElement(grid, "plant") +
      countElement(grid, "stem") +
      countElement(grid, "leaf");

    // Run at night (daylight = 0)
    runTicks(grid, 50, 0);

    const vegAfter =
      countElement(grid, "plant") +
      countElement(grid, "stem") +
      countElement(grid, "leaf");

    // Vegetation count should not increase at night
    expect(vegAfter).toBe(vegBefore);
  });
});
