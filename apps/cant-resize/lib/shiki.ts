import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/tsx"),
  import("@shikijs/langs/css"),
]);

export const highlightDual = createHighlightDual("tsx");
