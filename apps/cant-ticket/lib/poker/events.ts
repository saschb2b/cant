import type { Vote } from "./deck";

export interface ParticipantSnapshot {
  id: string;
  name: string;
  hasVoted: boolean;
  vote: Vote | null;
  isSpectator: boolean;
}

export interface SessionSnapshot {
  id: string;
  topic: string;
  revealed: boolean;
  participants: ParticipantSnapshot[];
}

export type PokerEvent =
  | { type: "snapshot"; session: SessionSnapshot }
  | { type: "participant-joined"; participant: ParticipantSnapshot }
  | { type: "participant-left"; participantId: string }
  | { type: "vote"; participantId: string; hasVoted: boolean }
  | { type: "revealed"; participants: ParticipantSnapshot[] }
  | { type: "reset" }
  | { type: "topic"; topic: string };
