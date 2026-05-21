"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { Clipboard, Check } from "lucide-react";
import type { RetroSessionSnapshot } from "@/lib/retro/types";

export interface ExportButtonProps {
  session: RetroSessionSnapshot;
}

function buildMarkdown(session: RetroSessionSnapshot): string {
  const lines: string[] = [];
  const title = session.topic.trim() || `Retro ${session.id}`;
  const date = new Date().toISOString().slice(0, 10);
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`Date: ${date}`);
  lines.push(`Template: ${session.template.name}`);
  lines.push("");

  lines.push("## Notes");
  for (const column of session.template.columns) {
    const inCol = session.notes
      .filter((n) => n.columnId === column.id)
      .sort((a, b) => a.createdAt - b.createdAt);
    if (inCol.length === 0) continue;
    lines.push("");
    lines.push(`### ${column.name}`);
    for (const note of inCol) {
      const text = note.text ?? "(hidden)";
      const cleaned = text.replace(/\r?\n/g, " ");
      lines.push(`- ${cleaned} — ${note.authorName}`);
    }
  }

  lines.push("");
  lines.push("## Action items");
  if (session.actionItems.length === 0) {
    lines.push("");
    lines.push("_None captured._");
  } else {
    const sorted = [...session.actionItems].sort(
      (a, b) => a.createdAt - b.createdAt,
    );
    for (const action of sorted) {
      const cleaned = action.text.replace(/\r?\n/g, " ");
      const owner = action.owner ? ` (owner: ${action.owner})` : "";
      lines.push(`- [ ] ${cleaned}${owner}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

export function ExportButton({ session }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildMarkdown(session));
      setCopied(true);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={copied ? <Check size={16} /> : <Clipboard size={16} />}
        onClick={() => {
          void copy();
        }}
      >
        {copied ? "Copied" : "Copy as markdown"}
      </Button>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => {
          setCopied(false);
        }}
        message="Retro copied to clipboard"
      />
    </>
  );
}
