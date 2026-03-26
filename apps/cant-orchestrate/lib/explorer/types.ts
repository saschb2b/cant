export interface DockerInstruction {
  /** Original line number (1-based) */
  line: number;
  /** Uppercase instruction keyword, e.g. "RUN", "COPY" */
  instruction: string;
  /** Raw argument string after the keyword */
  args: string;
  /** Full original line(s) including continuations */
  raw: string;
  /** Whether this instruction creates a filesystem layer */
  createsLayer: boolean;
}

export interface DockerStage {
  index: number;
  /** Alias from "AS name", null if unnamed */
  name: string | null;
  /** Base image including tag, e.g. "node:18-alpine" */
  baseImage: string;
  /** Tag portion of the base image, null if none specified */
  tag: string | null;
  instructions: DockerInstruction[];
}

export interface ParseResult {
  stages: DockerStage[];
}

export interface LintIssue {
  severity: "warning" | "info";
  /** Line number (1-based), null for whole-file checks */
  line: number | null;
  /** Machine-readable rule ID */
  rule: string;
  /** Human-readable description */
  message: string;
}

export interface Preset {
  id: string;
  label: string;
  dockerfile: string;
}
