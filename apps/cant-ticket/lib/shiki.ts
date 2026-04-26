import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/markdown"),
  import("@shikijs/langs/tsx"),
]);

export const highlightDual = createHighlightDual("markdown");
