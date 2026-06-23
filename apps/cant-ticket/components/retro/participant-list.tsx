"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Check, Crown } from "lucide-react";
import {
  ParticipantAvatar,
  type AvatarState,
} from "@/components/rooms/participant-avatar";
import type { NoteSnapshot, RetroParticipantSnapshot } from "@/lib/retro/types";
import { countLabel } from "@/lib/retro/format";
import { countNotesByAuthor } from "@/lib/retro/note-counts";

function avatarStateFor(noteCount: number, revealed: boolean): AvatarState {
  if (revealed) return "settled";
  return noteCount > 0 ? "voted" : "thinking";
}

export interface ParticipantListProps {
  participants: RetroParticipantSnapshot[];
  notes: NoteSnapshot[];
  revealed: boolean;
  selfId: string;
  hostId: string;
  canTransferHost: boolean;
  onTransferHost: (toParticipantId: string) => void;
}

export function ParticipantList({
  participants,
  notes,
  revealed,
  selfId,
  hostId,
  canTransferHost,
  onTransferHost,
}: ParticipantListProps) {
  const noteCounts = countNotesByAuthor(notes);
  const [pendingTransfer, setPendingTransfer] =
    useState<RetroParticipantSnapshot | null>(null);
  const sorted = [...participants].sort((a, b) => {
    if (a.id === selfId) return -1;
    if (b.id === selfId) return 1;
    if (a.id === hostId) return -1;
    if (b.id === hostId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Stack divider={<Divider flexItem />}>
      {sorted.map((p) => {
        const isSelf = p.id === selfId;
        const isHost = p.id === hostId;
        const canPromote = canTransferHost && !isHost;
        const noteCount = noteCounts.get(p.id) ?? 0;
        return (
          <Box
            key={p.id}
            sx={{
              position: "relative",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.25 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 1.75 },
              bgcolor: isSelf ? "action.hover" : "transparent",
              borderLeft: 3,
              borderColor: isHost ? "warning.main" : "transparent",
              "&:hover .transfer-host-btn": { opacity: 1 },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <ParticipantAvatar
                seed={p.id}
                size={40}
                title={p.name}
                state={avatarStateFor(noteCount, revealed)}
              />
              {isHost && (
                <Box
                  title="Host"
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 2,
                    borderColor: "background.paper",
                  }}
                >
                  <Crown size={10} fill="currentColor" />
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={600} noWrap>
                  {p.name}
                  {isSelf ? " (you)" : ""}
                </Typography>
                {isHost && (
                  <Chip
                    icon={<Crown size={10} fill="currentColor" />}
                    label="Host"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      bgcolor: "warning.main",
                      color: "warning.contrastText",
                      "& .MuiChip-icon": {
                        color: "inherit",
                        ml: 0.5,
                        mr: -0.25,
                      },
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.65rem" }}
              >
                {noteCount === 0
                  ? "no notes yet"
                  : countLabel(noteCount, "note")}
              </Typography>
            </Box>
            {p.isReady && (
              <Box
                title="Ready"
                aria-label="Ready"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  color: "success.contrastText",
                }}
              >
                <Check size={12} strokeWidth={3} />
              </Box>
            )}
            {noteCount > 0 && (
              <Chip
                label={noteCount}
                size="small"
                color={revealed ? "default" : "success"}
                variant={revealed ? "outlined" : "filled"}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  minWidth: 28,
                }}
              />
            )}
            {canPromote && (
              <Tooltip title={`Make ${p.name} host`}>
                <IconButton
                  className="transfer-host-btn"
                  size="small"
                  aria-label={`Make ${p.name} host`}
                  onClick={() => {
                    setPendingTransfer(p);
                  }}
                  sx={{
                    opacity: { xs: 1, sm: 0 },
                    transition: "opacity 0.15s",
                    color: "text.disabled",
                    "&:hover": { color: "warning.main" },
                  }}
                >
                  <Crown size={14} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      })}
      <Dialog
        open={pendingTransfer !== null}
        onClose={() => {
          setPendingTransfer(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Transfer host?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {pendingTransfer
              ? `${pendingTransfer.name} will become host and control the retro phases. You will lose moderation controls.`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPendingTransfer(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              if (pendingTransfer) onTransferHost(pendingTransfer.id);
              setPendingTransfer(null);
            }}
          >
            Transfer host
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
