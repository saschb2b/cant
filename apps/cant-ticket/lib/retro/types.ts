export interface RetroColumn {
  id: string;
  name: string;
  hint?: string;
}

export interface RetroTemplate {
  id: string;
  name: string;
  description: string;
  columns: RetroColumn[];
}

export interface ContextSnapshot {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface NoteSnapshot {
  id: string;
  columnId: string;
  /** Notes sharing a groupId form a stack. Null for ungrouped notes. */
  groupId: string | null;
  /** Sort key within a stack (ascending = top → bottom). 0 for ungrouped. */
  rank: number;
  authorId: string;
  authorName: string;
  /** Null when hidden (pre-reveal, written by another participant). */
  text: string | null;
  createdAt: number;
  /**
   * Clarifying one-liners added during discussion. Empty for hidden notes
   * (no contexts can exist pre-reveal anyway). Sorted oldest-first.
   */
  contexts: ContextSnapshot[];
}

export interface ActionItemSnapshot {
  id: string;
  text: string;
  owner: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

export interface RetroParticipantSnapshot {
  id: string;
  name: string;
  /** True if this participant clicked "I'm ready" in the current phase. */
  isReady: boolean;
}

export type RetroPhase = "collect" | "discuss" | "vote" | "results";

export interface VotingConfig {
  maxVotes: number;
  endsAt: number | null;
}

export interface RetroSessionSnapshot {
  id: string;
  topic: string;
  template: RetroTemplate;
  /** Derived: phase !== "collect". Kept for backwards compatibility. */
  revealed: boolean;
  phase: RetroPhase;
  voting: VotingConfig;
  collectEndsAt: number | null;
  /** Participant id of the room host (the creator, or whoever inherited). */
  hostId: string;
  /** Vote counts per target key ("note:<id>" or "group:<groupId>"). */
  voteCounts: Record<string, number>;
  /** Target keys the current participant has voted on. */
  myVotedTargets: string[];
  participants: RetroParticipantSnapshot[];
  notes: NoteSnapshot[];
  actionItems: ActionItemSnapshot[];
}
