import type {
  ActionItemSnapshot,
  NoteSnapshot,
  RetroParticipantSnapshot,
  RetroPhase,
  RetroSessionSnapshot,
  VotingConfig,
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
  | {
      type: "phase-changed";
      phase: RetroPhase;
      voting: VotingConfig;
      collectEndsAt: number | null;
    }
  | { type: "vote-changed"; targetKey: string; count: number; voted: boolean }
  | { type: "ready-changed"; participantId: string; isReady: boolean }
  | { type: "host-changed"; hostId: string }
  | { type: "action-added"; action: ActionItemSnapshot }
  | { type: "action-edited"; action: ActionItemSnapshot }
  | { type: "action-deleted"; actionId: string };
