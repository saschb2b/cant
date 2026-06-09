import { describe, it, expect } from "vitest";
import {
  firstSentence,
  extractCodeKeywords,
  buildSearchItems,
} from "./search-items";
import type { BaseChallenge } from "./game/types";

describe("firstSentence", () => {
  it("returns the text up to and including the first period", () => {
    expect(firstSentence("Mobile-first scales up. It avoids overrides.")).toBe(
      "Mobile-first scales up.",
    );
  });

  it("returns the first line when there is no period", () => {
    expect(firstSentence("Just a short label")).toBe("Just a short label");
    expect(firstSentence("First line\nSecond line")).toBe("First line");
  });

  it("truncates a long, period-less line to 117 chars plus an ellipsis", () => {
    const result = firstSentence("a".repeat(130));
    expect(result).toBe("a".repeat(117) + "...");
    expect(result).toHaveLength(120);
  });
});

describe("extractCodeKeywords", () => {
  it("pulls identifiers from both snippets and drops noise keywords", () => {
    expect(
      extractCodeKeywords("const onClick = handler", "const onTap = handler"),
    ).toEqual(["onClick", "handler", "onTap"]);
  });

  it("ignores identifiers shorter than three characters", () => {
    expect(extractCodeKeywords("id ab abc", "")).toEqual(["abc"]);
  });

  it("deduplicates repeated identifiers", () => {
    expect(extractCodeKeywords("padding padding", "padding")).toEqual([]);
    expect(extractCodeKeywords("onSelect onSelect", "onSelect")).toEqual([
      "onSelect",
    ]);
  });

  it("returns nothing when every token is noise", () => {
    expect(extractCodeKeywords("string number boolean", "flex grid")).toEqual(
      [],
    );
  });
});

describe("buildSearchItems", () => {
  const codeChallenge: BaseChallenge = {
    id: "c1",
    title: "Mobile-first media queries",
    prompt: "Which scales better?",
    category: "media-queries",
    difficulty: "easy",
    content: {
      type: "code",
      left: "const minWidth = breakpoint",
      right: "const maxWidth = breakpoint",
    },
    correctSide: "right",
    explanationCorrect: "Mobile-first scales up cleanly. It avoids overrides.",
    explanationWrong: "Desktop-first forces undoing styles.",
    sourceUrl: "https://example.com",
    sourceLabel: "MDN",
  };

  const visualChallenge: BaseChallenge = {
    id: "c2",
    title: "Form layout",
    prompt: "Which is clearer?",
    category: "layout",
    difficulty: "medium",
    content: {
      type: "visual",
      left: { componentId: "Cramped" },
      right: { componentId: "Spaced" },
    },
    correctSide: "right",
    explanationCorrect: "Spaced forms are easier to scan.",
    explanationWrong: "Cramped forms hide structure.",
    sourceUrl: "https://example.com",
    sourceLabel: "NN/g",
  };

  const config = {
    pages: [
      {
        type: "page" as const,
        title: "Play",
        description: "Start a quiz",
        keywords: ["game"],
        href: "/play",
      },
    ],
    challenges: [codeChallenge, visualChallenge],
    categoryOrder: ["media-queries", "layout"],
    categoryLabels: { "media-queries": "Media Queries", layout: "Layout" },
    categoryDescriptions: {
      "media-queries": "Responsive breakpoints",
      layout: "Page structure",
    },
    categorySections: [
      { label: "CSS", categories: ["media-queries", "layout"] },
    ],
  };

  it("emits pages first, then one item per category, then one per challenge", () => {
    const items = buildSearchItems(config);
    expect(items).toHaveLength(5);
    expect(items[0]).toEqual(config.pages[0]);
    expect(items.filter((i) => i.type === "category")).toHaveLength(2);
    expect(items.filter((i) => i.type === "challenge")).toHaveLength(2);
  });

  it("builds category items with section keyword and learn href", () => {
    const category = buildSearchItems(config).find(
      (i) => i.href === "/learn/media-queries",
    );
    expect(category?.type).toBe("category");
    expect(category?.title).toBe("Media Queries");
    expect(category?.keywords).toEqual([
      "media-queries",
      "CSS",
      "learn",
      "pattern",
    ]);
  });

  it("summarizes a challenge and extracts code keywords for code content", () => {
    const challenge = buildSearchItems(config).find(
      (i) => i.href === "/learn/media-queries#c1",
    );
    expect(challenge?.description).toBe("Mobile-first scales up cleanly.");
    expect(challenge?.subtitle).toBe("Media Queries · easy");
    expect(challenge?.difficulty).toBe("easy");
    expect(challenge?.keywords).toEqual(["minWidth", "breakpoint", "maxWidth"]);
  });

  it("leaves keywords empty for non-code challenge content", () => {
    const challenge = buildSearchItems(config).find(
      (i) => i.href === "/learn/layout#c2",
    );
    expect(challenge?.keywords).toEqual([]);
  });
});
