import type { NoteSnapshot, RetroSessionSnapshot } from "./types";
import { countLabel } from "./format";

export interface ExportOptions {
  includeHeader: boolean;
  includeNotes: boolean;
  includeContexts: boolean;
  includeActions: boolean;
  includeVotes: boolean;
  anonymous: boolean;
}

export const DEFAULT_OPTIONS: ExportOptions = {
  includeHeader: true,
  includeNotes: true,
  includeContexts: true,
  includeActions: true,
  includeVotes: true,
  anonymous: false,
};

function authorOf(name: string, anonymous: boolean): string {
  return anonymous ? "Anonymous" : name;
}

interface ColumnItem {
  kind: "note" | "stack";
  groupId?: string;
  notes: NoteSnapshot[];
  /** Sort key for ordering items within the column. */
  primaryCreatedAt: number;
}

function buildColumnItems(notes: NoteSnapshot[]): ColumnItem[] {
  const stacks = new Map<string, NoteSnapshot[]>();
  const loose: NoteSnapshot[] = [];
  for (const note of notes) {
    if (note.groupId) {
      const arr = stacks.get(note.groupId) ?? [];
      arr.push(note);
      stacks.set(note.groupId, arr);
    } else {
      loose.push(note);
    }
  }
  const items: ColumnItem[] = [];
  for (const [groupId, members] of stacks) {
    if (members.length === 1) {
      const only = members[0];
      if (only) {
        items.push({
          kind: "note",
          notes: [only],
          primaryCreatedAt: only.createdAt,
        });
      }
      continue;
    }
    const primaryCreatedAt = Math.min(...members.map((n) => n.createdAt));
    items.push({ kind: "stack", groupId, notes: members, primaryCreatedAt });
  }
  for (const note of loose) {
    items.push({
      kind: "note",
      notes: [note],
      primaryCreatedAt: note.createdAt,
    });
  }
  return items;
}

function voteCountForItem(
  item: ColumnItem,
  voteCounts: Record<string, number>,
): number {
  if (item.kind === "stack" && item.groupId) {
    return voteCounts[`group:${item.groupId}`] ?? 0;
  }
  const note = item.notes[0];
  if (!note) return 0;
  return voteCounts[`note:${note.id}`] ?? 0;
}

function renderNoteLine(
  note: NoteSnapshot,
  options: ExportOptions,
  voteCounts: Record<string, number>,
  indent: number,
  showVoteSuffix: boolean,
): string[] {
  const out: string[] = [];
  const prefix = " ".repeat(indent);
  const text = (note.text ?? "(hidden)").replace(/\r?\n/g, " ");
  const author = authorOf(note.authorName, options.anonymous);
  let suffix = "";
  if (showVoteSuffix && options.includeVotes) {
    const count = voteCounts[`note:${note.id}`] ?? 0;
    if (count > 0) suffix = ` (${countLabel(count, "vote")})`;
  }
  out.push(`${prefix}- ${text} — ${author}${suffix}`);
  if (options.includeContexts) {
    for (const ctx of note.contexts) {
      const ctxText = ctx.text.replace(/\r?\n/g, " ");
      const ctxAuthor = authorOf(ctx.authorName, options.anonymous);
      out.push(`${prefix}  > Context (${ctxAuthor}): ${ctxText}`);
    }
  }
  return out;
}

export function buildMarkdown(
  session: RetroSessionSnapshot,
  options: ExportOptions,
): string {
  const lines: string[] = [];

  if (options.includeHeader) {
    const title = session.topic.trim() || `Retro ${session.id}`;
    const date = new Date().toISOString().slice(0, 10);
    lines.push(`# ${title}`);
    lines.push("");
    lines.push(`Date: ${date}`);
    lines.push(`Template: ${session.template.name}`);
    lines.push("");
  }

  if (options.includeNotes) {
    lines.push("## Notes");
    for (const column of session.template.columns) {
      const inCol = session.notes.filter((n) => n.columnId === column.id);
      if (inCol.length === 0) continue;

      const items = buildColumnItems(inCol);
      items.sort((a, b) => {
        if (options.includeVotes) {
          const va = voteCountForItem(a, session.voteCounts);
          const vb = voteCountForItem(b, session.voteCounts);
          if (va !== vb) return vb - va;
        }
        return a.primaryCreatedAt - b.primaryCreatedAt;
      });

      lines.push("");
      lines.push(`### ${column.name}`);
      for (const item of items) {
        if (item.kind === "note") {
          const note = item.notes[0];
          if (!note) continue;
          lines.push(
            ...renderNoteLine(note, options, session.voteCounts, 0, true),
          );
          continue;
        }
        // Stack: top of the stack is the headline (rank 0).
        const sorted = [...item.notes].sort((a, b) => a.rank - b.rank);
        const top = sorted[0];
        if (!top) continue;
        const topText = (top.text ?? "(hidden)").replace(/\r?\n/g, " ");
        const topAuthor = authorOf(top.authorName, options.anonymous);
        let suffix = "";
        if (options.includeVotes && item.groupId) {
          const count = session.voteCounts[`group:${item.groupId}`] ?? 0;
          if (count > 0) suffix = ` (${countLabel(count, "vote")})`;
        }
        lines.push(`- ${topText} — ${topAuthor}${suffix}`);
        if (options.includeContexts) {
          for (const ctx of top.contexts) {
            const ctxText = ctx.text.replace(/\r?\n/g, " ");
            const ctxAuthor = authorOf(ctx.authorName, options.anonymous);
            lines.push(`  > Context (${ctxAuthor}): ${ctxText}`);
          }
        }
        for (let i = 1; i < sorted.length; i += 1) {
          const sib = sorted[i];
          if (!sib) continue;
          // Suppress per-note vote suffix inside a stack — the headline
          // already carries the stack's total.
          lines.push(
            ...renderNoteLine(sib, options, session.voteCounts, 2, false),
          );
        }
      }
    }
    lines.push("");
  }

  if (options.includeActions) {
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
        // Owners are kept even in anonymous mode. Anonymity protects who voiced
        // a piece of feedback, not who owns a follow-up commitment: an action
        // item without an owner has no accountability.
        const owner = action.owner ? ` (owner: ${action.owner})` : "";
        lines.push(`- [ ] ${cleaned}${owner}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
