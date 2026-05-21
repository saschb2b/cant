"use client";

import { useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NoteSnapshot, RetroColumn } from "@/lib/retro/types";
import { NoteCard } from "./note-card";
import { NoteComposer } from "./note-composer";
import { NoteStack } from "./stack";

export interface ColumnProps {
  column: RetroColumn;
  notes: NoteSnapshot[];
  participantId: string;
  revealed: boolean;
  /** id (note:X or stack:X) of the current drop target, for hover styling */
  mergeTargetId: string | null;
  onAddNote: (text: string) => void;
  onEditNote: (noteId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onPromote: (text: string) => void;
  onUnstack: (groupId: string) => void;
  onReorder: (groupId: string, noteIds: string[]) => void;
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

function buildItems(notes: NoteSnapshot[]): ColumnItem[] {
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
  items.sort((a, b) => a.createdAt - b.createdAt);
  return items;
}

export function Column({
  column,
  notes,
  participantId,
  revealed,
  mergeTargetId,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onPromote,
  onUnstack,
  onReorder,
}: ColumnProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `col:${column.id}`,
    data: { type: "column" as const, columnId: column.id },
  });

  const items = buildItems(notes);

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
            const isTarget = mergeTargetId === `stack:${item.groupId}`;
            return (
              <NoteStack
                key={`stack-${item.groupId}`}
                groupId={item.groupId}
                columnId={column.id}
                notes={item.notes}
                participantId={participantId}
                revealed={revealed}
                isMergeTarget={isTarget}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
                onPromote={onPromote}
                onUnstack={onUnstack}
                onReorder={onReorder}
              />
            );
          }
          const note = item.notes[0];
          if (!note) return null;
          const isTarget = mergeTargetId === `note:${note.id}`;
          return (
            <NoteCard
              key={note.id}
              note={note}
              isAuthor={note.authorId === participantId}
              revealed={revealed}
              isMergeTarget={isTarget}
              onEdit={(text) => {
                onEditNote(note.id, text);
              }}
              onDelete={() => {
                onDeleteNote(note.id);
              }}
              onPromote={onPromote}
            />
          );
        })}
      </Box>

      {!revealed && <NoteComposer onAdd={onAddNote} />}
    </Paper>
  );
}
