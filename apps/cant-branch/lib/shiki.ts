import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/bash"),
  import("@shikijs/langs/yaml"),
  import("@shikijs/langs/markdown"),
  import("@shikijs/langs/json"),
  import("@shikijs/langs/toml"),
  import("@shikijs/langs/tsx"),
]);

export const highlightDual = createHighlightDual("bash");
