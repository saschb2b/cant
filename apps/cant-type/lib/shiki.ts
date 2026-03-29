import { transformerDecorations } from "@shikijs/core";
import {
  createShikiHighlighter,
  type ShikiHighlighter,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/tsx"),
]);

/** Comment patterns that indicate a compile or runtime error. */
const ERROR_PATTERNS: RegExp[] = [
  /\/\/ Error\b/,
  /\/\/ No error/i,
  /\/\/ Crash/i,
  /\/\/ Runtime error/i,
  /\/\/ Runtime:/i,
  /\/\/ NaN at runtime/i,
  /\/\/ undefined at runtime/i,
  /\/\/ Syntax error/i,
];

/** Comment patterns that indicate safe, correct code. */
const OK_PATTERNS: RegExp[] = [/\/\/ OK\b/, /\/\/ Safe\b/i];

type DecorationKind = "error" | "ok";

function classifyComment(line: string): DecorationKind | null {
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.test(line)) return "error";
  }
  for (const pattern of OK_PATTERNS) {
    if (pattern.test(line)) return "ok";
  }
  return null;
}

interface Decoration {
  start: { line: number; character: number };
  end: { line: number; character: number };
  properties: { class: string };
}

/**
 * Scan code for inline comments that indicate errors or success,
 * and return Shiki decorations that underline the code portion of those lines.
 */
function buildDecorations(code: string): Decoration[] {
  const lines = code.split("\n");
  const decorations: Decoration[] = [];

  for (const [i, line] of lines.entries()) {
    const kind = classifyComment(line);
    if (!kind) continue;

    const commentStart = line.indexOf("//");
    if (commentStart < 0) continue;

    const codePart = line.slice(0, commentStart).trimEnd();
    if (codePart.length === 0) continue;

    const codeStart = line.length - line.trimStart().length;

    decorations.push({
      start: { line: i, character: codeStart },
      end: { line: i, character: codePart.length },
      properties: {
        class: kind === "error" ? "code-error" : "code-ok",
      },
    });
  }

  return decorations;
}

/**
 * Highlight code with both themes and wrap in containers that toggle
 * via the `.light` / `.dark` class on `<html>`.
 */
export function highlightDual(
  highlighter: ShikiHighlighter,
  code: string,
): string {
  const decorations = buildDecorations(code);

  const light = highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "github-light",
    transformers: [transformerDecorations()],
    decorations,
  });
  const dark = highlighter.codeToHtml(code, {
    lang: "tsx",
    theme: "github-dark-default",
    transformers: [transformerDecorations()],
    decorations,
  });
  return `<div class="shiki-light">${light}</div><div class="shiki-dark">${dark}</div>`;
}
