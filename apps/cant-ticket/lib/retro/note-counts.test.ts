import { describe, expect, it } from "vitest";
import { countNotesByAuthor } from "./note-counts";
import type { NoteSnapshot } from "./types";

function note(
  id: string,
  authorId: string,
  overrides: Partial<NoteSnapshot> = {},
): NoteSnapshot {
  return {
    id,
    columnId: "col-1",
    groupId: null,
    rank: 0,
    authorId,
    authorName: authorId,
    text: `note ${id}`,
    createdAt: 0,
    contexts: [],
    ...overrides,
  };
}

describe("countNotesByAuthor", () => {
  it("returns an empty map for no notes", () => {
    expect(countNotesByAuthor([])).toEqual(new Map());
  });

  it("tallies multiple notes per author", () => {
    const counts = countNotesByAuthor([
      note("n1", "alice"),
      note("n2", "alice"),
      note("n3", "bob"),
    ]);
    expect(counts.get("alice")).toBe(2);
    expect(counts.get("bob")).toBe(1);
  });

  it("omits authors with no notes (caller defaults them to 0)", () => {
    const counts = countNotesByAuthor([note("n1", "alice")]);
    expect(counts.has("bob")).toBe(false);
    expect(counts.get("bob") ?? 0).toBe(0);
  });

  it("counts notes whose text is hidden pre-reveal (authorId still present)", () => {
    // Pre-reveal, a non-author sees other people's notes with text === null,
    // but authorId is intact, so the count must still include them.
    const counts = countNotesByAuthor([
      note("n1", "alice", { text: null }),
      note("n2", "alice", { text: null }),
    ]);
    expect(counts.get("alice")).toBe(2);
  });

  it("counts each note in a grouped stack independently", () => {
    const counts = countNotesByAuthor([
      note("n1", "alice", { groupId: "g1", rank: 0 }),
      note("n2", "alice", { groupId: "g1", rank: 1 }),
      note("n3", "bob", { groupId: "g1", rank: 2 }),
    ]);
    expect(counts.get("alice")).toBe(2);
    expect(counts.get("bob")).toBe(1);
  });
});
