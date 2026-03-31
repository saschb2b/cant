"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReactDiffViewer from "react-diff-viewer-continued";

const wrapperSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  "& pre": { fontSize: "11px !important", lineHeight: "1.5 !important" },
  "& td": { fontSize: "11px !important" },
} as const;

/* ---------- Giant PR (too many unrelated changes) ---------- */

const giantOld = `// auth.ts
export function login(user: string, pass: string) {
  return fetch("/api/login", { method: "POST", body: JSON.stringify({ user, pass }) });
}

// nav.tsx
export function Nav() {
  return <nav><a href="/">Home</a></nav>;
}

// config.ts
export const API_URL = "http://localhost:3000";
export const TIMEOUT = 5000;

// utils.ts
export function formatDate(d: Date) {
  return d.toISOString();
}

// theme.ts
export const colors = { primary: "#333", secondary: "#666" };`;

const giantNew = `// auth.ts
export async function login(user: string, pass: string, rememberMe: boolean) {
  const res = await fetch("/api/v2/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client": "web" },
    body: JSON.stringify({ user, pass, rememberMe }),
  });
  if (!res.ok) throw new AuthError(res.status);
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}

// nav.tsx
export function Nav() {
  return (
    <nav className="main-nav">
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/settings">Settings</a>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

// config.ts
export const API_URL = process.env.API_URL || "http://localhost:3000";
export const TIMEOUT = 10000;
export const RETRY_COUNT = 3;
export const FEATURE_FLAGS = { darkMode: true, beta: false };

// utils.ts
export function formatDate(d: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale).format(d);
}
export function debounce(fn: Function, ms: number) {
  let timer: NodeJS.Timeout;
  return (...args: unknown[]) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// theme.ts
export const colors = { primary: "#1a73e8", secondary: "#5f6368", accent: "#ea4335", bg: "#fff" };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };`;

export function DiffGiantPR() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          +847 lines, -203 lines across 12 files
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={giantOld}
        newValue={giantNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Focused PR (small, single concern) ---------- */

const focusedOld = `export function formatDate(d: Date) {
  return d.toISOString();
}`;

const focusedNew = `export function formatDate(d: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}`;

export function DiffFocusedPR() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          +7 lines, -2 lines in src/utils/format.ts
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={focusedOld}
        newValue={focusedNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- No context PR ---------- */

const noCtxOld = `const MAX = 100;
function process(items) {
  return items.filter(x => x.active);
}`;

const noCtxNew = `const MAX = 250;
function process(items) {
  return items.filter(x => x.active && !x.archived).slice(0, MAX);
}`;

export function DiffNoContext() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
          PR #482: Update process function
        </Typography>
        <Typography
          sx={{ fontSize: 10, color: "text.disabled", fontStyle: "italic" }}
        >
          No description provided.
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={noCtxOld}
        newValue={noCtxNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Well-documented PR ---------- */

const docOld = `const MAX = 100;
function process(items) {
  return items.filter(x => x.active);
}`;

const docNew = `const MAX = 250;
function process(items) {
  return items.filter(x => x.active && !x.archived).slice(0, MAX);
}`;

export function DiffWellDocumented() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
          PR #482: Fix item list showing archived entries
        </Typography>
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          Closes #479. Archived items were appearing in the dashboard list. This
          filters them out and caps the result at MAX to prevent performance
          issues on large accounts.
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={docOld}
        newValue={docNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Conflict markers left in code ---------- */

const conflictMarkersOld = `function getGreeting(user) {
  return "Hello, " + user.name;
}

function getRole(user) {
  return user.role || "viewer";
}`;

const conflictMarkersNew = `function getGreeting(user) {
<<<<<<< HEAD
  return "Welcome back, " + user.name;
=======
  return "Hello, " + user.displayName;
>>>>>>> feature/auth
}

function getRole(user) {
<<<<<<< HEAD
  return user.role || "viewer";
=======
  return user.permissions?.role || "guest";
>>>>>>> feature/auth
}`;

export function DiffConflictMarkers() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          PR #510: Merge feature/auth into main
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={conflictMarkersOld}
        newValue={conflictMarkersNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Conflict properly resolved ---------- */

const conflictResolvedNew = `// Merged: use displayName from feature/auth,
// keep "Welcome back" greeting from main
function getGreeting(user) {
  return "Welcome back, " + user.displayName;
}

// Merged: use permissions-based role from feature/auth,
// fall back to "viewer" from main instead of "guest"
function getRole(user) {
  return user.permissions?.role || "viewer";
}`;

export function DiffConflictResolved() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          PR #510: Merge feature/auth into main
        </Typography>
      </Box>
      <ReactDiffViewer
        oldValue={conflictMarkersOld}
        newValue={conflictResolvedNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Rubber stamp review ---------- */

const reviewVulnerableOld = `app.get("/users", (req, res) => {
  const users = db.query("SELECT * FROM users");
  res.json(users);
});`;

const reviewVulnerableNew = `app.get("/users", (req, res) => {
  const name = req.query.name;
  const users = db.query("SELECT * FROM users WHERE name = '" + name + "'");
  res.json(users);
});`;

export function DiffReviewRubberStamp() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            bgcolor: "#e3f2fd",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            mb: 0.5,
          }}
        >
          <Typography
            sx={{ fontSize: 10, fontWeight: 600, color: "text.primary" }}
          >
            reviewer42:
          </Typography>
          <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
            LGTM 👍
          </Typography>
        </Box>
      </Box>
      <ReactDiffViewer
        oldValue={reviewVulnerableOld}
        newValue={reviewVulnerableNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}

/* ---------- Thorough review ---------- */

export function DiffReviewThorough() {
  return (
    <Paper sx={wrapperSx}>
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            bgcolor: "#fce4ec",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            mb: 0.3,
          }}
        >
          <Typography
            sx={{ fontSize: 9, color: "error.main", fontWeight: 600 }}
          >
            SQL injection risk: use parameterized query
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#fff3e0",
            borderRadius: 1,
            px: 1,
            py: 0.3,
            mb: 0.3,
          }}
        >
          <Typography
            sx={{ fontSize: 9, color: "warning.dark", fontWeight: 600 }}
          >
            Missing error handling for query failure
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#e3f2fd",
            borderRadius: 1,
            px: 1,
            py: 0.3,
          }}
        >
          <Typography sx={{ fontSize: 9, color: "info.main", fontWeight: 600 }}>
            Add input validation before query
          </Typography>
        </Box>
      </Box>
      <ReactDiffViewer
        oldValue={reviewVulnerableOld}
        newValue={reviewVulnerableNew}
        splitView={false}
        hideLineNumbers
      />
    </Paper>
  );
}
