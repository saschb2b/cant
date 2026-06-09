"use client";

import { useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NoteSnapshot, RetroColumn, RetroPhase } from "@/lib/retro/types";
import { NoteCard } from "./note-card";
import { NoteComposer } from "./note-composer";
import { NoteStack } from "./stack";

export interface ColumnProps {
  column: RetroColumn;
  notes: NoteSnapshot[];
  participantId: string;
  revealed: boolean;
  phase: RetroPhase;
  voteCounts: Record<string, number>;
  myVotedTargets: string[];
  budgetExhausted: boolean;
  /** Highest vote count on the board (results only); flags the top cards. */
  topVoteCount: number;
  onVote: (targetKey: string, voted: boolean) => void;
  /** id (note:X or stack:X) of the current drop target, for hover styling */
  mergeTargetId: string | null;
  onAddNote: (text: string) => void;
  onEditNote: (noteId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onPromote: (text: string) => void;
  onUnstack: (groupId: string) => void;
  onReorder: (groupId: string, noteIds: string[]) => void;
  onAddContext: (noteId: string, text: string) => void;
  onDeleteContext: (noteId: string, contextId: string) => void;
}

interface ColumnItem {
  kind: "note" | "stack";
  /** Sort key */
  createdAt: number;
  /** Group id if kind === "stack" */
  groupId?: string;
  /** Note(s) — single note for kind === "note", multiple for kind === "stack" */
  notes: NoteSnapshot[];
}

function buildItems(
  notes: NoteSnapshot[],
  voteCounts: Record<string, number>,
  sortByVotes: boolean,
): ColumnItem[] {
  const groups = new Map<string, NoteSnapshot[]>();
  const loose: NoteSnapshot[] = [];
  for (const note of notes) {
    if (note.groupId) {
      const arr = groups.get(note.groupId) ?? [];
      arr.push(note);
      groups.set(note.groupId, arr);
    } else {
      loose.push(note);
    }
  }
  const items: ColumnItem[] = [];
  for (const [groupId, members] of groups) {
    // A group with one member is just a note (defensive — server should already orphan)
    if (members.length === 1) {
      const single = members[0];
      if (single) {
        items.push({
          kind: "note",
          createdAt: single.createdAt,
          notes: [single],
        });
      }
      continue;
    }
    const minCreated = Math.min(...members.map((n) => n.createdAt));
    items.push({
      kind: "stack",
      createdAt: minCreated,
      groupId,
      notes: members,
    });
  }
  for (const note of loose) {
    items.push({ kind: "note", createdAt: note.createdAt, notes: [note] });
  }
  if (sortByVotes) {
    items.sort((a, b) => {
      const aKey =
        a.kind === "stack" && a.groupId
          ? `group:${a.groupId}`
          : `note:${a.notes[0]?.id ?? ""}`;
      const bKey =
        b.kind === "stack" && b.groupId
          ? `group:${b.groupId}`
          : `note:${b.notes[0]?.id ?? ""}`;
      const aVotes = voteCounts[aKey] ?? 0;
      const bVotes = voteCounts[bKey] ?? 0;
      if (aVotes !== bVotes) return bVotes - aVotes;
      return a.createdAt - b.createdAt;
    });
  } else {
    items.sort((a, b) => a.createdAt - b.createdAt);
  }
  return items;
}

export function Column({
  column,
  notes,
  participantId,
  revealed,
  phase,
  voteCounts,
  myVotedTargets,
  budgetExhausted,
  topVoteCount,
  onVote,
  mergeTargetId,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onPromote,
  onUnstack,
  onReorder,
  onAddContext,
  onDeleteContext,
}: ColumnProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `col:${column.id}`,
    data: { type: "column" as const, columnId: column.id },
  });

  const sortByVotes = phase === "results";
  const items = buildItems(notes, voteCounts, sortByVotes);
  const showVoteChips = phase === "vote" || phase === "results";
  // While voting: hide the tally (no bandwagon), show each voter their own
  // picks. In results: reveal the tally, but neutrally, so a shared screen
  // never exposes who voted for what.
  const voteDisplay = {
    showCount: phase === "results",
    showVoted: phase === "vote",
  };
  const isResults = phase === "results";
  const myVotedSet = new Set(myVotedTargets);

  return (
    <Paper
      ref={setDropRef}
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        minHeight: 240,
        borderColor: isOver ? "primary.main" : "divider",
        bgcolor: isOver
          ? "rgba(var(--mui-palette-primary-mainChannel) / 0.04)"
          : "background.paper",
        transition: "border-color 150ms ease, background-color 150ms ease",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography variant="subtitle1" fontWeight={700}>
          {column.name}
        </Typography>
        <Chip
          label={notes.length}
          size="small"
          sx={{
            height: 18,
            fontSize: "0.65rem",
            fontWeight: 700,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Stack>
      {column.hint && (
        <Typography variant="caption" color="text.secondary">
          {column.hint}
        </Typography>
      )}

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}
      >
        {items.map((item) => {
          if (item.kind === "stack" && item.groupId) {
            const groupId = item.groupId;
            const targetKey = `group:${groupId}`;
            const isTarget = mergeTargetId === `stack:${groupId}`;
            const voted = myVotedSet.has(targetKey);
            const count = voteCounts[targetKey] ?? 0;
            const stackVoteState = showVoteChips
              ? {
                  count,
                  voted,
                  budgetExhausted,
                  ...voteDisplay,
                  highlight:
                    isResults && topVoteCount > 0 && count === topVoteCount,
                  onToggle: () => {
                    onVote(targetKey, !voted);
                  },
                }
              : null;
            return (
              <NoteStack
                key={`stack-${groupId}`}
                groupId={groupId}
                columnId={column.id}
                notes={item.notes}
                participantId={participantId}
                revealed={revealed}
                phase={phase}
                isMergeTarget={isTarget}
                voteState={stackVoteState}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
                onPromote={onPromote}
                onUnstack={onUnstack}
                onReorder={onReorder}
                onAddContext={onAddContext}
                onDeleteContext={onDeleteContext}
              />
            );
          }
          const note = item.notes[0];
          if (!note) return null;
          const targetKey = `note:${note.id}`;
          const isTarget = mergeTargetId === `note:${note.id}`;
          const voted = myVotedSet.has(targetKey);
          const count = voteCounts[targetKey] ?? 0;
          const noteVoteState = showVoteChips
            ? {
                count,
                voted,
                budgetExhausted,
                ...voteDisplay,
                highlight:
                  isResults && topVoteCount > 0 && count === topVoteCount,
                onToggle: () => {
                  onVote(targetKey, !voted);
                },
              }
            : null;
          return (
            <NoteCard
              key={note.id}
              note={note}
              isAuthor={note.authorId === participantId}
              revealed={revealed}
              phase={phase}
              participantId={participantId}
              isMergeTarget={isTarget}
              voteState={noteVoteState}
              onEdit={(text) => {
                onEditNote(note.id, text);
              }}
              onDelete={() => {
                onDeleteNote(note.id);
              }}
              onPromote={onPromote}
              onAddContext={(text) => {
                onAddContext(note.id, text);
              }}
              onDeleteContext={(contextId) => {
                onDeleteContext(note.id, contextId);
              }}
            />
          );
        })}
      </Box>

      {phase === "collect" && <NoteComposer onAdd={onAddNote} />}
    </Paper>
  );
}
