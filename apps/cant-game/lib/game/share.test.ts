import { describe, it, expect } from "vitest";
import { getRank } from "./share";

describe("getRank", () => {
  it("returns Game Master at 90% and above", () => {
    expect(getRank(100)).toBe("Game Master");
    expect(getRank(90)).toBe("Game Master");
  });

  it("returns Senior Dev from 70% up to 89%", () => {
    expect(getRank(89)).toBe("Senior Dev");
    expect(getRank(70)).toBe("Senior Dev");
  });

  it("returns Getting There from 50% up to 69%", () => {
    expect(getRank(69)).toBe("Getting There");
    expect(getRank(50)).toBe("Getting There");
  });

  it("returns Keep Practicing below 50%", () => {
    expect(getRank(49)).toBe("Keep Practicing");
    expect(getRank(0)).toBe("Keep Practicing");
  });
});
