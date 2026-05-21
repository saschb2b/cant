import type {
  ActionItemSnapshot,
  NoteSnapshot,
  RetroParticipantSnapshot,
  RetroSessionSnapshot,
} from "./types";

export type RetroEvent =
  | { type: "snapshot"; session: RetroSessionSnapshot }
  | { type: "participant-joined"; participant: RetroParticipantSnapshot }
  | { type: "participant-left"; participantId: string }
  | { type: "topic"; topic: string }
  | { type: "note-added"; note: NoteSnapshot }
  | { type: "note-edited"; note: NoteSnapshot }
  | { type: "note-moved"; note: NoteSnapshot }
  | { type: "note-deleted"; noteId: string; columnId: string; authorId: string }
  | { type: "revealed"; notes: NoteSnapshot[] }
  | { type: "action-added"; action: ActionItemSnapshot }
  | { type: "action-edited"; action: ActionItemSnapshot }
  | { type: "action-deleted"; actionId: string };
