import { describe, it, expect } from "vitest";
import { buildMarkdown, DEFAULT_OPTIONS } from "./export-markdown";
import type {
  NoteSnapshot,
  RetroSessionSnapshot,
  ActionItemSnapshot,
} from "./types";

let seq = 0;

function note(overrides: Partial<NoteSnapshot> = {}): NoteSnapshot {
  seq += 1;
  return {
    id: `n${String(seq)}`,
    columnId: "liked",
    authorId: `a${String(seq)}`,
    authorName: `Author ${String(seq)}`,
    text: `Note ${String(seq)}`,
    groupId: null,
    rank: 0,
    contexts: [],
    createdAt: seq,
    ...overrides,
  };
}

function action(
  overrides: Partial<ActionItemSnapshot> = {},
): ActionItemSnapshot {
  seq += 1;
  return {
    id: `act${String(seq)}`,
    text: `Action ${String(seq)}`,
    owner: "",
    authorId: `a${String(seq)}`,
    authorName: `Author ${String(seq)}`,
    createdAt: seq,
    ...overrides,
  };
}

function session(
  overrides: Partial<RetroSessionSnapshot> = {},
): RetroSessionSnapshot {
  return {
    id: "ABCD1234",
    topic: "",
    template: {
      id: "four-ls",
      name: "4 L's",
      description: "",
      columns: [
        { id: "liked", name: "Liked", hint: "" },
        { id: "lacked", name: "Lacked", hint: "" },
      ],
    },
    notes: [],
    actionItems: [],
    voteCounts: {},
    ...overrides,
  } as RetroSessionSnapshot;
}

// Notes-only by default keeps assertions deterministic (the header embeds the
// current date).
const NOTES_ONLY = {
  ...DEFAULT_OPTIONS,
  includeHeader: false,
  includeActions: false,
};

describe("buildMarkdown", () => {
  it("renders notes under their column with author attribution", () => {
    const md = buildMarkdown(
      session({
        notes: [note({ text: "Pairing helped", authorName: "Alex" })],
      }),
      NOTES_ONLY,
    );
    expect(md).toContain("## Notes");
    expect(md).toContain("### Liked");
    expect(md).toContain("- Pairing helped — Alex");
  });

  it("skips columns that have no notes", () => {
    const md = buildMarkdown(
      session({ notes: [note({ columnId: "liked" })] }),
      NOTES_ONLY,
    );
    expect(md).toContain("### Liked");
    expect(md).not.toContain("### Lacked");
  });

  it("sorts items by votes when votes are included, then by creation order", () => {
    const md = buildMarkdown(
      session({
        notes: [
          note({ id: "low", text: "Low", authorName: "Lo", createdAt: 1 }),
          note({ id: "high", text: "High", authorName: "Hi", createdAt: 2 }),
        ],
        voteCounts: { "note:low": 1, "note:high": 3 },
      }),
      NOTES_ONLY,
    );
    expect(md.indexOf("High")).toBeLessThan(md.indexOf("Low"));
    expect(md).toContain("- High — Hi (3 votes)");
    expect(md).toContain("- Low — Lo (1 vote)");
  });

  it("falls back to creation order and drops vote suffixes when votes are excluded", () => {
    const md = buildMarkdown(
      session({
        notes: [
          note({ id: "a", text: "First", createdAt: 1 }),
          note({ id: "b", text: "Second", createdAt: 2 }),
        ],
        voteCounts: { "note:b": 5 },
      }),
      { ...NOTES_ONLY, includeVotes: false },
    );
    expect(md.indexOf("First")).toBeLessThan(md.indexOf("Second"));
    expect(md).not.toContain("votes");
  });

  it("renders a stack with the rank-0 headline, indented siblings, and group votes only on the headline", () => {
    const md = buildMarkdown(
      session({
        notes: [
          note({ id: "top", text: "Headline", groupId: "g1", rank: 0 }),
          note({ id: "sib", text: "Sibling", groupId: "g1", rank: 1 }),
        ],
        voteCounts: { "group:g1": 4, "note:sib": 9 },
      }),
      NOTES_ONLY,
    );
    expect(md).toContain("- Headline — Author");
    expect(md).toContain("(4 votes)");
    // Sibling is indented two spaces and carries no vote suffix of its own.
    expect(md).toMatch(/\n {2}- Sibling — Author/);
    expect(md).not.toContain("9 votes");
  });

  it("replaces note authors with Anonymous but keeps action owners when anonymous", () => {
    const md = buildMarkdown(
      session({
        notes: [note({ text: "Candid", authorName: "Alex" })],
        actionItems: [action({ text: "Do it", owner: "Sam" })],
      }),
      { ...DEFAULT_OPTIONS, includeHeader: false, anonymous: true },
    );
    expect(md).toContain("- Candid — Anonymous");
    expect(md).not.toContain("Alex");
    // Owners are accountability, not authorship, so they survive anonymization.
    expect(md).toContain("- [ ] Do it (owner: Sam)");
  });

  it("renders contexts as quoted sub-lines and hides them when disabled", () => {
    const withContext = note({
      text: "Deploy was slow",
      authorName: "Alex",
      contexts: [
        {
          id: "c1",
          text: "Took 2h",
          authorName: "Sam",
          authorId: "s1",
          createdAt: 1,
        },
      ],
    });
    const on = buildMarkdown(session({ notes: [withContext] }), NOTES_ONLY);
    expect(on).toContain("> Context (Sam): Took 2h");

    const off = buildMarkdown(session({ notes: [withContext] }), {
      ...NOTES_ONLY,
      includeContexts: false,
    });
    expect(off).not.toContain("Context");
  });

  it("renders hidden notes as a placeholder and collapses newlines in text", () => {
    const hidden = buildMarkdown(
      session({ notes: [note({ text: null })] }),
      NOTES_ONLY,
    );
    expect(hidden).toContain("- (hidden) —");

    const multiline = buildMarkdown(
      session({ notes: [note({ text: "line one\nline two" })] }),
      NOTES_ONLY,
    );
    expect(multiline).toContain("- line one line two —");
  });

  it("lists action items as checkboxes in creation order with owners", () => {
    const md = buildMarkdown(
      session({
        actionItems: [
          action({ text: "Second", owner: "Sam", createdAt: 2 }),
          action({ text: "First", owner: "", createdAt: 1 }),
        ],
      }),
      { ...DEFAULT_OPTIONS, includeHeader: false, includeNotes: false },
    );
    expect(md).toContain("## Action items");
    expect(md.indexOf("First")).toBeLessThan(md.indexOf("Second"));
    expect(md).toContain("- [ ] Second (owner: Sam)");
    expect(md).toContain("- [ ] First");
  });

  it("notes when no action items were captured", () => {
    const md = buildMarkdown(session(), {
      ...DEFAULT_OPTIONS,
      includeHeader: false,
      includeNotes: false,
    });
    expect(md).toContain("## Action items");
    expect(md).toContain("_None captured._");
  });

  it("includes a header with topic and template, falling back to the id", () => {
    const titled = buildMarkdown(session({ topic: "Sprint 42" }), {
      ...DEFAULT_OPTIONS,
      includeNotes: false,
      includeActions: false,
    });
    expect(titled).toContain("# Sprint 42");
    expect(titled).toContain("Template: 4 L's");

    const untitled = buildMarkdown(session({ topic: "   " }), {
      ...DEFAULT_OPTIONS,
      includeNotes: false,
      includeActions: false,
    });
    expect(untitled).toContain("# Retro ABCD1234");
  });
});
