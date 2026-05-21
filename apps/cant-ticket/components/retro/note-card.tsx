"use client";

import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ArrowUpRight, EyeOff, Pencil, Trash2 } from "lucide-react";
import { ParticipantAvatar } from "@/components/rooms/participant-avatar";
import type { NoteSnapshot } from "@/lib/retro/types";

export interface NoteCardProps {
  note: NoteSnapshot;
  isAuthor: boolean;
  revealed: boolean;
  /** Whether this card is currently being shown inside the DragOverlay. */
  asOverlay?: boolean;
  /** Whether the drop indicator should be shown (drag is hovering over this card). */
  isMergeTarget?: boolean;
  onEdit: (text: string) => void;
  onDelete: () => void;
  onPromote: (text: string) => void;
}

export function NoteCard({
  note,
  isAuthor,
  revealed,
  asOverlay = false,
  isMergeTarget = false,
  onEdit,
  onDelete,
  onPromote,
}: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text ?? "");
  const hidden = note.text === null;
  const canDrag = (revealed || isAuthor) && !hidden && !editing;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `note:${note.id}`,
    data: {
      type: "note" as const,
      noteId: note.id,
      columnId: note.columnId,
      groupId: note.groupId,
      authorId: note.authorId,
    },
    disabled: !canDrag || asOverlay,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `note-drop:${note.id}`,
    data: {
      type: "note" as const,
      noteId: note.id,
      columnId: note.columnId,
      groupId: note.groupId,
    },
    disabled: editing || asOverlay,
  });

  function commitEdit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onEdit(trimmed);
    setEditing(false);
  }

  if (editing && isAuthor) {
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: 1.5,
          borderColor: "primary.main",
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <TextField
          autoFocus
          multiline
          minRows={3}
          fullWidth
          size="small"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              commitEdit();
            }
            if (e.key === "Escape") {
              setDraft(note.text ?? "");
              setEditing(false);
            }
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1 }}
          justifyContent="flex-end"
        >
          <Button
            size="small"
            onClick={() => {
              setDraft(note.text ?? "");
              setEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={commitEdit}>
            Save
          </Button>
        </Stack>
      </Box>
    );
  }

  const dragStyle: React.CSSProperties = {
    transform: transform
      ? `translate3d(${String(transform.x)}px, ${String(transform.y)}px, 0)`
      : undefined,
    opacity: isDragging && !asOverlay ? 0.35 : 1,
    cursor: canDrag ? (isDragging ? "grabbing" : "grab") : "default",
    transition: isDragging
      ? "none"
      : "transform 200ms ease, opacity 150ms ease",
  };

  return (
    <Box
      ref={(el: HTMLElement | null) => {
        setDragRef(el);
        setDropRef(el);
      }}
      {...attributes}
      {...listeners}
      style={dragStyle}
      sx={{
        position: "relative",
        p: 1.5,
        borderRadius: 2,
        border: 1.5,
        borderColor: isMergeTarget
          ? "primary.main"
          : hidden
            ? "divider"
            : "divider",
        bgcolor: hidden ? "action.hover" : "background.paper",
        boxShadow: asOverlay
          ? 6
          : isMergeTarget
            ? `inset 0 0 0 2px var(--mui-palette-primary-main)`
            : 0,
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        "&:hover": {
          borderColor: hidden ? "divider" : "text.disabled",
          "& .note-actions": { opacity: 1 },
        },
      }}
    >
      {hidden ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
          <EyeOff size={14} />
          <Typography
            variant="body2"
            color="text.disabled"
            fontStyle="italic"
            sx={{ fontSize: "0.8rem" }}
          >
            Hidden until reveal
          </Typography>
        </Stack>
      ) : (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.5,
            color: "text.primary",
          }}
        >
          {note.text}
        </Typography>
      )}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          mt: 1,
          pt: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        {revealed && !hidden && (
          <ParticipantAvatar
            seed={note.authorId}
            size={20}
            title={note.authorName}
            state="static"
          />
        )}
        <Typography
          variant="caption"
          color="text.disabled"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ fontSize: "0.65rem", flex: 1 }}
        >
          {note.authorName}
          {isAuthor ? " (you)" : ""}
        </Typography>
      </Stack>

      {!asOverlay && (
        <Stack
          direction="row"
          spacing={0.25}
          className="note-actions"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            opacity: { xs: 1, sm: 0 },
            transition: "opacity 0.15s",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {revealed && !hidden && note.text !== null && (
            <IconButton
              size="small"
              onClick={() => {
                onPromote(note.text ?? "");
              }}
              aria-label="Promote to action item"
              title="Promote to action item"
              sx={{ p: 0.25 }}
            >
              <ArrowUpRight size={14} />
            </IconButton>
          )}
          {isAuthor && !hidden && !revealed && (
            <>
              <IconButton
                size="small"
                onClick={() => {
                  setEditing(true);
                }}
                aria-label="Edit note"
                sx={{ p: 0.25 }}
              >
                <Pencil size={14} />
              </IconButton>
              <IconButton
                size="small"
                onClick={onDelete}
                aria-label="Delete note"
                sx={{ p: 0.25 }}
              >
                <Trash2 size={14} />
              </IconButton>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}
