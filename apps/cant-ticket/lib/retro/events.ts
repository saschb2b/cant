import type {
  ActionItemSnapshot,
  ContextSnapshot,
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
      /**
       * Final aggregate tally, sent only on the transition into "results".
       * Omitted for every other transition so counts stay hidden while voting.
       */
      voteCounts?: Record<string, number>;
    }
  // No count: the aggregate tally is hidden while voting is open. Each
  // recipient only learns whether they themselves now hold this vote.
  | { type: "vote-changed"; targetKey: string; voted: boolean }
  | { type: "ready-changed"; participantId: string; isReady: boolean }
  | { type: "context-added"; noteId: string; context: ContextSnapshot }
  | { type: "context-deleted"; noteId: string; contextId: string }
  | { type: "host-changed"; hostId: string }
  | { type: "action-added"; action: ActionItemSnapshot }
  | { type: "action-edited"; action: ActionItemSnapshot }
  | { type: "action-deleted"; actionId: string };
