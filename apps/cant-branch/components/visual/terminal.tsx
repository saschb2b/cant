"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const terminalSx = {
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  bgcolor: "#1a1a2e",
  p: 0,
} as const;

const titleBarSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  px: 1,
  py: 0.5,
  bgcolor: "#16213e",
} as const;

const dotSx = (color: string) =>
  ({ width: 8, height: 8, borderRadius: "50%", bgcolor: color }) as const;

const bodySx = {
  p: 1.5,
  fontFamily: "monospace",
  fontSize: 12,
  lineHeight: 1.7,
  color: "#e0e0e0",
  whiteSpace: "pre-wrap",
  overflow: "hidden",
} as const;

function TerminalShell({ children }: { children: React.ReactNode }) {
  return (
    <Paper sx={terminalSx} elevation={3}>
      <Box sx={titleBarSx}>
        <Box sx={dotSx("#ff5f56")} />
        <Box sx={dotSx("#ffbd2e")} />
        <Box sx={dotSx("#27c93f")} />
        <Typography sx={{ fontSize: 9, color: "#888", ml: 1 }}>
          terminal
        </Typography>
      </Box>
      <Box sx={bodySx}>{children}</Box>
    </Paper>
  );
}

function Prompt({ children }: { children: string }) {
  return (
    <Box component="span">
      <Box component="span" sx={{ color: "#27c93f" }}>
        ${" "}
      </Box>
      <Box component="span" sx={{ color: "#fff" }}>
        {children}
      </Box>
    </Box>
  );
}

function Output({ children, color }: { children: string; color?: string }) {
  return (
    <Box component="span" sx={{ color: color ?? "#999" }}>
      {children}
    </Box>
  );
}

/* ---------- Destructive reset ---------- */

export function TerminalDestructiveReset() {
  return (
    <TerminalShell>
      <Prompt>git log --oneline -5</Prompt>
      {"\n"}
      <Output>
        {`a1b2c3d Add payment integration
e4f5g6h Update user dashboard
i7j8k9l Fix authentication bug
m0n1o2p Add search feature
q3r4s5t Initial commit`}
      </Output>
      {"\n"}
      <Prompt>git reset --hard HEAD~5</Prompt>
      {"\n"}
      <Output color="#ff5f56">{`HEAD is now at q3r4s5t Initial commit`}</Output>
      {"\n"}
      <Prompt>git log --oneline -3</Prompt>
      {"\n"}
      <Output>{`q3r4s5t Initial commit`}</Output>
      {"\n"}
      <Output color="#ff5f56">
        {`# 4 commits of work gone. No reflog? No recovery.`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Safe revert ---------- */

export function TerminalSafeRevert() {
  return (
    <TerminalShell>
      <Prompt>git log --oneline -3</Prompt>
      {"\n"}
      <Output>
        {`a1b2c3d Add payment integration
e4f5g6h Update user dashboard
i7j8k9l Fix authentication bug`}
      </Output>
      {"\n"}
      <Prompt>git revert a1b2c3d</Prompt>
      {"\n"}
      <Output color="#27c93f">
        {`[main f8g9h0i] Revert "Add payment integration"
 3 files changed, 12 insertions(+), 47 deletions(-)`}
      </Output>
      {"\n"}
      <Prompt>git log --oneline -4</Prompt>
      {"\n"}
      <Output>
        {`f8g9h0i Revert "Add payment integration"
a1b2c3d Add payment integration
e4f5g6h Update user dashboard
i7j8k9l Fix authentication bug`}
      </Output>
      {"\n"}
      <Output color="#27c93f">
        {`# History preserved. Change undone safely.`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Manual bisect ---------- */

export function TerminalBisectManual() {
  return (
    <TerminalShell>
      <Prompt>git checkout abc1234</Prompt>
      {"\n"}
      <Output>{`HEAD detached at abc1234`}</Output>
      {"\n"}
      <Prompt>npm test</Prompt>
      {"\n"}
      <Output color="#ff5f56">{`FAIL: 3 tests failed`}</Output>
      {"\n"}
      <Prompt>git checkout def5678</Prompt>
      {"\n"}
      <Output>{`HEAD detached at def5678`}</Output>
      {"\n"}
      <Prompt>npm test</Prompt>
      {"\n"}
      <Output color="#ff5f56">{`FAIL: 3 tests failed`}</Output>
      {"\n"}
      <Prompt>git checkout ghi9012</Prompt>
      {"\n"}
      <Output>{`HEAD detached at ghi9012`}</Output>
      {"\n"}
      <Prompt>npm test</Prompt>
      {"\n"}
      <Output color="#27c93f">{`PASS: all tests passed`}</Output>
      {"\n"}
      <Output color="#ffbd2e">
        {`# Checked 3 of 64 commits manually...
# This could take a while.`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Automated bisect ---------- */

export function TerminalBisectAutomated() {
  return (
    <TerminalShell>
      <Prompt>git bisect start</Prompt>
      {"\n"}
      <Prompt>git bisect bad HEAD</Prompt>
      {"\n"}
      <Prompt>git bisect good v1.0.0</Prompt>
      {"\n"}
      <Output>{`Bisecting: 32 revisions left to test`}</Output>
      {"\n"}
      <Prompt>git bisect run npm test</Prompt>
      {"\n"}
      <Output>
        {`running npm test
Bisecting: 16 revisions left (roughly 4 steps)
running npm test
Bisecting: 8 revisions left (roughly 3 steps)
running npm test
Bisecting: 4 revisions left (roughly 2 steps)
running npm test`}
      </Output>
      {"\n"}
      <Output color="#27c93f">
        {`d4e5f6g is the first bad commit
Author: dev@example.com
Date: Mon Mar 15

    Refactor query builder

# Found the bug in 6 steps (out of 64 commits).`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Unconfigured Git ---------- */

export function TerminalUnconfiguredGit() {
  return (
    <TerminalShell>
      <Prompt>git config --list</Prompt>
      {"\n"}
      <Output>
        {`core.repositoryformatversion=0
core.filemode=true
core.bare=false`}
      </Output>
      {"\n"}
      <Prompt>{'git commit -m "Add feature"'}</Prompt>
      {"\n"}
      <Output>
        {`[main 3f2a1b0] Add feature
 Author: unknown <unknown@unknown>`}
      </Output>
      {"\n"}
      <Prompt>git pull</Prompt>
      {"\n"}
      <Output color="#ffbd2e">
        {`Merge branch 'main' of origin into main
CONFLICT (content): Merge conflict in src/app.ts
Automatic merge failed; fix conflicts and then
commit the result.`}
      </Output>
      {"\n"}
      <Output color="#ff5f56">
        {`# No rebase, messy merge commits everywhere.`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Configured Git ---------- */

export function TerminalConfiguredGit() {
  return (
    <TerminalShell>
      <Prompt>git config --list</Prompt>
      {"\n"}
      <Output>
        {`user.name=Jane Dev
user.email=jane@company.com
init.defaultBranch=main
pull.rebase=true
rerere.enabled=true
diff.algorithm=histogram`}
      </Output>
      {"\n"}
      <Prompt>{'git commit -m "Add feature"'}</Prompt>
      {"\n"}
      <Output color="#27c93f">
        {`[main 7c4d8e2] Add feature
 Author: Jane Dev <jane@company.com>`}
      </Output>
      {"\n"}
      <Prompt>git pull --rebase</Prompt>
      {"\n"}
      <Output color="#27c93f">
        {`Successfully rebased and updated refs/heads/main.
Current branch main is up to date.`}
      </Output>
      {"\n"}
      <Output color="#27c93f">
        {`# Clean linear history. No merge commits.`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Stash chaos ---------- */

export function TerminalStashChaos() {
  return (
    <TerminalShell>
      <Prompt>git stash list</Prompt>
      {"\n"}
      <Output>
        {`stash@{0}: WIP on main: abc1234 ...
stash@{1}: WIP on main: abc1234 ...
stash@{2}: WIP on main: abc1234 ...
stash@{3}: WIP on main: abc1234 ...
stash@{4}: WIP on main: abc1234 ...`}
      </Output>
      {"\n"}
      <Prompt>git stash pop</Prompt>
      {"\n"}
      <Output color="#ff5f56">
        {`Auto-merging src/index.ts
CONFLICT (content): Merge conflict in src/index.ts
The stash entry is kept in case you need it again.`}
      </Output>
      {"\n"}
      <Output color="#ffbd2e">
        {`# Which stash was the right one?
# No labels, no context, just "WIP".`}
      </Output>
    </TerminalShell>
  );
}

/* ---------- Worktree clean ---------- */

export function TerminalWorktreeClean() {
  return (
    <TerminalShell>
      <Prompt>git worktree add ../hotfix hotfix/urgent-fix</Prompt>
      {"\n"}
      <Output color="#27c93f">
        {`Preparing worktree (new branch 'hotfix/urgent-fix')
HEAD is now at 9a8b7c6 Latest release`}
      </Output>
      {"\n"}
      <Prompt>git worktree list</Prompt>
      {"\n"}
      <Output>
        {`/home/dev/project       main            [main]
/home/dev/hotfix        9a8b7c6         [hotfix/urgent-fix]`}
      </Output>
      {"\n"}
      <Output color="#27c93f">
        {`# No stashing needed. Both branches checked
# out simultaneously. Work in parallel.`}
      </Output>
    </TerminalShell>
  );
}
