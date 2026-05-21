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
  noteCount: number;
}

export interface RetroSessionSnapshot {
  id: string;
  topic: string;
  template: RetroTemplate;
  revealed: boolean;
  participants: RetroParticipantSnapshot[];
  notes: NoteSnapshot[];
  actionItems: ActionItemSnapshot[];
}
