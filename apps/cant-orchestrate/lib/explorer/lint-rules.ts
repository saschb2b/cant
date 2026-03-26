import type { ParseResult, LintIssue, DockerStage } from "./types";

type LintRule = (result: ParseResult) => LintIssue[];

const rules: LintRule[] = [
  /* ---- latest-tag ---- */
  function latestTag(result) {
    const issues: LintIssue[] = [];
    for (const stage of result.stages) {
      if (stage.baseImage === "(global)") continue;
      if (stage.tag === null || stage.tag === "latest") {
        issues.push({
          severity: "warning",
          line: null,
          rule: "latest-tag",
          message: `Stage ${String(stage.index + 1)} uses "${stage.baseImage}" without a pinned tag. Pin a specific version for reproducible builds.`,
        });
      }
    }
    return issues;
  },

  /* ---- multiple-run ---- */
  function multipleRun(result) {
    const issues: LintIssue[] = [];
    for (const stage of result.stages) {
      let consecutiveRuns = 0;
      let firstRunLine: number | null = null;
      for (const inst of stage.instructions) {
        if (inst.instruction === "RUN") {
          if (consecutiveRuns === 0) firstRunLine = inst.line;
          consecutiveRuns++;
        } else {
          if (consecutiveRuns > 1) {
            issues.push({
              severity: "warning",
              line: firstRunLine,
              rule: "multiple-run",
              message: `${String(consecutiveRuns)} consecutive RUN instructions could be combined with && to reduce layers.`,
            });
          }
          consecutiveRuns = 0;
          firstRunLine = null;
        }
      }
      if (consecutiveRuns > 1) {
        issues.push({
          severity: "warning",
          line: firstRunLine,
          rule: "multiple-run",
          message: `${String(consecutiveRuns)} consecutive RUN instructions could be combined with && to reduce layers.`,
        });
      }
    }
    return issues;
  },

  /* ---- copy-before-deps ---- */
  function copyBeforeDeps(result) {
    const issues: LintIssue[] = [];
    for (const stage of result.stages) {
      let seenBroadCopy = false;
      let seenInstall = false;
      for (const inst of stage.instructions) {
        if (inst.instruction === "COPY" && isBroadCopy(inst.args)) {
          seenBroadCopy = true;
        }
        if (
          inst.instruction === "RUN" &&
          isInstallCommand(inst.args) &&
          !seenInstall
        ) {
          seenInstall = true;
          if (seenBroadCopy) {
            issues.push({
              severity: "warning",
              line: inst.line,
              rule: "copy-before-deps",
              message:
                "Copying all files before installing dependencies busts the cache on every code change. Copy dependency manifests first, install, then copy the rest.",
            });
          }
        }
      }
    }
    return issues;
  },

  /* ---- no-user ---- */
  function noUser(result) {
    const finalStage = result.stages[result.stages.length - 1];
    if (!finalStage) return [];
    if (finalStage.instructions.some((i) => i.instruction === "USER"))
      return [];
    return [
      {
        severity: "info",
        line: null,
        rule: "no-user",
        message:
          "No USER instruction in the final stage. The container will run as root by default.",
      },
    ];
  },

  /* ---- apt-no-clean ---- */
  function aptNoClean(result) {
    const issues: LintIssue[] = [];
    for (const stage of result.stages) {
      for (const inst of stage.instructions) {
        if (inst.instruction !== "RUN") continue;
        if (
          inst.args.includes("apt-get install") &&
          !inst.args.includes("rm -rf /var/lib/apt")
        ) {
          issues.push({
            severity: "warning",
            line: inst.line,
            rule: "apt-no-clean",
            message:
              "apt-get install without cleaning /var/lib/apt/lists/* leaves the package cache in the layer. Add && rm -rf /var/lib/apt/lists/* to the same RUN.",
          });
        }
      }
    }
    return issues;
  },

  /* ---- add-vs-copy ---- */
  function addVsCopy(result) {
    const issues: LintIssue[] = [];
    for (const stage of result.stages) {
      for (const inst of stage.instructions) {
        if (inst.instruction !== "ADD") continue;
        // ADD is fine for URLs and archives
        if (/https?:\/\//.test(inst.args) || /\.tar(\.gz)?/.test(inst.args))
          continue;
        issues.push({
          severity: "info",
          line: inst.line,
          rule: "add-vs-copy",
          message:
            "ADD can auto-extract archives and fetch URLs, but COPY is preferred for simple file copies. Use COPY unless you need ADD-specific features.",
        });
      }
    }
    return issues;
  },

  /* ---- missing-healthcheck ---- */
  function missingHealthcheck(result) {
    const finalStage = result.stages[result.stages.length - 1];
    if (!finalStage || isBuildOnlyStage(finalStage)) return [];
    if (finalStage.instructions.some((i) => i.instruction === "HEALTHCHECK"))
      return [];
    return [
      {
        severity: "info",
        line: null,
        rule: "missing-healthcheck",
        message:
          "No HEALTHCHECK in the final stage. Adding one helps orchestrators detect unhealthy containers.",
      },
    ];
  },
];

export function lintDockerfile(result: ParseResult): LintIssue[] {
  return rules.flatMap((rule) => rule(result));
}

/* ---- helpers ---- */

function isBroadCopy(args: string): boolean {
  // "COPY . ." or "COPY ./ /app" etc. -- copies the whole context
  const parts = args.trim().split(/\s+/);
  const src = parts[0] ?? "";
  return src === "." || src === "./" || src === "*";
}

function isInstallCommand(args: string): boolean {
  return (
    args.includes("npm install") ||
    args.includes("npm ci") ||
    args.includes("yarn install") ||
    args.includes("pip install") ||
    args.includes("go mod download") ||
    args.includes("apt-get install") ||
    args.includes("apk add")
  );
}

function isBuildOnlyStage(stage: DockerStage): boolean {
  // Stages that have no CMD/ENTRYPOINT are likely intermediate build stages
  return !stage.instructions.some(
    (i) => i.instruction === "CMD" || i.instruction === "ENTRYPOINT",
  );
}
