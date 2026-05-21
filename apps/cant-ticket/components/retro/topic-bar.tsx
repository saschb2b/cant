"use client";

import { useEffect, useState } from "react";
import InputBase from "@mui/material/InputBase";

export interface TopicBarProps {
  topic: string;
  onChange: (next: string) => void;
}

export function TopicBar({ topic, onChange }: TopicBarProps) {
  const [draft, setDraft] = useState(topic);

  useEffect(() => {
    setDraft(topic);
  }, [topic]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed !== topic) onChange(trimmed);
  }

  return (
    <InputBase
      value={draft}
      placeholder="Sprint 42 retro, or whatever you call it"
      onChange={(e) => {
        setDraft(e.target.value);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
      inputProps={{ maxLength: 200, "aria-label": "Retro topic" }}
      sx={{
        width: "100%",
        fontSize: "1.25rem",
        fontWeight: 600,
        "& input::placeholder": {
          color: "text.disabled",
          opacity: 1,
        },
      }}
    />
  );
}
