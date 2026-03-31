import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/tsx"),
  import("@shikijs/langs/json"),
  import("@shikijs/langs/yaml"),
  import("@shikijs/langs/bash"),
]);

export const highlightDual = createHighlightDual("tsx");
