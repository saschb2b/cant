import {
  createShikiHighlighter,
  createHighlightDual,
} from "@cant/shared/lib/shiki";

export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/tsx"),
  import("@shikijs/langs/json"),
  import("@shikijs/langs/graphql"),
  import("@shikijs/langs/yaml"),
  import("@shikijs/langs/markdown"),
]);

export const highlightDual = createHighlightDual("tsx");
