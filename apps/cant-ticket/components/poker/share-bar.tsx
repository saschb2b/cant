"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Copy, Check } from "lucide-react";

export interface ShareBarProps {
  sessionId: string;
}

export function ShareBar({ sessionId }: ShareBarProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/poker/${sessionId}`);
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        size="small"
        value={url}
        slotProps={{ input: { readOnly: true } }}
        sx={{ flex: 1 }}
        onFocus={(e) => {
          e.target.select();
        }}
      />
      <Button
        variant="outlined"
        startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
        onClick={() => {
          void copy();
        }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
      <IconButton
        sx={{ display: { xs: "inline-flex", sm: "none" } }}
        onClick={() => {
          void copy();
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </IconButton>
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => {
          setCopied(false);
        }}
        message="Link copied"
      />
    </Box>
  );
}
