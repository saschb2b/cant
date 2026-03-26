import { getSingletonHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

/** Returns a shared Shiki highlighter instance with orchestration-relevant languages. */
export function getHighlighter() {
  return getSingletonHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark-default"),
    ],
    langs: [
      import("@shikijs/langs/dockerfile"),
      import("@shikijs/langs/yaml"),
      import("@shikijs/langs/bash"),
      import("@shikijs/langs/xml"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/toml"),
    ],
  });
}

/**
 * Highlight code with both themes and wrap in containers that toggle
 * via the `.light` / `.dark` class on `<html>`.
 */
export function highlightDual(
  highlighter: Awaited<ReturnType<typeof getHighlighter>>,
  code: string,
  lang = "yaml",
): string {
  const light = highlighter.codeToHtml(code, {
    lang,
    theme: "github-light",
  });
  const dark = highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
  return `<div class="shiki-light">${light}</div><div class="shiki-dark">${dark}</div>`;
}
