"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Folder, File } from "lucide-react";

const treeSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  p: 1.5,
} as const;

const iconSx = { flexShrink: 0, width: 14, height: 14 } as const;

interface TreeEntry {
  name: string;
  type: "folder" | "file";
  indent?: number;
}

function TreeView({ entries }: { entries: TreeEntry[] }) {
  return (
    <List dense disablePadding>
      {entries.map((entry, i) => {
        const Icon = entry.type === "folder" ? Folder : File;
        const color =
          entry.type === "folder" ? "warning.main" : "text.secondary";
        return (
          <ListItem
            key={`${entry.name}-${String(i)}`}
            disableGutters
            disablePadding
            sx={{ pl: (entry.indent ?? 0) * 2, minHeight: 20, py: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  color,
                  ...iconSx,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icon size={14} />
              </Box>
              <Typography
                sx={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "text.primary",
                }}
              >
                {entry.name}
              </Typography>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}

/* ---------- Co-located tests (strat-002 left) ---------- */

const colocatedEntries: TreeEntry[] = [
  { name: "src/", type: "folder" },
  { name: "components/", type: "folder", indent: 1 },
  { name: "Button.tsx", type: "file", indent: 2 },
  { name: "Button.test.tsx", type: "file", indent: 2 },
  { name: "Dialog.tsx", type: "file", indent: 2 },
  { name: "Dialog.test.tsx", type: "file", indent: 2 },
  { name: "hooks/", type: "folder", indent: 1 },
  { name: "useAuth.ts", type: "file", indent: 2 },
  { name: "useAuth.test.ts", type: "file", indent: 2 },
  { name: "utils/", type: "folder", indent: 1 },
  { name: "format.ts", type: "file", indent: 2 },
  { name: "format.test.ts", type: "file", indent: 2 },
];

export function FileTreeColocated() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={colocatedEntries} />
    </Paper>
  );
}

/* ---------- Separate __tests__ directory (strat-002 right) ---------- */

const separateEntries: TreeEntry[] = [
  { name: "src/", type: "folder" },
  { name: "components/", type: "folder", indent: 1 },
  { name: "Button.tsx", type: "file", indent: 2 },
  { name: "Dialog.tsx", type: "file", indent: 2 },
  { name: "hooks/", type: "folder", indent: 1 },
  { name: "useAuth.ts", type: "file", indent: 2 },
  { name: "utils/", type: "folder", indent: 1 },
  { name: "format.ts", type: "file", indent: 2 },
  { name: "__tests__/", type: "folder" },
  { name: "components/", type: "folder", indent: 1 },
  { name: "Button.test.tsx", type: "file", indent: 2 },
  { name: "Dialog.test.tsx", type: "file", indent: 2 },
  { name: "hooks/", type: "folder", indent: 1 },
  { name: "useAuth.test.ts", type: "file", indent: 2 },
  { name: "utils/", type: "folder", indent: 1 },
  { name: "format.test.ts", type: "file", indent: 2 },
];

export function FileTreeSeparate() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={separateEntries} />
    </Paper>
  );
}
