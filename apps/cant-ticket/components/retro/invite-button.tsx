"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Check, Copy, Share2 } from "lucide-react";

export interface InviteButtonProps {
  sessionId: string;
}

export function InviteButton({ sessionId }: InviteButtonProps) {
  const [url, setUrl] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setUrl(`${window.location.origin}/rooms/retro/${sessionId}`);
  }, [sessionId]);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Share2 size={14} />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={{ display: { xs: "none", sm: "inline-flex" }, flexShrink: 0 }}
      >
        Invite
      </Button>
      <IconButton
        size="small"
        aria-label="Invite"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={{ display: { xs: "inline-flex", sm: "none" }, flexShrink: 0 }}
      >
        <Share2 size={16} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { mt: 1, p: 2, width: 360, maxWidth: "90vw" } },
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle2">Invite to this retro</Typography>
            <Typography variant="caption" color="text.secondary">
              Share this link. Anyone with it can join.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              fullWidth
              value={url}
              slotProps={{ input: { readOnly: true } }}
              onFocus={(e) => {
                e.target.select();
              }}
            />
            <Button
              variant="contained"
              startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={() => {
                void copy();
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </Stack>
        </Stack>
      </Popover>
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => {
          setCopied(false);
        }}
        message="Link copied"
      />
    </>
  );
}
