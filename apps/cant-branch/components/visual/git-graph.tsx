"use client";

import Paper from "@mui/material/Paper";
import { Gitgraph, templateExtend, TemplateName } from "@gitgraph/react";

const template = templateExtend(TemplateName.Metro, {
  branch: {
    lineWidth: 3,
    spacing: 46,
    label: { font: "9px sans-serif", borderRadius: 4 },
  },
  commit: {
    spacing: 20,
    dot: { size: 3 },
    message: {
      displayAuthor: false,
      displayHash: false,
      font: "10px monospace",
    },
  },
});

const graphWrapperSx = {
  p: 1,
  width: "100%",
  minHeight: 200,
  overflow: "hidden",
  "& svg": { width: "100%" },
} as const;

export function GitGraphMessyMerge() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit("Add project config");

          const feat1 = gitgraph.branch("feature/auth");
          feat1.commit("Start auth module");
          main.commit("Hotfix: typo in readme");
          feat1.commit("Add login form");
          main.merge(feat1, "Merge feature/auth into main");

          const feat2 = gitgraph.branch("feature/dashboard");
          feat2.commit("Dashboard skeleton");
          const feat3 = gitgraph.branch("feature/api");
          feat3.commit("Add API client");
          feat2.commit("Wire up charts");
          feat3.commit("Handle auth tokens");
          main.merge(feat3, "Merge feature/api into main");
          feat2.commit("Fix dashboard bugs");
          main.merge(feat2, "Merge feature/dashboard into main");
          main.commit("Merge conflict resolution");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphCleanRebase() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit("Add project config");
          main.commit("Set up CI pipeline");

          const feat1 = gitgraph.branch("feature/auth");
          feat1.commit("Add login form");
          feat1.commit("Add session handling");
          main.merge(feat1, "Add authentication (squashed)");

          const feat2 = gitgraph.branch("feature/dashboard");
          feat2.commit("Create dashboard layout");
          feat2.commit("Add analytics charts");
          main.merge(feat2, "Add dashboard (squashed)");

          main.commit("Update dependencies");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphLongLivedBranch() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const feat = gitgraph.branch("feature/redesign");
          feat.commit("Start redesign work");
          main.commit("Fix production bug");
          feat.merge(main, "Merge main into feature");
          feat.commit("Continue redesign");
          main.commit("Add monitoring");
          main.commit("Update deps");
          feat.merge(main, "Merge main into feature again");
          feat.commit("More redesign changes");
          main.commit("Another hotfix");
          feat.merge(main, "Merge main into feature (3rd time)");
          feat.commit("Finish redesign");
          main.merge(feat, "Merge feature/redesign");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphShortLivedBranch() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const feat1 = gitgraph.branch("fix/typo");
          feat1.commit("Fix typo in header");
          main.merge(feat1, "Fix header typo");

          const feat2 = gitgraph.branch("feat/search");
          feat2.commit("Add search bar");
          feat2.commit("Add search results page");
          main.merge(feat2, "Add search feature");

          const feat3 = gitgraph.branch("fix/nav-link");
          feat3.commit("Fix broken nav link");
          main.merge(feat3, "Fix navigation link");

          main.commit("Release v1.2.0");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphMonolithCommit() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit("Add auth, fix nav, update deps, refactor utils");
          main.commit("Revert: undo everything");
          main.commit("Try again from scratch");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphAtomicCommits() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit("Add user auth");
          main.commit("Fix nav dropdown");

          const hotfix = gitgraph.branch("hotfix/nav");
          hotfix.commit("Cherry-pick: Fix nav dropdown");

          main.commit("Update dependencies");
          main.commit("Refactor utils");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphBadBranchNames() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const b1 = gitgraph.branch("john-work");
          b1.commit("Some changes");

          const b2 = gitgraph.branch("stuff");
          b2.commit("More changes");

          const b3 = gitgraph.branch("test2");
          b3.commit("Testing things");

          const b4 = gitgraph.branch("final-fix-v3");
          b4.commit("Hopefully works now");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphGoodBranchNames() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const b1 = gitgraph.branch("feature/user-auth");
          b1.commit("Add login flow");

          const b2 = gitgraph.branch("fix/login-redirect");
          b2.commit("Fix redirect after login");

          const b3 = gitgraph.branch("chore/update-deps");
          b3.commit("Bump dependencies");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphDirtyHistory() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const feat = gitgraph.branch("feature/auth");
          feat.commit("WIP");
          feat.commit("WIP more");
          feat.commit("fix typo");
          feat.commit("oops");
          feat.commit("actually fix it");
          feat.commit("lint");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphCleanHistory() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");

          const feat = gitgraph.branch("feature/auth");
          feat.commit("Add user authentication");
          feat.commit("Add login form validation");
          feat.commit("Add session persistence");
          main.merge(feat, "Add auth feature");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphNoTags() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit("Add feature A");
          main.commit("Add feature B");
          main.commit("Bug fix");
          main.commit("Add feature C");
          main.commit("Update config");
        }}
      </Gitgraph>
    </Paper>
  );
}

export function GitGraphWithTags() {
  return (
    <Paper sx={graphWrapperSx}>
      <Gitgraph options={{ template }}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          main.commit("Initial commit");
          main.commit({ subject: "Add feature A", tag: "v1.0.0" });
          main.commit("Add feature B");
          main.commit({ subject: "Bug fix", tag: "v1.1.0" });
          main.commit("Add feature C");
          main.commit({ subject: "Update config", tag: "v1.2.0" });
        }}
      </Gitgraph>
    </Paper>
  );
}
