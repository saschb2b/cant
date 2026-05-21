import "server-only";

import {
  generateParticipantId,
  generateSessionId,
} from "@/lib/rooms/session-id";
import type {
  ActionItemSnapshot,
  NoteSnapshot,
  RetroParticipantSnapshot,
  RetroPhase,
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
const DEFAULT_MAX_VOTES = 5;
const MIN_MAX_VOTES = 1;
const MAX_MAX_VOTES = 30;
const TIMER_MIN_MS = 10_000;
const TIMER_MAX_MS = 4 * 60 * 60 * 1000;

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
  phase: RetroPhase;
  hostId: string;
  votingMaxVotes: number;
  votingEndsAt: number | null;
  collectEndsAt: number | null;
  /** targetKey ("note:<id>" | "group:<groupId>") → voter participant ids */
  votes: Map<string, Set<string>>;
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
    let participantRemoved = false;
    for (const [participantId, p] of session.participants) {
      if (p.connections <= 0 && now - p.lastSeen > PARTICIPANT_GRACE_MS) {
        session.participants.delete(participantId);
        participantRemoved = true;
      }
    }
    if (session.participants.size === 0) {
      session.emptySince ??= now;
      if (now - session.emptySince > EMPTY_SESSION_TTL_MS) {
        store.sessions.delete(sessionId);
      }
    } else {
      session.emptySince = null;
      if (participantRemoved) {
        transferHostIfNeeded(session);
      }
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

function isRevealed(session: Session): boolean {
  return session.phase !== "collect";
}

export function snapshotNote(
  session: Session,
  note: Note,
  forParticipantId: string,
): NoteSnapshot {
  const visible = isRevealed(session) || note.authorId === forParticipantId;
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
  const voteCounts: Record<string, number> = {};
  const myVotedTargets: string[] = [];
  for (const [targetKey, voters] of session.votes) {
    voteCounts[targetKey] = voters.size;
    if (voters.has(forParticipantId)) myVotedTargets.push(targetKey);
  }
  return {
    id: session.id,
    topic: session.topic,
    template: session.template,
    revealed: isRevealed(session),
    phase: session.phase,
    voting: {
      maxVotes: session.votingMaxVotes,
      endsAt: session.votingEndsAt,
    },
    collectEndsAt: session.collectEndsAt,
    hostId: session.hostId,
    voteCounts,
    myVotedTargets,
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
    phase: "collect",
    hostId: participant.id,
    votingMaxVotes: DEFAULT_MAX_VOTES,
    votingEndsAt: null,
    collectEndsAt: null,
    votes: new Map(),
    createdAt: now,
    emptySince: null,
    participants: new Map([[participant.id, participant]]),
    notes: new Map(),
    actionItems: new Map(),
  };
  store.sessions.set(id, session);
  return { session, participant };
}

export function transferHost(
  sessionId: string,
  fromParticipantId: string,
  toParticipantId: string,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== fromParticipantId) return null;
  if (fromParticipantId === toParticipantId) return null;
  if (!session.participants.has(toParticipantId)) return null;
  session.hostId = toParticipantId;
  return session;
}

/**
 * If the host is no longer a participant, reassign to the oldest remaining
 * participant by joinedAt. Returns the new hostId iff it changed.
 */
export function transferHostIfNeeded(session: Session): string | null {
  if (session.participants.has(session.hostId)) return null;
  const remaining = [...session.participants.values()].sort(
    (a, b) => a.joinedAt - b.joinedAt,
  );
  const next = remaining[0];
  if (!next) return null;
  session.hostId = next.id;
  return next.id;
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
): { removed: boolean; newHostId: string | null } {
  const session = getSession(sessionId);
  if (!session) return { removed: false, newHostId: null };
  const removed = session.participants.delete(participantId);
  if (session.participants.size === 0) {
    session.emptySince = Date.now();
  }
  const newHostId = transferHostIfNeeded(session);
  return { removed, newHostId };
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
  // After reveal the brainstorm phase is closed — no new notes.
  if (session.phase !== "collect") return null;
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
  // Topology is editable in collect (author-only) and discuss (anyone).
  // Once voting starts the layout is frozen so vote counts stay coherent.
  if (session.phase !== "collect" && session.phase !== "discuss") return null;
  if (session.phase === "collect" && note.authorId !== participantId) {
    return null;
  }

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
  if (session.phase !== "collect" && session.phase !== "discuss") return null;
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
  if (session.phase !== "collect" && session.phase !== "discuss") return null;
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
  if (session.phase !== "collect") return null;
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
  if (session.phase !== "collect") return null;
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

export function reveal(
  sessionId: string,
  participantId: string,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== participantId) return null;
  if (session.phase !== "collect") return null;
  session.phase = "discuss";
  session.collectEndsAt = null;
  return session;
}

function clampMaxVotes(input: unknown): number {
  if (typeof input !== "number" || !Number.isFinite(input)) {
    return DEFAULT_MAX_VOTES;
  }
  const rounded = Math.round(input);
  if (rounded < MIN_MAX_VOTES) return MIN_MAX_VOTES;
  if (rounded > MAX_MAX_VOTES) return MAX_MAX_VOTES;
  return rounded;
}

function clampEndsAt(input: unknown): number | null {
  if (input === null) return null;
  if (typeof input !== "number" || !Number.isFinite(input)) return null;
  const now = Date.now();
  const min = now + TIMER_MIN_MS;
  const max = now + TIMER_MAX_MS;
  if (input < min) return min;
  if (input > max) return max;
  return Math.floor(input);
}

export function startVoting(
  sessionId: string,
  participantId: string,
  maxVotes: unknown,
  endsAtRaw: unknown,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== participantId) return null;
  if (session.phase !== "discuss") return null;
  session.votingMaxVotes = clampMaxVotes(maxVotes);
  session.votingEndsAt = clampEndsAt(endsAtRaw);
  // Fresh round: clear any vote ghosts (none expected, but defensive).
  session.votes.clear();
  session.phase = "vote";
  return session;
}

export function setVotingMaxVotes(
  sessionId: string,
  participantId: string,
  maxVotes: unknown,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== participantId) return null;
  if (session.phase !== "discuss" && session.phase !== "vote") return null;
  session.votingMaxVotes = clampMaxVotes(maxVotes);
  return session;
}

export function endVoting(
  sessionId: string,
  participantId: string,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== participantId) return null;
  if (session.phase !== "vote") return null;
  session.phase = "results";
  session.votingEndsAt = null;
  return session;
}

export function setPhaseTimer(
  sessionId: string,
  participantId: string,
  endsAtRaw: unknown,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.hostId !== participantId) return null;
  const cleaned = endsAtRaw === null ? null : clampEndsAt(endsAtRaw);
  if (session.phase === "collect") {
    session.collectEndsAt = cleaned;
    return session;
  }
  if (session.phase === "vote") {
    session.votingEndsAt = cleaned;
    return session;
  }
  return null;
}

const VOTE_TARGET_RE = /^(?:note|group):[a-zA-Z0-9_-]{1,80}$/;

export interface VoteResult {
  session: Session;
  targetKey: string;
  /** Per-recipient: true if THIS participant has voted on the target after the op. */
  isVoter: (participantId: string) => boolean;
  count: number;
}

export function castVote(
  sessionId: string,
  participantId: string,
  targetKey: string,
  action: "add" | "remove",
): VoteResult | null {
  const session = getSession(sessionId);
  if (!session) return null;
  if (!session.participants.has(participantId)) return null;
  if (session.phase !== "vote") return null;
  if (!VOTE_TARGET_RE.test(targetKey)) return null;

  // Validate that the target item exists right now.
  if (targetKey.startsWith("note:")) {
    const noteId = targetKey.slice("note:".length);
    const note = session.notes.get(noteId);
    if (note?.groupId !== null) return null;
  } else {
    const gid = targetKey.slice("group:".length);
    const hasMembers = [...session.notes.values()].some(
      (n) => n.groupId === gid,
    );
    if (!hasMembers) return null;
  }

  const current = session.votes.get(targetKey) ?? new Set<string>();
  if (action === "add") {
    if (current.has(participantId)) {
      // Already voted; idempotent.
    } else {
      const myTotal = countMyVotes(session, participantId);
      if (myTotal >= session.votingMaxVotes) return null;
      current.add(participantId);
    }
  } else {
    if (!current.has(participantId)) return null;
    current.delete(participantId);
  }
  if (current.size > 0) {
    session.votes.set(targetKey, current);
  } else {
    session.votes.delete(targetKey);
  }
  return {
    session,
    targetKey,
    isVoter: (pid) => current.has(pid),
    count: current.size,
  };
}

function countMyVotes(session: Session, participantId: string): number {
  let count = 0;
  for (const voters of session.votes.values()) {
    if (voters.has(participantId)) count += 1;
  }
  return count;
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
