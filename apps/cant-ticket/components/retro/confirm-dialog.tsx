"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Trash2 } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** Optional snippet of the item being deleted, shown in a bordered box. */
  preview?: string | null;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Destructive-action confirmation used to guard accidental deletes in the
 * retro room (notes, action items). Renders a red confirm button and an
 * optional preview of the thing being removed.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  preview,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2" sx={{ mb: preview ? 1.5 : 0 }}>
          {description}
        </DialogContentText>
        {preview && (
          <Box
            sx={{
              p: 1.25,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {preview}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Trash2 size={14} />}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
