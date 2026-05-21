import "server-only";

import {
  generateParticipantId,
  generateSessionId,
} from "@/lib/rooms/session-id";
import type {
  ActionItemSnapshot,
  NoteSnapshot,
  RetroParticipantSnapshot,
  RetroSessionSnapshot,
  RetroTemplate,
} from "./types";

const PARTICIPANT_GRACE_MS = 30_000;
const EMPTY_SESSION_TTL_MS = 5 * 60_000;
const NOTE_MAX_LENGTH = 500;
const ACTION_MAX_LENGTH = 500;
const OWNER_MAX_LENGTH = 60;
const TOPIC_MAX_LENGTH = 200;
const NAME_MAX_LENGTH = 40;

interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  lastSeen: number;
  connections: number;
}

interface Note {
  id: string;
  columnId: string;
  groupId: string | null;
  rank: number;
  authorId: string;
  text: string;
  createdAt: number;
}

interface ActionItem {
  id: string;
  text: string;
  owner: string;
  authorId: string;
  createdAt: number;
}

interface Session {
  id: string;
  topic: string;
  template: RetroTemplate;
  revealed: boolean;
  createdAt: number;
  emptySince: number | null;
  participants: Map<string, Participant>;
  notes: Map<string, Note>;
  actionItems: Map<string, ActionItem>;
}

const STORE_KEY = Symbol.for("cant-ticket:retro-sessions");

interface GlobalStore {
  sessions: Map<string, Session>;
}

const g = globalThis as unknown as Record<symbol, GlobalStore>;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const store: GlobalStore = (g[STORE_KEY] ??= { sessions: new Map() });

function prune(): void {
  const now = Date.now();
  for (const [sessionId, session] of store.sessions) {
    for (const [participantId, p] of session.participants) {
      if (p.connections <= 0 && now - p.lastSeen > PARTICIPANT_GRACE_MS) {
        session.participants.delete(participantId);
      }
    }
    if (session.participants.size === 0) {
      session.emptySince ??= now;
      if (now - session.emptySince > EMPTY_SESSION_TTL_MS) {
        store.sessions.delete(sessionId);
      }
    } else {
      session.emptySince = null;
    }
  }
}

function sanitize(text: string, max: number): string {
  return text.trim().slice(0, max);
}

function sanitizeName(name: string): string {
  const trimmed = sanitize(name, NAME_MAX_LENGTH);
  return trimmed.length > 0 ? trimmed : "Anonymous";
}

function participantName(
  session: Session,
  authorId: string,
  fallback = "Unknown",
): string {
  return session.participants.get(authorId)?.name ?? fallback;
}

function countNotesByAuthor(session: Session, authorId: string): number {
  let count = 0;
  for (const note of session.notes.values()) {
    if (note.authorId === authorId) count += 1;
  }
  return count;
}

export function snapshotParticipant(
  session: Session,
  participant: Participant,
): RetroParticipantSnapshot {
  return {
    id: participant.id,
    name: participant.name,
    noteCount: countNotesByAuthor(session, participant.id),
  };
}

export function snapshotNote(
  session: Session,
  note: Note,
  forParticipantId: string,
): NoteSnapshot {
  const visible = session.revealed || note.authorId === forParticipantId;
  return {
    id: note.id,
    columnId: note.columnId,
    groupId: note.groupId,
    rank: note.rank,
    authorId: note.authorId,
    authorName: participantName(session, note.authorId),
    text: visible ? note.text : null,
    createdAt: note.createdAt,
  };
}

export function snapshotActionItem(
  session: Session,
  action: ActionItem,
): ActionItemSnapshot {
  return {
    id: action.id,
    text: action.text,
    owner: action.owner,
    authorId: action.authorId,
    authorName: participantName(session, action.authorId),
    createdAt: action.createdAt,
  };
}

export function snapshotSession(
  session: Session,
  forParticipantId: string,
): RetroSessionSnapshot {
  return {
    id: session.id,
    topic: session.topic,
    template: session.template,
    revealed: session.revealed,
    participants: [...session.participants.values()].map((p) =>
      snapshotParticipant(session, p),
    ),
    notes: [...session.notes.values()].map((n) =>
      snapshotNote(session, n, forParticipantId),
    ),
    actionItems: [...session.actionItems.values()].map((a) =>
      snapshotActionItem(session, a),
    ),
  };
}

export function getSession(sessionId: string): Session | null {
  prune();
  return store.sessions.get(sessionId) ?? null;
}

export function createSession(
  name: string,
  template: RetroTemplate,
): { session: Session; participant: Participant } {
  prune();
  const id = generateSessionId();
  const now = Date.now();
  const participant: Participant = {
    id: generateParticipantId(),
    name: sanitizeName(name),
    joinedAt: now,
    lastSeen: now,
    connections: 0,
  };
  const session: Session = {
    id,
    topic: "",
    template,
    revealed: false,
    createdAt: now,
    emptySince: null,
    participants: new Map([[participant.id, participant]]),
    notes: new Map(),
    actionItems: new Map(),
  };
  store.sessions.set(id, session);
  return { session, participant };
}

export function joinSession(
  sessionId: string,
  name: string,
  participantId?: string,
): { session: Session; participant: Participant; created: boolean } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = Date.now();
  const trimmed = sanitizeName(name);
  if (participantId) {
    const existing = session.participants.get(participantId);
    if (existing) {
      existing.name = trimmed;
      existing.lastSeen = now;
      session.emptySince = null;
      return { session, participant: existing, created: false };
    }
  }
  const participant: Participant = {
    id: generateParticipantId(),
    name: trimmed,
    joinedAt: now,
    lastSeen: now,
    connections: 0,
  };
  session.participants.set(participant.id, participant);
  session.emptySince = null;
  return { session, participant, created: true };
}

export function leaveSession(
  sessionId: string,
  participantId: string,
): boolean {
  const session = getSession(sessionId);
  if (!session) return false;
  const removed = session.participants.delete(participantId);
  if (session.participants.size === 0) {
    session.emptySince = Date.now();
  }
  return removed;
}

export function setTopic(sessionId: string, topic: string): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.topic = sanitize(topic, TOPIC_MAX_LENGTH);
  return session;
}

export function addNote(
  sessionId: string,
  participantId: string,
  columnId: string,
  text: string,
): { session: Session; note: Note } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const participant = session.participants.get(participantId);
  if (!participant) return null;
  const columnExists = session.template.columns.some((c) => c.id === columnId);
  if (!columnExists) return null;
  const cleaned = sanitize(text, NOTE_MAX_LENGTH);
  if (!cleaned) return null;
  const note: Note = {
    id: crypto.randomUUID(),
    columnId,
    groupId: null,
    rank: 0,
    authorId: participantId,
    text: cleaned,
    createdAt: Date.now(),
  };
  session.notes.set(note.id, note);
  participant.lastSeen = Date.now();
  return { session, note };
}

const GROUP_ID_RE = /^[a-zA-Z0-9_-]{1,80}$/;

export interface MoveNoteInput {
  columnId?: string;
  groupId?: string | null;
}

export function moveNote(
  sessionId: string,
  participantId: string,
  noteId: string,
  input: MoveNoteInput,
): { session: Session; note: Note; orphanedNoteIds: string[] } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (!session.participants.has(participantId)) return null;
  const note = session.notes.get(noteId);
  if (!note) return null;
  if (!session.revealed && note.authorId !== participantId) return null;

  const oldGroupId = note.groupId;

  if (input.columnId !== undefined) {
    const exists = session.template.columns.some(
      (c) => c.id === input.columnId,
    );
    if (!exists) return null;
    note.columnId = input.columnId;
  }
  if (input.groupId !== undefined) {
    if (input.groupId !== null && !GROUP_ID_RE.test(input.groupId)) return null;
    if (input.groupId !== null && input.groupId !== oldGroupId) {
      // Joining a new group — append at the bottom of the stack.
      let maxRank = -1;
      for (const other of session.notes.values()) {
        if (other.id !== note.id && other.groupId === input.groupId) {
          if (other.rank > maxRank) maxRank = other.rank;
        }
      }
      note.rank = maxRank + 1;
    }
    note.groupId = input.groupId;
  }

  // Auto-orphan: if this note LEFT a group, check whether that vacated group
  // now has only one remaining member. A "stack of one" is just a note, so
  // ungroup it. Only check the abandoned group — never inspect other groups,
  // since a multi-call merge (set B's group, then move A in) goes through a
  // legitimate transient single-member state and must not be undone.
  const orphanedNoteIds: string[] = [];
  if (oldGroupId !== null && note.groupId !== oldGroupId) {
    const remaining = [...session.notes.values()].filter(
      (n) => n.groupId === oldGroupId,
    );
    if (remaining.length === 1) {
      const lone = remaining[0];
      if (lone) {
        lone.groupId = null;
        orphanedNoteIds.push(lone.id);
      }
    }
  }

  return { session, note, orphanedNoteIds };
}

export function reorderGroup(
  sessionId: string,
  participantId: string,
  groupId: string,
  noteIds: string[],
): { session: Session; notes: Note[] } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (!session.participants.has(participantId)) return null;
  if (!GROUP_ID_RE.test(groupId)) return null;

  const members = [...session.notes.values()].filter(
    (n) => n.groupId === groupId,
  );
  if (members.length === 0) return null;
  if (members.length !== noteIds.length) return null;
  const memberIds = new Set(members.map((n) => n.id));
  for (const id of noteIds) {
    if (!memberIds.has(id)) return null;
  }
  // Duplicates would silently drop members; reject up front.
  if (new Set(noteIds).size !== noteIds.length) return null;

  const updated: Note[] = [];
  noteIds.forEach((id, idx) => {
    const note = session.notes.get(id);
    if (!note) return;
    if (note.rank !== idx) {
      note.rank = idx;
    }
    updated.push(note);
  });
  return { session, notes: updated };
}

export function ungroupGroup(
  sessionId: string,
  participantId: string,
  groupId: string,
): { session: Session; notes: Note[] } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (!session.participants.has(participantId)) return null;
  const affected: Note[] = [];
  for (const note of session.notes.values()) {
    if (note.groupId === groupId) {
      note.groupId = null;
      affected.push(note);
    }
  }
  if (affected.length === 0) return null;
  return { session, notes: affected };
}

export function editNote(
  sessionId: string,
  participantId: string,
  noteId: string,
  text: string,
): { session: Session; note: Note } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  // Notes lock after reveal — text is the artifact of the brainstorm phase.
  if (session.revealed) return null;
  const note = session.notes.get(noteId);
  if (!note) return null;
  if (note.authorId !== participantId) return null;
  const cleaned = sanitize(text, NOTE_MAX_LENGTH);
  if (!cleaned) return null;
  note.text = cleaned;
  return { session, note };
}

export function deleteNote(
  sessionId: string,
  participantId: string,
  noteId: string,
): { session: Session; note: Note; orphanedNoteIds: string[] } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  // Notes lock after reveal — no deletion once they're visible to everyone.
  if (session.revealed) return null;
  const note = session.notes.get(noteId);
  if (!note) return null;
  if (note.authorId !== participantId) return null;
  const oldGroupId = note.groupId;
  session.notes.delete(noteId);

  const orphanedNoteIds: string[] = [];
  if (oldGroupId !== null) {
    const remaining = [...session.notes.values()].filter(
      (n) => n.groupId === oldGroupId,
    );
    if (remaining.length === 1) {
      const lone = remaining[0];
      if (lone) {
        lone.groupId = null;
        orphanedNoteIds.push(lone.id);
      }
    }
  }

  return { session, note, orphanedNoteIds };
}

export function reveal(sessionId: string): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.revealed = true;
  return session;
}

export function addAction(
  sessionId: string,
  participantId: string,
  text: string,
  owner: string,
): { session: Session; action: ActionItem } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const participant = session.participants.get(participantId);
  if (!participant) return null;
  const cleanedText = sanitize(text, ACTION_MAX_LENGTH);
  if (!cleanedText) return null;
  const cleanedOwner = sanitize(owner, OWNER_MAX_LENGTH);
  const action: ActionItem = {
    id: crypto.randomUUID(),
    text: cleanedText,
    owner: cleanedOwner,
    authorId: participantId,
    createdAt: Date.now(),
  };
  session.actionItems.set(action.id, action);
  participant.lastSeen = Date.now();
  return { session, action };
}

export function editAction(
  sessionId: string,
  actionId: string,
  text: string,
  owner: string,
): { session: Session; action: ActionItem } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const action = session.actionItems.get(actionId);
  if (!action) return null;
  const cleanedText = sanitize(text, ACTION_MAX_LENGTH);
  if (!cleanedText) return null;
  action.text = cleanedText;
  action.owner = sanitize(owner, OWNER_MAX_LENGTH);
  return { session, action };
}

export function deleteAction(
  sessionId: string,
  actionId: string,
): { session: Session; action: ActionItem } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const action = session.actionItems.get(actionId);
  if (!action) return null;
  session.actionItems.delete(actionId);
  return { session, action };
}

export function markConnected(
  sessionId: string,
  participantId: string,
): boolean {
  const session = getSession(sessionId);
  if (!session) return false;
  const participant = session.participants.get(participantId);
  if (!participant) return false;
  participant.connections += 1;
  participant.lastSeen = Date.now();
  return true;
}

export function markDisconnected(
  sessionId: string,
  participantId: string,
): void {
  const session = store.sessions.get(sessionId);
  if (!session) return;
  const participant = session.participants.get(participantId);
  if (!participant) return;
  participant.connections = Math.max(0, participant.connections - 1);
  participant.lastSeen = Date.now();
}

export function isStillDisconnected(
  sessionId: string,
  participantId: string,
  graceMs: number,
): boolean {
  const session = store.sessions.get(sessionId);
  if (!session) return false;
  const participant = session.participants.get(participantId);
  if (!participant) return false;
  if (participant.connections > 0) return false;
  return Date.now() - participant.lastSeen >= graceMs;
}

export function listNotes(session: Session): Note[] {
  return [...session.notes.values()];
}

export type { Session, Participant, Note, ActionItem };
