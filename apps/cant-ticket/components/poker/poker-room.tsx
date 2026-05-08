"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Eye } from "lucide-react";
import type { Vote } from "@/lib/poker/deck";
import type { PokerEvent, SessionSnapshot } from "@/lib/poker/events";
import { computeRevealStats } from "@/lib/poker/reveal-stats";
import { CardDeck } from "./card-deck";
import { DeckCheatSheet } from "./deck-cheat-sheet";
import { InviteButton } from "./invite-button";
import { JoinForm } from "./join-form";
import { ParticipantList } from "./participant-list";
import { RoundStatus } from "./round-status";
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
      if (
        (state.status === "ready" || state.status === "connecting") &&
        state.participantId === action.participantId
      ) {
        return state;
      }
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
        const existingIndex = session.participants.findIndex(
          (p) => p.id === event.participant.id,
        );
        if (existingIndex >= 0) {
          const next = [...session.participants];
          next[existingIndex] = event.participant;
          return {
            ...state,
            session: { ...session, participants: next },
          };
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
    async (name: string, options?: { spectator?: boolean }) => {
      const cachedId = sessionStorage.getItem(participantKey(sessionId));
      const res = await fetch(`/api/poker/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          participantId: cachedId ?? undefined,
          ...(options?.spectator !== undefined
            ? { spectator: options.spectator }
            : {}),
        }),
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
          onJoined={(name, options) => {
            void performJoin(name, { spectator: options.spectator });
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
  const revealStats = session.revealed
    ? computeRevealStats(session.participants)
    : null;
  const isSpectator = me?.isSpectator === true;
  const spectatorCount = session.participants.filter(
    (p) => p.isSpectator,
  ).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
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
          <Box sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
            <InviteButton sessionId={sessionId} />
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.4fr) minmax(0, 1fr)",
            },
            gap: { xs: 3, md: 3 },
            alignItems: "start",
          }}
        >
          {isSpectator ? (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderColor: "divider",
                borderStyle: "dashed",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Eye size={20} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Spectator mode
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  You are watching this session without voting. The team can
                  still see you in the participant list. You will see the round
                  progress and results when cards are revealed.
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      void performJoin(storedName ?? "", { spectator: false });
                    }}
                  >
                    Switch to voter
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderColor: "primary.main",
                borderWidth: { xs: 1, sm: 1.5 },
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    Your card
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Eye size={14} />}
                    onClick={() => {
                      void performJoin(storedName ?? "", { spectator: true });
                    }}
                  >
                    Switch to spectator
                  </Button>
                </Stack>
                <CardDeck
                  selected={session.revealed ? (me?.vote ?? null) : myVote}
                  disabled={session.revealed}
                  onPick={(vote: Vote) => {
                    setMyVote(vote);
                    void post("/vote", { participantId, vote });
                  }}
                />
                <DeckCheatSheet />
              </Stack>
            </Paper>
          )}

          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
              <RoundStatus
                revealed={session.revealed}
                participants={session.participants}
                onReveal={() => {
                  void post("/reveal");
                }}
                onReset={() => {
                  void post("/reset");
                }}
              />
            </Paper>
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: "0.6rem",
                  }}
                >
                  Players ({session.participants.length - spectatorCount})
                  {spectatorCount > 0
                    ? ` · Spectators (${String(spectatorCount)})`
                    : ""}
                </Typography>
              </Box>
              <ParticipantList
                participants={session.participants}
                revealed={session.revealed}
                selfId={participantId}
                highVoterIds={revealStats?.highVoterIds}
                lowVoterIds={revealStats?.lowVoterIds}
              />
            </Paper>
          </Stack>
        </Box>

        <Typography
          variant="caption"
          color="text.disabled"
          align="center"
          sx={{ mt: 1, alignSelf: "center", maxWidth: 520 }}
        >
          Sessions are ephemeral. They vanish when everyone leaves or the server
          restarts. No accounts, no data stored.
        </Typography>
      </Stack>
    </Container>
  );
}
