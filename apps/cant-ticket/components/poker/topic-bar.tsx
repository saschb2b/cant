"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Pencil, Check, X } from "lucide-react";

export interface TopicBarProps {
  topic: string;
  onChange: (topic: string) => void;
}

export function TopicBar({ topic, onChange }: TopicBarProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function startEditing() {
    setDraft(topic);
    setEditing(true);
  }

  function commit() {
    const next = draft.trim();
    if (next !== topic) onChange(next);
    setEditing(false);
  }

  if (editing) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(topic);
              setEditing(false);
            }
          }}
          placeholder="What are we estimating?"
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <IconButton onClick={commit} size="small" color="primary">
          <Check size={18} />
        </IconButton>
        <IconButton
          onClick={() => {
            setDraft(topic);
            setEditing(false);
          }}
          size="small"
        >
          <X size={18} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 40 }}
      onClick={startEditing}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") startEditing();
      }}
    >
      <Typography
        variant="h6"
        sx={{
          flex: 1,
          fontWeight: 600,
          color: topic ? "text.primary" : "text.secondary",
          cursor: "pointer",
        }}
      >
        {topic || "What are we estimating?"}
      </Typography>
      <IconButton size="small" sx={{ color: "text.secondary" }}>
        <Pencil size={16} />
      </IconButton>
    </Box>
  );
}
