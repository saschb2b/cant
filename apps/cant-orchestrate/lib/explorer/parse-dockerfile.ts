import type { DockerStage, ParseResult } from "./types";
import { createsLayer } from "./layer-info";

/**
 * Parse raw Dockerfile text into a structured representation.
 *
 * Handles:
 * - Multi-stage builds (multiple FROM instructions)
 * - Line continuations with backslash
 * - Comments and blank lines (skipped, line numbers preserved)
 * - Heredoc syntax (treated as a single instruction block)
 */
export function parseDockerfile(raw: string): ParseResult {
  const physicalLines = raw.split(/\r?\n/);
  const resolved = resolveLines(physicalLines);
  const stages: DockerStage[] = [];
  let current: DockerStage | null = null;

  for (const entry of resolved) {
    const keyword = entry.instruction;

    if (keyword === "FROM") {
      const { image, tag, alias } = parseFrom(entry.args);
      current = {
        index: stages.length,
        name: alias,
        baseImage: image + (tag ? `:${tag}` : ""),
        tag,
        instructions: [],
      };
      stages.push(current);
      continue;
    }

    if (!current) {
      // Instructions before any FROM (e.g. ARG for build args) go into an
      // implicit stage so they are still visible.
      current = {
        index: stages.length,
        name: null,
        baseImage: "(global)",
        tag: null,
        instructions: [],
      };
      stages.push(current);
    }

    current.instructions.push({
      line: entry.startLine,
      instruction: keyword,
      args: entry.args,
      raw: entry.raw,
      createsLayer: createsLayer(keyword),
    });
  }

  return { stages };
}

/* ------------------------------------------------------------------ */

interface ResolvedLine {
  startLine: number;
  instruction: string;
  args: string;
  raw: string;
}

/** Merge continuation lines and extract instruction + args. */
function resolveLines(lines: string[]): ResolvedLine[] {
  const result: ResolvedLine[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i]?.trim() ?? "";

    // Skip blanks and comments
    if (trimmed === "" || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    // Collect continuation lines
    const startLine = i + 1; // 1-based
    let merged = trimmed;
    const rawParts = [lines[i] ?? ""];

    while (merged.endsWith("\\") && i + 1 < lines.length) {
      merged = merged.slice(0, -1).trimEnd();
      i++;
      const next = lines[i]?.trim() ?? "";
      rawParts.push(lines[i] ?? "");
      if (!next.startsWith("#")) {
        merged += " " + next;
      }
    }

    // Handle heredoc blocks (RUN <<EOF ... EOF)
    const heredocMatch = /<<-?\s*['"]?(\w+)['"]?/.exec(merged);
    if (heredocMatch) {
      const delimiter = heredocMatch[1];
      i++;
      while (i < lines.length) {
        rawParts.push(lines[i] ?? "");
        if ((lines[i]?.trim() ?? "") === delimiter) break;
        i++;
      }
    }

    const raw = rawParts.join("\n");

    // Extract keyword and arguments
    const match = /^(\S+)\s*([\s\S]*)/.exec(merged);
    if (match) {
      result.push({
        startLine,
        instruction: (match[1] ?? "").toUpperCase(),
        args: (match[2] ?? "").trim(),
        raw,
      });
    }

    i++;
  }

  return result;
}

/** Parse the arguments of a FROM instruction. */
function parseFrom(args: string): {
  image: string;
  tag: string | null;
  alias: string | null;
} {
  // FROM [--platform=...] image[:tag] [AS name]
  let rest = args;

  // Strip --platform or other flags
  while (rest.startsWith("--")) {
    const spaceIdx = rest.indexOf(" ");
    if (spaceIdx === -1) break;
    rest = rest.slice(spaceIdx + 1).trim();
  }

  const asMatch = /^(\S+)\s+[Aa][Ss]\s+(\S+)/.exec(rest);
  let imageWithTag: string;
  let alias: string | null = null;

  if (asMatch) {
    imageWithTag = asMatch[1] ?? rest;
    alias = asMatch[2] ?? null;
  } else {
    imageWithTag = rest.split(/\s/)[0] ?? rest;
  }

  // Split image:tag (handle @sha256 digests)
  const digestIdx = imageWithTag.indexOf("@");
  if (digestIdx !== -1) {
    return {
      image: imageWithTag.slice(0, digestIdx),
      tag: imageWithTag.slice(digestIdx),
      alias,
    };
  }

  const colonIdx = imageWithTag.lastIndexOf(":");
  if (colonIdx > 0) {
    return {
      image: imageWithTag.slice(0, colonIdx),
      tag: imageWithTag.slice(colonIdx + 1),
      alias,
    };
  }

  return { image: imageWithTag, tag: null, alias };
}
