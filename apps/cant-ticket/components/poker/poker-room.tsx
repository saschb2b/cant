"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import type { Vote } from "@/lib/poker/deck";
import type { PokerEvent, SessionSnapshot } from "@/lib/poker/events";
import { CardDeck } from "./card-deck";
import { JoinForm } from "./join-form";
import { ParticipantList } from "./participant-list";
import { RoundControls } from "./round-controls";
import { ShareBar } from "./share-bar";
import { TopicBar } from "./topic-bar";

type RoomState =
  | { status: "joining" }
  | { status: "connecting"; participantId: string }
  | {
      status: "ready";
      participantId: string;
      session: SessionSnapshot;
    }
  | { status: "missing" };

type Action =
  | { type: "joined"; participantId: string }
  | { type: "event"; event: PokerEvent }
  | { type: "missing" }
  | { type: "leave" };

function nameKey(sessionId: string) {
  return `cant-ticket:poker:${sessionId}:name`;
}
function participantKey(sessionId: string) {
  return `cant-ticket:poker:${sessionId}:participantId`;
}

export interface PokerRoomProps {
  sessionId: string;
}

export function PokerRoom({ sessionId }: PokerRoomProps) {
  const initial: RoomState = { status: "joining" };

  const reducer = useCallback((state: RoomState, action: Action): RoomState => {
    if (action.type === "missing") return { status: "missing" };
    if (action.type === "leave") return { status: "joining" };
    if (action.type === "joined") {
      return { status: "connecting", participantId: action.participantId };
    }
    const event = action.event;
    if (state.status !== "connecting" && state.status !== "ready") {
      return state;
    }
    const participantId = state.participantId;
    if (event.type === "snapshot") {
      return { status: "ready", participantId, session: event.session };
    }
    if (state.status !== "ready") return state;
    const session = state.session;
    switch (event.type) {
      case "participant-joined": {
        if (session.participants.some((p) => p.id === event.participant.id)) {
          return state;
        }
        return {
          ...state,
          session: {
            ...session,
            participants: [...session.participants, event.participant],
          },
        };
      }
      case "participant-left": {
        return {
          ...state,
          session: {
            ...session,
            participants: session.participants.filter(
              (p) => p.id !== event.participantId,
            ),
          },
        };
      }
      case "vote": {
        return {
          ...state,
          session: {
            ...session,
            participants: session.participants.map((p) =>
              p.id === event.participantId
                ? { ...p, hasVoted: event.hasVoted }
                : p,
            ),
          },
        };
      }
      case "revealed": {
        return {
          ...state,
          session: {
            ...session,
            revealed: true,
            participants: event.participants,
          },
        };
      }
      case "reset": {
        return {
          ...state,
          session: {
            ...session,
            revealed: false,
            participants: session.participants.map((p) => ({
              ...p,
              hasVoted: false,
              vote: null,
            })),
          },
        };
      }
      case "topic": {
        return {
          ...state,
          session: { ...session, topic: event.topic },
        };
      }
    }
    return state;
  }, []);

  const [state, dispatch] = useReducer(reducer, initial);
  const [storedName, setStoredName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myVote, setMyVote] = useState<Vote | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const performJoin = useCallback(
    async (name: string) => {
      const cachedId = sessionStorage.getItem(participantKey(sessionId));
      const res = await fetch(`/api/poker/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, participantId: cachedId ?? undefined }),
      });
      if (res.status === 404) {
        sessionStorage.removeItem(participantKey(sessionId));
        sessionStorage.removeItem(nameKey(sessionId));
        dispatch({ type: "missing" });
        return;
      }
      if (!res.ok) {
        setError("Could not join session");
        return;
      }
      const data = (await res.json()) as { participantId: string };
      sessionStorage.setItem(participantKey(sessionId), data.participantId);
      sessionStorage.setItem(nameKey(sessionId), name);
      setStoredName(name);
      dispatch({ type: "joined", participantId: data.participantId });
    },
    [sessionId],
  );

  useEffect(() => {
    const cachedName = sessionStorage.getItem(nameKey(sessionId));
    if (!cachedName) return;
    queueMicrotask(() => {
      void performJoin(cachedName);
    });
  }, [sessionId, performJoin]);

  const activeParticipantId =
    state.status === "connecting" || state.status === "ready"
      ? state.participantId
      : null;

  useEffect(() => {
    if (!activeParticipantId) return;

    const url = `/api/poker/sessions/${sessionId}/stream?participantId=${encodeURIComponent(activeParticipantId)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data as string) as PokerEvent;
        if (event.type === "reset") {
          setMyVote(null);
        }
        dispatch({ type: "event", event });
      } catch {
        // ignore malformed
      }
    };
    es.onerror = () => {
      // EventSource auto-reconnects; if the session is gone we'll get a 404 next time
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [sessionId, activeParticipantId]);

  const post = useCallback(
    async (path: string, body?: Record<string, unknown>) => {
      try {
        await fetch(`/api/poker/sessions/${sessionId}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body ?? {}),
        });
      } catch {
        // ignore — SSE will resync
      }
    },
    [sessionId],
  );

  if (state.status === "missing") {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="warning">
          This session no longer exists. Sessions vanish when they sit empty for
          a few minutes or when the server restarts.
        </Alert>
      </Container>
    );
  }

  if (state.status === "joining") {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <JoinForm
          sessionId={sessionId}
          onJoined={(name) => {
            void performJoin(name);
          }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    );
  }

  if (state.status === "connecting") {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography color="text.secondary">Connecting...</Typography>
      </Container>
    );
  }

  const { session, participantId } = state;
  const me = session.participants.find((p) => p.id === participantId);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Session {sessionId}
            {storedName ? ` - playing as ${storedName}` : ""}
          </Typography>
          <TopicBar
            topic={session.topic}
            onChange={(topic) => {
              void post("/topic", { topic });
            }}
          />
        </Box>

        <ShareBar sessionId={sessionId} />

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Your card
            </Typography>
            <CardDeck
              selected={session.revealed ? (me?.vote ?? null) : myVote}
              disabled={session.revealed}
              onPick={(vote: Vote) => {
                setMyVote(vote);
                void post("/vote", { participantId, vote });
              }}
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <RoundControls
              revealed={session.revealed}
              participants={session.participants}
              onReveal={() => {
                void post("/reveal");
              }}
              onReset={() => {
                void post("/reset");
              }}
            />
            <ParticipantList
              participants={session.participants}
              revealed={session.revealed}
              selfId={participantId}
            />
          </Stack>
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Sessions are ephemeral. They vanish when everyone leaves or the server
          restarts. No accounts, no data stored.
        </Typography>
      </Stack>
    </Container>
  );
}
