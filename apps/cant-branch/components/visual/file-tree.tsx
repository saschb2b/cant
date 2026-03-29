"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Folder, File, FileText } from "lucide-react";

const treeSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  p: 1.5,
} as const;

const iconSx = { flexShrink: 0, width: 14, height: 14 } as const;

interface TreeEntry {
  name: string;
  type: "folder" | "file" | "doc";
  indent?: number;
  warning?: boolean;
  size?: string;
}

function TreeView({ entries }: { entries: TreeEntry[] }) {
  return (
    <List dense disablePadding>
      {entries.map((entry, i) => {
        const Icon =
          entry.type === "folder"
            ? Folder
            : entry.type === "doc"
              ? FileText
              : File;
        const color = entry.warning
          ? "error.main"
          : entry.type === "folder"
            ? "warning.main"
            : "text.secondary";
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
                sx={{ color, ...iconSx, display: "flex", alignItems: "center" }}
              >
                <Icon size={14} />
              </Box>
              <Typography
                sx={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: entry.warning ? "error.main" : "text.primary",
                  flex: 1,
                }}
              >
                {entry.name}
              </Typography>
              {entry.size && (
                <Typography
                  sx={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: "text.disabled",
                    bgcolor: "action.hover",
                    px: 0.5,
                    borderRadius: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.size}
                </Typography>
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}

/* ---------- Dirty repo (tracked files that should be ignored) ---------- */

const dirtyEntries: TreeEntry[] = [
  { name: "node_modules/", type: "folder", warning: true },
  { name: "dist/", type: "folder", warning: true },
  { name: "build/", type: "folder", warning: true },
  { name: ".env", type: "file", warning: true },
  { name: ".DS_Store", type: "file", warning: true },
  { name: "package.json", type: "file" },
  { name: "src/", type: "folder" },
  { name: "index.ts", type: "file", indent: 1 },
  { name: "app.ts", type: "file", indent: 1 },
  { name: "thumbs.db", type: "file", warning: true },
  { name: "debug.log", type: "file", warning: true },
];

export function FileTreeDirty() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={dirtyEntries} />
    </Paper>
  );
}

/* ---------- Clean repo (proper .gitignore) ---------- */

const cleanEntries: TreeEntry[] = [
  { name: ".gitignore", type: "file" },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "src/", type: "folder" },
  { name: "index.ts", type: "file", indent: 1 },
  { name: "app.ts", type: "file", indent: 1 },
  { name: "utils/", type: "folder", indent: 1 },
  { name: "format.ts", type: "file", indent: 2 },
  { name: "tests/", type: "folder" },
  { name: "app.test.ts", type: "file", indent: 1 },
];

export function FileTreeClean() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={cleanEntries} />
    </Paper>
  );
}

/* ---------- Bad repo structure ---------- */

const badStructureEntries: TreeEntry[] = [
  { name: "app.js", type: "file" },
  { name: "helper.js", type: "file" },
  { name: "helper2.js", type: "file" },
  { name: "test.js", type: "file" },
  { name: "style.css", type: "file" },
  { name: "logo.png", type: "file" },
  { name: "notes.txt", type: "file" },
  { name: "old_app_backup.js", type: "file", warning: true },
  { name: "temp.js", type: "file", warning: true },
  { name: "config_FINAL_v2.json", type: "file", warning: true },
];

export function FileTreeBadStructure() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={badStructureEntries} />
    </Paper>
  );
}

/* ---------- Good repo structure ---------- */

const goodStructureEntries: TreeEntry[] = [
  { name: "README.md", type: "doc" },
  { name: "LICENSE", type: "doc" },
  { name: "CONTRIBUTING.md", type: "doc" },
  { name: ".gitignore", type: "file" },
  { name: "package.json", type: "file" },
  { name: "src/", type: "folder" },
  { name: "index.ts", type: "file", indent: 1 },
  { name: "components/", type: "folder", indent: 1 },
  { name: "utils/", type: "folder", indent: 1 },
  { name: "tests/", type: "folder" },
  { name: "index.test.ts", type: "file", indent: 1 },
  { name: "docs/", type: "folder" },
  { name: "setup.md", type: "doc", indent: 1 },
];

export function FileTreeGoodStructure() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={goodStructureEntries} />
    </Paper>
  );
}

/* ---------- Bloated repo (large binary files tracked) ---------- */

const bloatedEntries: TreeEntry[] = [
  { name: "assets/", type: "folder" },
  {
    name: "video-demo.mp4",
    type: "file",
    indent: 1,
    warning: true,
    size: "340 MB",
  },
  { name: "design/", type: "folder" },
  {
    name: "mockups.psd",
    type: "file",
    indent: 1,
    warning: true,
    size: "120 MB",
  },
  { name: "data/", type: "folder" },
  {
    name: "training-set.csv",
    type: "file",
    indent: 1,
    warning: true,
    size: "890 MB",
  },
  { name: "src/", type: "folder" },
  { name: "app.ts", type: "file", indent: 1, size: "2 KB" },
  { name: "package.json", type: "file", size: "1 KB" },
];

export function FileTreeBloatedRepo() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={bloatedEntries} />
      <Typography
        sx={{
          fontSize: 10,
          fontFamily: "monospace",
          color: "text.secondary",
          mt: 0.5,
          px: 1,
        }}
      >
        git clone: 1.4 GB
      </Typography>
    </Paper>
  );
}

/* ---------- LFS repo (large files managed with Git LFS) ---------- */

const lfsEntries: TreeEntry[] = [
  { name: ".gitattributes", type: "file" },
  { name: "assets/", type: "folder" },
  {
    name: "video-demo.mp4 [LFS]",
    type: "file",
    indent: 1,
    size: "340 MB",
  },
  { name: "design/", type: "folder" },
  {
    name: "mockups.psd [LFS]",
    type: "file",
    indent: 1,
    size: "120 MB",
  },
  { name: "data/", type: "folder" },
  {
    name: "training-set.csv [LFS]",
    type: "file",
    indent: 1,
    size: "890 MB",
  },
  { name: "src/", type: "folder" },
  { name: "app.ts", type: "file", indent: 1, size: "2 KB" },
  { name: "package.json", type: "file", size: "1 KB" },
];

export function FileTreeLFSRepo() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={lfsEntries} />
      <Typography
        sx={{
          fontSize: 10,
          fontFamily: "monospace",
          color: "text.secondary",
          mt: 0.5,
          px: 1,
        }}
      >
        git clone: 23 MB (LFS on demand)
      </Typography>
    </Paper>
  );
}

/* ---------- Inconsistent naming (rs-004 left) ---------- */

const inconsistentEntries: TreeEntry[] = [
  { name: "src/", type: "folder" },
  { name: "components/", type: "folder", indent: 1 },
  { name: "Button.tsx", type: "file", indent: 2 },
  { name: "button.css", type: "file", indent: 2 },
  { name: "userProfile/", type: "folder", indent: 1 },
  { name: "user_profile.tsx", type: "file", indent: 2 },
  { name: "UserProfileStyles.css", type: "file", indent: 2 },
  { name: "Utils/", type: "folder", indent: 1 },
  { name: "helpers.ts", type: "file", indent: 2 },
  { name: "DateFormatting.ts", type: "file", indent: 2 },
  { name: "api.ts", type: "file", indent: 1 },
  { name: "API_types.ts", type: "file", indent: 1 },
];

export function FileTreeInconsistentNaming() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={inconsistentEntries} />
    </Paper>
  );
}

/* ---------- Consistent naming (rs-004 right) ---------- */

const consistentEntries: TreeEntry[] = [
  { name: "src/", type: "folder" },
  { name: "components/", type: "folder", indent: 1 },
  { name: "button.tsx", type: "file", indent: 2 },
  { name: "button.module.css", type: "file", indent: 2 },
  { name: "user-profile/", type: "folder", indent: 1 },
  { name: "user-profile.tsx", type: "file", indent: 2 },
  { name: "user-profile.module.css", type: "file", indent: 2 },
  { name: "lib/", type: "folder", indent: 1 },
  { name: "helpers.ts", type: "file", indent: 2 },
  { name: "date-formatting.ts", type: "file", indent: 2 },
  { name: "api/", type: "folder", indent: 1 },
  { name: "client.ts", type: "file", indent: 2 },
  { name: "types.ts", type: "file", indent: 2 },
];

export function FileTreeConsistentNaming() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={consistentEntries} />
    </Paper>
  );
}

/* ---------- Monorepo (rs-006 left) ---------- */

const monorepoEntries: TreeEntry[] = [
  { name: "my-platform/", type: "folder" },
  { name: "apps/", type: "folder", indent: 1 },
  { name: "web/", type: "folder", indent: 2 },
  { name: "api/", type: "folder", indent: 2 },
  { name: "admin/", type: "folder", indent: 2 },
  { name: "packages/", type: "folder", indent: 1 },
  { name: "shared/", type: "folder", indent: 2 },
  { name: "ui/", type: "folder", indent: 2 },
  { name: "db/", type: "folder", indent: 2 },
  { name: "package.json", type: "file", indent: 1 },
  { name: "turbo.json", type: "file", indent: 1 },
];

export function FileTreeMonorepo() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={monorepoEntries} />
    </Paper>
  );
}

/* ---------- Polyrepo (rs-006 right) ---------- */

const polyrepoEntries: TreeEntry[] = [
  { name: "my-platform-web/", type: "folder" },
  { name: "package.json", type: "file", indent: 1 },
  { name: "my-platform-api/", type: "folder" },
  { name: "package.json", type: "file", indent: 1 },
  { name: "my-platform-admin/", type: "folder" },
  { name: "package.json", type: "file", indent: 1 },
  { name: "my-platform-shared/", type: "folder" },
  { name: "package.json", type: "file", indent: 1 },
];

export function FileTreePolyrepo() {
  return (
    <Paper sx={treeSx}>
      <TreeView entries={polyrepoEntries} />
    </Paper>
  );
}
