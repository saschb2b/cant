import { getSingletonHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A dynamic import() of a Shiki language grammar. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LangImport = Promise<any>;

/** The resolved Shiki highlighter instance. */
export type ShikiHighlighter = Awaited<
  ReturnType<typeof getSingletonHighlighterCore>
>;

/** A dual-theme highlight function that returns light+dark HTML. */
export type HighlightDualFn = (
  highlighter: ShikiHighlighter,
  code: string,
  lang?: string,
) => string;

// ---------------------------------------------------------------------------
// Factory: createShikiHighlighter
// ---------------------------------------------------------------------------

/**
 * Create a `getHighlighter` function for a specific set of languages.
 *
 * Each app calls this once with its language imports:
 *
 * ```ts
 * import { createShikiHighlighter } from "@cant/shared/lib/shiki";
 *
 * export const getHighlighter = createShikiHighlighter([
 *   import("@shikijs/langs/bash"),
 *   import("@shikijs/langs/yaml"),
 * ]);
 * ```
 *
 * The two GitHub themes (light + dark) are always included.
 */
export function createShikiHighlighter(
  langs: LangImport[],
): () => ReturnType<typeof getSingletonHighlighterCore> {
  return () =>
    getSingletonHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      themes: [
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark-default"),
      ],
      langs,
    });
}

// ---------------------------------------------------------------------------
// Factory: createHighlightDual
// ---------------------------------------------------------------------------

/**
 * Create a `highlightDual` function with a default language.
 *
 * ```ts
 * import { createHighlightDual } from "@cant/shared/lib/shiki";
 *
 * export const highlightDual = createHighlightDual("bash");
 * ```
 */
export function createHighlightDual(defaultLang = "tsx"): HighlightDualFn {
  return (highlighter, code, lang = defaultLang) => {
    const light = highlighter.codeToHtml(code, {
      lang,
      theme: "github-light",
    });
    const dark = highlighter.codeToHtml(code, {
      lang,
      theme: "github-dark-default",
    });
    return `<div class="shiki-light">${light}</div><div class="shiki-dark">${dark}</div>`;
  };
}

// ---------------------------------------------------------------------------
// Default instance (TSX only, backward compatible)
// ---------------------------------------------------------------------------

/** Default highlighter with TSX support. Used by apps that only need TypeScript. */
export const getHighlighter = createShikiHighlighter([
  import("@shikijs/langs/tsx"),
]);

/** Default dual-theme highlight function (defaults to TSX). */
export const highlightDual = createHighlightDual("tsx");
