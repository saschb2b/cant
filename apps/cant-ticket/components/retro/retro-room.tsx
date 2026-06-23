"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { HelpCircle } from "lucide-react";
import type { RetroEvent } from "@/lib/retro/events";
import type { NoteSnapshot, RetroSessionSnapshot } from "@/lib/retro/types";
import type { ActionComposerState } from "./action-panel";
import { ActionPanel } from "./action-panel";
import { Column } from "./column";
import { ExportButton } from "./export-button";
import { InviteButton } from "./invite-button";
import { JoinForm } from "./join-form";
import { NoteCard } from "./note-card";
import { ParticipantList } from "./participant-list";
import { PhasePanel } from "./phase-panel";
import { RetroOnboarding } from "./retro-onboarding";
import { NoteStack } from "./stack";
import { TopicBar } from "./topic-bar";

type RoomState =
  | { status: "joining" }
  | { status: "connecting"; participantId: string }
  | {
      status: "ready";
      participantId: string;
      session: RetroSessionSnapshot;
    }
  | { status: "missing" };

type Action =
  | { type: "joined"; participantId: string }
  | { type: "event"; event: RetroEvent }
  | { type: "missing" };

function nameKey(sessionId: string) {
  return `cant-ticket:retro:${sessionId}:name`;
}
function participantKey(sessionId: string) {
  return `cant-ticket:retro:${sessionId}:participantId`;
}

type DragSource =
  | {
      kind: "note";
      noteId: string;
      columnId: string;
      groupId: string | null;
      note: NoteSnapshot;
    }
  | {
      kind: "stack";
      groupId: string;
      columnId: string;
      noteIds: string[];
      notes: NoteSnapshot[];
    };

function genGroupId(): string {
  return crypto.randomUUID();
}

/**
 * Prefer note/stack droppables over the column they sit inside, so dropping
 * a card onto another card creates a stack instead of just moving columns.
 * Fall back to rectIntersection when the pointer isn't inside any droppable.
 */
const detectMergeFirst: CollisionDetection = (args) => {
  const inside = pointerWithin(args);
  if (inside.length > 0) {
    const preferred = inside.filter((c) => {
      const idStr = String(c.id);
      return idStr.startsWith("note-drop:") || idStr.startsWith("stack-drop:");
    });
    if (preferred.length > 0) return preferred;
    return inside;
  }
  return rectIntersection(args);
};

export interface RetroRoomProps {
  sessionId: string;
}

export function RetroRoom({ sessionId }: RetroRoomProps) {
  const initial: RoomState = { status: "joining" };

  const reducer = useCallback((state: RoomState, action: Action): RoomState => {
    if (action.type === "missing") return { status: "missing" };
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
        const idx = session.participants.findIndex(
          (p) => p.id === event.participant.id,
        );
        if (idx >= 0) {
          const next = [...session.participants];
          next[idx] = event.participant;
          return { ...state, session: { ...session, participants: next } };
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
      case "topic": {
        return { ...state, session: { ...session, topic: event.topic } };
      }
      case "note-added": {
        if (session.notes.some((n) => n.id === event.note.id)) return state;
        return {
          ...state,
          session: { ...session, notes: [...session.notes, event.note] },
        };
      }
      case "note-edited":
      case "note-moved": {
        return {
          ...state,
          session: {
            ...session,
            notes: session.notes.map((n) =>
              n.id === event.note.id ? event.note : n,
            ),
          },
        };
      }
      case "note-deleted": {
        return {
          ...state,
          session: {
            ...session,
            notes: session.notes.filter((n) => n.id !== event.noteId),
          },
        };
      }
      case "revealed": {
        return {
          ...state,
          session: {
            ...session,
            revealed: true,
            notes: event.notes,
          },
        };
      }
      case "phase-changed": {
        // Ready set is reset on every phase boundary (mirrors the server),
        // so clear isReady on each participant locally too. Vote counts are
        // hidden while voting is open, so they arrive only on the transition
        // into "results"; every other transition clears them.
        return {
          ...state,
          session: {
            ...session,
            phase: event.phase,
            revealed: event.phase !== "collect",
            voting: event.voting,
            collectEndsAt: event.collectEndsAt,
            voteCounts: event.voteCounts ?? {},
            participants: session.participants.map((p) =>
              p.isReady ? { ...p, isReady: false } : p,
            ),
          },
        };
      }
      case "ready-changed": {
        return {
          ...state,
          session: {
            ...session,
            participants: session.participants.map((p) =>
              p.id === event.participantId
                ? { ...p, isReady: event.isReady }
                : p,
            ),
          },
        };
      }
      case "context-added": {
        return {
          ...state,
          session: {
            ...session,
            notes: session.notes.map((n) =>
              n.id === event.noteId
                ? { ...n, contexts: [...n.contexts, event.context] }
                : n,
            ),
          },
        };
      }
      case "context-deleted": {
        return {
          ...state,
          session: {
            ...session,
            notes: session.notes.map((n) =>
              n.id === event.noteId
                ? {
                    ...n,
                    contexts: n.contexts.filter(
                      (c) => c.id !== event.contextId,
                    ),
                  }
                : n,
            ),
          },
        };
      }
      case "host-changed": {
        return {
          ...state,
          session: { ...session, hostId: event.hostId },
        };
      }
      case "vote-changed": {
        // Aggregate counts are hidden during voting, so we only track which
        // targets this participant has selected (for their budget and the
        // filled-heart state on their own screen).
        let nextMine = session.myVotedTargets;
        const alreadyMine = nextMine.includes(event.targetKey);
        if (event.voted && !alreadyMine) {
          nextMine = [...nextMine, event.targetKey];
        } else if (!event.voted && alreadyMine) {
          nextMine = nextMine.filter((k) => k !== event.targetKey);
        }
        if (nextMine === session.myVotedTargets) return state;
        return {
          ...state,
          session: { ...session, myVotedTargets: nextMine },
        };
      }
      case "action-added": {
        if (session.actionItems.some((a) => a.id === event.action.id))
          return state;
        return {
          ...state,
          session: {
            ...session,
            actionItems: [...session.actionItems, event.action],
          },
        };
      }
      case "action-edited": {
        return {
          ...state,
          session: {
            ...session,
            actionItems: session.actionItems.map((a) =>
              a.id === event.action.id ? event.action : a,
            ),
          },
        };
      }
      case "action-deleted": {
        return {
          ...state,
          session: {
            ...session,
            actionItems: session.actionItems.filter(
              (a) => a.id !== event.actionId,
            ),
          },
        };
      }
    }
    return state;
  }, []);

  const [state, dispatch] = useReducer(reducer, initial);
  const [storedName, setStoredName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionComposer, setActionComposer] =
    useState<ActionComposerState | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor),
  );

  const performJoin = useCallback(
    async (name: string) => {
      const cachedId = sessionStorage.getItem(participantKey(sessionId));
      const res = await fetch(`/api/retro/sessions/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          participantId: cachedId ?? undefined,
        }),
      });
      if (res.status === 404) {
        sessionStorage.removeItem(participantKey(sessionId));
        sessionStorage.removeItem(nameKey(sessionId));
        dispatch({ type: "missing" });
        return;
      }
      if (!res.ok) {
        setError("Could not join retro");
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

    const url = `/api/retro/sessions/${sessionId}/stream?participantId=${encodeURIComponent(activeParticipantId)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data as string) as RetroEvent;
        dispatch({ type: "event", event });
      } catch {
        // ignore malformed
      }
    };
    es.onerror = () => {
      // EventSource auto-reconnects
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [sessionId, activeParticipantId]);

  const post = useCallback(
    async (path: string, body?: Record<string, unknown>) => {
      try {
        await fetch(`/api/retro/sessions/${sessionId}${path}`, {
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

  const del = useCallback(
    async (path: string) => {
      try {
        await fetch(`/api/retro/sessions/${sessionId}${path}`, {
          method: "DELETE",
        });
      } catch {
        // ignore
      }
    },
    [sessionId],
  );

  if (state.status === "missing") {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="warning">
          This retro no longer exists. Rooms vanish when they sit empty for a
          few minutes or when the server restarts.
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
  const totalNoteCount = session.notes.length;
  const columnCount = session.template.columns.length;
  const myVoteCount = session.myVotedTargets.length;
  const totalVoteCount = Object.values(session.voteCounts).reduce(
    (a, b) => a + b,
    0,
  );
  const budgetExhausted = myVoteCount >= session.voting.maxVotes;
  // In results, the busiest card(s) across the whole board are flagged so the
  // top-voted items stand out without leaving the board. 0 means no leaders.
  const topVoteCount =
    session.phase === "results"
      ? Math.max(0, ...Object.values(session.voteCounts))
      : 0;
  const isHost = session.hostId === participantId;
  const me = session.participants.find((p) => p.id === participantId);
  const amReady = me?.isReady === true;
  const readyCount = session.participants.filter((p) => p.isReady).length;
  const participantCount = session.participants.length;

  const moveSingleNote = (
    noteId: string,
    columnId: string,
    groupId: string | null | undefined,
  ) => {
    const body: Record<string, unknown> = { participantId, columnId };
    if (groupId !== undefined) body.groupId = groupId;
    void post(`/note/${noteId}/move`, body);
  };

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | {
          type: "note";
          noteId: string;
          columnId: string;
          groupId: string | null;
        }
      | {
          type: "stack";
          groupId: string;
          columnId: string;
          noteIds: string[];
        }
      | undefined;
    if (!data) return;
    if (data.type === "note") {
      const note = session.notes.find((n) => n.id === data.noteId);
      if (!note) return;
      setDragSource({
        kind: "note",
        noteId: data.noteId,
        columnId: data.columnId,
        groupId: data.groupId,
        note,
      });
    } else {
      const notes = session.notes.filter((n) => data.noteIds.includes(n.id));
      setDragSource({
        kind: "stack",
        groupId: data.groupId,
        columnId: data.columnId,
        noteIds: data.noteIds,
        notes,
      });
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const overData = event.over?.data.current as
      | { type: "note"; noteId: string }
      | { type: "stack"; groupId: string }
      | { type: "column"; columnId: string }
      | undefined;
    if (!overData) {
      setOverId(null);
      return;
    }
    if (overData.type === "note") setOverId(`note:${overData.noteId}`);
    else if (overData.type === "stack") setOverId(`stack:${overData.groupId}`);
    else setOverId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const source = dragSource;
    setDragSource(null);
    setOverId(null);
    if (!source) return;
    const overData = event.over?.data.current as
      | {
          type: "note";
          noteId: string;
          columnId: string;
          groupId: string | null;
        }
      | { type: "stack"; groupId: string; columnId: string }
      | { type: "column"; columnId: string }
      | undefined;
    if (!overData) return;

    if (source.kind === "note") {
      // single note dragged
      switch (overData.type) {
        case "note": {
          if (overData.noteId === source.noteId) return;
          const targetNote = session.notes.find(
            (n) => n.id === overData.noteId,
          );
          if (!targetNote) return;
          const targetGroup = targetNote.groupId ?? genGroupId();
          if (targetNote.groupId === null) {
            moveSingleNote(targetNote.id, targetNote.columnId, targetGroup);
          }
          moveSingleNote(source.noteId, targetNote.columnId, targetGroup);
          return;
        }
        case "stack": {
          moveSingleNote(source.noteId, overData.columnId, overData.groupId);
          return;
        }
        case "column": {
          if (
            overData.columnId === source.columnId &&
            source.groupId === null
          ) {
            return;
          }
          moveSingleNote(source.noteId, overData.columnId, null);
          return;
        }
      }
      return;
    }

    // whole stack dragged
    switch (overData.type) {
      case "column": {
        if (overData.columnId === source.columnId) return;
        for (const noteId of source.noteIds) {
          moveSingleNote(noteId, overData.columnId, source.groupId);
        }
        return;
      }
      case "note": {
        const targetNote = session.notes.find((n) => n.id === overData.noteId);
        if (!targetNote) return;
        if (source.noteIds.includes(targetNote.id)) return;
        const targetGroup = targetNote.groupId ?? genGroupId();
        if (targetNote.groupId === null) {
          moveSingleNote(targetNote.id, targetNote.columnId, targetGroup);
        }
        for (const noteId of source.noteIds) {
          moveSingleNote(noteId, targetNote.columnId, targetGroup);
        }
        return;
      }
      case "stack": {
        if (overData.groupId === source.groupId) return;
        for (const noteId of source.noteIds) {
          moveSingleNote(noteId, overData.columnId, overData.groupId);
        }
        return;
      }
    }
  }

  function handleUnstack(groupId: string) {
    void del(
      `/group/${groupId}?participantId=${encodeURIComponent(participantId)}`,
    );
  }

  function handleReorder(groupId: string, noteIds: string[]) {
    void post(`/group/${groupId}/reorder`, { participantId, noteIds });
  }

  function handleVote(targetKey: string, voted: boolean) {
    void post("/vote", {
      participantId,
      targetKey,
      action: voted ? "add" : "remove",
    });
  }

  function handleReveal() {
    void post("/reveal", { participantId });
  }

  function handleStartVoting(maxVotes: number, endsAt: number | null) {
    void post("/voting/start", { participantId, maxVotes, endsAt });
  }

  function handleEndVoting() {
    void post("/voting/end", { participantId });
  }

  function handleSetTimer(endsAt: number | null) {
    void post("/timer", { participantId, endsAt });
  }

  function handleSetMaxVotes(maxVotes: number) {
    void post("/voting/config", { participantId, maxVotes });
  }

  function handleTransferHost(toParticipantId: string) {
    void post("/host", { participantId, toParticipantId });
  }

  function handleSetReady(isReady: boolean) {
    void post("/ready", { participantId, isReady });
  }

  function handleAddContext(noteId: string, text: string) {
    void post(`/note/${noteId}/context`, { participantId, text });
  }

  function handleDeleteContext(noteId: string, contextId: string) {
    void del(
      `/note/${noteId}/context/${contextId}?participantId=${encodeURIComponent(
        participantId,
      )}`,
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <RetroOnboarding
        forceOpen={helpOpen}
        onClose={() => {
          setHelpOpen(false);
        }}
      />
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              Retro {sessionId} · {session.template.name}
              {storedName ? ` · as ${storedName}` : ""}
            </Typography>
            <TopicBar
              topic={session.topic}
              onChange={(topic) => {
                void post("/topic", { topic });
              }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
          >
            <Tooltip title="How retros work">
              <IconButton
                size="small"
                onClick={() => {
                  setHelpOpen(true);
                }}
                aria-label="Show retro onboarding"
                sx={{ color: "text.secondary" }}
              >
                <HelpCircle size={18} />
              </IconButton>
            </Tooltip>
            <InviteButton sessionId={sessionId} />
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) 280px",
            },
            gap: { xs: 2, md: 3 },
            alignItems: "start",
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <DndContext
              sensors={sensors}
              collisionDetection={detectMergeFirst}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={() => {
                setDragSource(null);
                setOverId(null);
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: `repeat(${String(Math.min(columnCount, 2))}, minmax(0, 1fr))`,
                    lg: `repeat(${String(columnCount)}, minmax(0, 1fr))`,
                  },
                  gap: { xs: 2, sm: 2 },
                }}
              >
                {session.template.columns.map((column) => {
                  const notes = session.notes.filter(
                    (n) => n.columnId === column.id,
                  );
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      notes={notes}
                      participantId={participantId}
                      revealed={session.revealed}
                      phase={session.phase}
                      voteCounts={session.voteCounts}
                      myVotedTargets={session.myVotedTargets}
                      budgetExhausted={budgetExhausted}
                      topVoteCount={topVoteCount}
                      onVote={handleVote}
                      mergeTargetId={overId}
                      onAddNote={(text) => {
                        void post("/note", {
                          participantId,
                          columnId: column.id,
                          text,
                        });
                      }}
                      onEditNote={(noteId, text) => {
                        void post(`/note/${noteId}`, { participantId, text });
                      }}
                      onDeleteNote={(noteId) => {
                        void del(
                          `/note/${noteId}?participantId=${encodeURIComponent(
                            participantId,
                          )}`,
                        );
                      }}
                      onPromote={(text) => {
                        setActionComposer({ text, owner: "" });
                      }}
                      onUnstack={handleUnstack}
                      onReorder={handleReorder}
                      onAddContext={handleAddContext}
                      onDeleteContext={handleDeleteContext}
                    />
                  );
                })}
              </Box>
              <DragOverlay
                dropAnimation={{
                  duration: 220,
                  easing: "cubic-bezier(0.18, 0.67, 0.36, 1.04)",
                }}
              >
                {dragSource?.kind === "note" && (
                  <NoteCard
                    note={dragSource.note}
                    isAuthor={dragSource.note.authorId === participantId}
                    revealed={session.revealed}
                    phase={session.phase}
                    participantId={participantId}
                    asOverlay
                    voteState={null}
                    onEdit={() => undefined}
                    onDelete={() => undefined}
                    onPromote={() => undefined}
                    onAddContext={() => undefined}
                    onDeleteContext={() => undefined}
                  />
                )}
                {dragSource?.kind === "stack" && (
                  <NoteStack
                    groupId={dragSource.groupId}
                    columnId={dragSource.columnId}
                    notes={dragSource.notes}
                    participantId={participantId}
                    revealed={session.revealed}
                    phase={session.phase}
                    asOverlay
                    voteState={null}
                    onEditNote={() => undefined}
                    onDeleteNote={() => undefined}
                    onPromote={() => undefined}
                    onUnstack={() => undefined}
                    onReorder={() => undefined}
                    onAddContext={() => undefined}
                    onDeleteContext={() => undefined}
                  />
                )}
              </DragOverlay>
            </DndContext>

            <ActionPanel
              actions={session.actionItems}
              composer={actionComposer}
              onOpenComposer={() => {
                setActionComposer({ text: "", owner: "" });
              }}
              onComposerChange={(next) => {
                setActionComposer(next);
              }}
              onCancelComposer={() => {
                setActionComposer(null);
              }}
              onSubmitComposer={() => {
                if (!actionComposer) return;
                const text = actionComposer.text.trim();
                if (!text) return;
                void post("/action", {
                  participantId,
                  text,
                  owner: actionComposer.owner.trim(),
                });
                setActionComposer(null);
              }}
              onEdit={(actionId, text, owner) => {
                void post(`/action/${actionId}`, { text, owner });
              }}
              onDelete={(actionId) => {
                void del(`/action/${actionId}`);
              }}
            />
          </Stack>

          <Stack
            spacing={2}
            sx={{
              position: { md: "sticky" },
              top: { md: 88 },
              minWidth: 0,
            }}
          >
            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack spacing={1.5}>
                <PhasePanel
                  phase={session.phase}
                  voting={session.voting}
                  collectEndsAt={session.collectEndsAt}
                  totalNoteCount={totalNoteCount}
                  myVoteCount={myVoteCount}
                  totalVoteCount={totalVoteCount}
                  isHost={isHost}
                  amReady={amReady}
                  readyCount={readyCount}
                  participantCount={participantCount}
                  onReveal={handleReveal}
                  onStartVoting={handleStartVoting}
                  onEndVoting={handleEndVoting}
                  onSetTimer={handleSetTimer}
                  onSetMaxVotes={handleSetMaxVotes}
                  onSetReady={handleSetReady}
                />
                <ExportButton session={session} />
              </Stack>
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
                  People ({session.participants.length})
                </Typography>
              </Box>
              <ParticipantList
                participants={session.participants}
                notes={session.notes}
                revealed={session.revealed}
                selfId={participantId}
                hostId={session.hostId}
                canTransferHost={isHost}
                onTransferHost={handleTransferHost}
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
          Retros are ephemeral. They vanish when everyone leaves or the server
          restarts. No accounts, no data stored. Export action items before you
          go.
        </Typography>
      </Stack>
    </Container>
  );
}
