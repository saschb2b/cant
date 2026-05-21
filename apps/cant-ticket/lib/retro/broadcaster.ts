import "server-only";

import type { RetroEvent } from "./events";

type Sender = (event: RetroEvent) => void;
export type EventOrBuilder =
  | RetroEvent
  | ((forParticipantId: string) => RetroEvent);

interface Subscriber {
  participantId: string;
  send: Sender;
}

const STORE_KEY = Symbol.for("cant-ticket:retro-subscribers");

interface SubscriberStore {
  bySession: Map<string, Set<Subscriber>>;
}

const g = globalThis as unknown as Record<symbol, SubscriberStore>;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const store: SubscriberStore = (g[STORE_KEY] ??= { bySession: new Map() });

export function subscribe(
  sessionId: string,
  participantId: string,
  send: Sender,
): () => void {
  const sub: Subscriber = { participantId, send };
  let set = store.bySession.get(sessionId);
  if (!set) {
    set = new Set();
    store.bySession.set(sessionId, set);
  }
  set.add(sub);
  return () => {
    const current = store.bySession.get(sessionId);
    if (!current) return;
    current.delete(sub);
    if (current.size === 0) {
      store.bySession.delete(sessionId);
    }
  };
}

export function broadcast(
  sessionId: string,
  eventOrBuilder: EventOrBuilder,
): void {
  const set = store.bySession.get(sessionId);
  if (!set) return;
  const isBuilder = typeof eventOrBuilder === "function";
  for (const sub of set) {
    try {
      const event = isBuilder
        ? eventOrBuilder(sub.participantId)
        : eventOrBuilder;
      sub.send(event);
    } catch {
      // ignore — disconnect handler will clean up
    }
  }
}
