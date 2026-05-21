import "server-only";

import type { Vote } from "./deck";
import type { ParticipantSnapshot, SessionSnapshot } from "./events";
import {
  generateParticipantId,
  generateSessionId,
} from "@/lib/rooms/session-id";

const PARTICIPANT_GRACE_MS = 30_000;
const EMPTY_SESSION_TTL_MS = 5 * 60_000;

export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  lastSeen: number;
  connections: number;
  vote: Vote | null;
  isSpectator: boolean;
}

export interface Session {
  id: string;
  topic: string;
  revealed: boolean;
  createdAt: number;
  emptySince: number | null;
  participants: Map<string, Participant>;
}

const STORE_KEY = Symbol.for("cant-ticket:poker-sessions");

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

export function snapshotParticipant(p: Participant): ParticipantSnapshot {
  return {
    id: p.id,
    name: p.name,
    hasVoted: p.vote !== null,
    vote: null,
    isSpectator: p.isSpectator,
  };
}

export function snapshotSession(session: Session): SessionSnapshot {
  return {
    id: session.id,
    topic: session.topic,
    revealed: session.revealed,
    participants: [...session.participants.values()].map((p) => ({
      id: p.id,
      name: p.name,
      hasVoted: p.vote !== null,
      vote: session.revealed ? p.vote : null,
      isSpectator: p.isSpectator,
    })),
  };
}

export function getSession(sessionId: string): Session | null {
  prune();
  return store.sessions.get(sessionId) ?? null;
}

export function createSession(
  name: string,
  options: { isSpectator?: boolean } = {},
): {
  session: Session;
  participant: Participant;
} {
  prune();
  const id = generateSessionId();
  const now = Date.now();
  const participant: Participant = {
    id: generateParticipantId(),
    name: sanitizeName(name),
    joinedAt: now,
    lastSeen: now,
    connections: 0,
    vote: null,
    isSpectator: options.isSpectator === true,
  };
  const session: Session = {
    id,
    topic: "",
    revealed: false,
    createdAt: now,
    emptySince: null,
    participants: new Map([[participant.id, participant]]),
  };
  store.sessions.set(id, session);
  return { session, participant };
}

export function joinSession(
  sessionId: string,
  name: string,
  participantId?: string,
  options: { isSpectator?: boolean } = {},
): { session: Session; participant: Participant } | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const now = Date.now();
  const trimmed = sanitizeName(name);
  if (participantId) {
    const existing = session.participants.get(participantId);
    if (existing) {
      existing.name = trimmed;
      existing.lastSeen = now;
      if (typeof options.isSpectator === "boolean") {
        const becomingVoter = existing.isSpectator && !options.isSpectator;
        existing.isSpectator = options.isSpectator;
        if (options.isSpectator) {
          existing.vote = null;
        } else if (becomingVoter && session.revealed) {
          existing.vote = null;
        }
      }
      session.emptySince = null;
      return { session, participant: existing };
    }
  }
  const participant: Participant = {
    id: generateParticipantId(),
    name: trimmed,
    joinedAt: now,
    lastSeen: now,
    connections: 0,
    vote: null,
    isSpectator: options.isSpectator === true,
  };
  session.participants.set(participant.id, participant);
  session.emptySince = null;
  return { session, participant };
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

export function castVote(
  sessionId: string,
  participantId: string,
  vote: Vote,
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const participant = session.participants.get(participantId);
  if (!participant) return null;
  if (participant.isSpectator) return null;
  if (session.revealed) return null;
  participant.vote = vote;
  participant.lastSeen = Date.now();
  return session;
}

export function revealSession(sessionId: string): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.revealed = true;
  return session;
}

export function resetSession(sessionId: string): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.revealed = false;
  for (const p of session.participants.values()) {
    p.vote = null;
  }
  return session;
}

export function setTopic(sessionId: string, topic: string): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.topic = topic.slice(0, 200);
  return session;
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

function sanitizeName(name: string): string {
  const trimmed = name.trim().slice(0, 40);
  return trimmed.length > 0 ? trimmed : "Anonymous";
}
