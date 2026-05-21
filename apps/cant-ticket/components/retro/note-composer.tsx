"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export interface NoteComposerProps {
  onAdd: (text: string) => void;
}

export function NoteComposer({ onAdd }: NoteComposerProps) {
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
  }

  return (
    <Box
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();
        submit();
      }}
      component="form"
    >
      <TextField
        multiline
        minRows={2}
        maxRows={6}
        fullWidth
        size="small"
        placeholder="Add a note..."
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
        }}
        slotProps={{ htmlInput: { maxLength: 500 } }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <Button
        type="submit"
        size="small"
        variant="contained"
        disabled={draft.trim().length === 0}
        sx={{ mt: 1 }}
        fullWidth
      >
        Add
      </Button>
    </Box>
  );
}
