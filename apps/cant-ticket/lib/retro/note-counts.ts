import type { NoteSnapshot } from "./types";

/**
 * Counts notes per author id. Drives the people list's per-participant note
 * caption, count chip, and avatar state.
 *
 * The count is derived from the live notes array rather than carried on each
 * participant snapshot: notes stay in sync throughout the session via
 * note-added/deleted events (and carry `authorId` even when a note's text is
 * hidden from non-authors pre-reveal), so these counts update live. A count
 * stamped on a participant snapshot would not, since the client only refreshes
 * participant snapshots on a full snapshot (join/reconnect).
 */
export function countNotesByAuthor(notes: NoteSnapshot[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const note of notes) {
    counts.set(note.authorId, (counts.get(note.authorId) ?? 0) + 1);
  }
  return counts;
}
