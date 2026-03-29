import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/dockerfile"),
  import("@shikijs/langs/yaml"),
  import("@shikijs/langs/bash"),
  import("@shikijs/langs/xml"),
  import("@shikijs/langs/json"),
  import("@shikijs/langs/toml"),
]);

export const highlightDual = createHighlightDual("yaml");
