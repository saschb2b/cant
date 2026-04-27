import type { ContentMapEntry } from "../components/game/game";
import type { BaseChallenge } from "./game/types";
import type { ShikiHighlighter, HighlightDualFn } from "./shiki";

/**
 * Build a content map from a list of challenges.
 *
 * Code challenges are syntax-highlighted via the provided Shiki highlighter.
 * Image and visual challenges are passed through as-is.
 *
 * The challenge `content` field is a discriminated union on `content.type`.
 * `correctSide` indicates which side ("left" or "right") holds the good code.
 * The output map uses good/bad naming so the Game component can place content
 * on the correct side at runtime.
 *
 * @param challenges - All challenges to process.
 * @param highlighter - A Shiki highlighter instance (from `getHighlighter()`).
 * @param highlight - The `highlightDual` function (or an app-specific wrapper).
 */
export function buildContentMap(
  challenges: BaseChallenge[],
  highlighter?: ShikiHighlighter,
  highlight?: HighlightDualFn,
): Record<string, ContentMapEntry> {
  const map: Record<string, ContentMapEntry> = {};

  for (const challenge of challenges) {
    const ct = challenge.content.type;
    const isRightGood = challenge.correctSide === "right";

    switch (ct) {
      case "code": {
        if (!highlighter || !highlight) break;
        const { left, right, lang } = challenge.content;
        const language = lang ?? "tsx";
        const good = isRightGood ? right : left;
        const bad = isRightGood ? left : right;
        map[challenge.id] = {
          type: "code",
          goodHtml: highlight(highlighter, good, language),
          badHtml: highlight(highlighter, bad, language),
        };
        break;
      }
      case "image": {
        const { left, right } = challenge.content;
        const goodSide = isRightGood ? right : left;
        const badSide = isRightGood ? left : right;
        map[challenge.id] = {
          type: "image",
          goodImage: goodSide.src,
          badImage: badSide.src,
          goodImageAlt: goodSide.alt,
          badImageAlt: badSide.alt,
        };
        break;
      }
      case "visual": {
        const { left, right } = challenge.content;
        const goodSide = isRightGood ? right : left;
        const badSide = isRightGood ? left : right;
        map[challenge.id] = {
          type: "visual",
          goodComponentId: goodSide.componentId,
          badComponentId: badSide.componentId,
        };
        break;
      }
      case "molecule": {
        const { left, right } = challenge.content;
        const goodSide = isRightGood ? right : left;
        const badSide = isRightGood ? left : right;
        map[challenge.id] = {
          type: "molecule",
          goodMolecule: goodSide,
          badMolecule: badSide,
        };
        break;
      }
      case "ticket": {
        const { left, right } = challenge.content;
        const goodSide = isRightGood ? right : left;
        const badSide = isRightGood ? left : right;
        map[challenge.id] = {
          type: "ticket",
          goodTicket: goodSide,
          badTicket: badSide,
        };
        break;
      }
    }
  }

  return map;
}
