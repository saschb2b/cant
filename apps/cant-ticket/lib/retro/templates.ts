import type { RetroTemplate } from "./types";

export const TEMPLATES: Record<string, RetroTemplate> = {
  "four-ls": {
    id: "four-ls",
    name: "4 L's",
    description: "Liked, Learned, Lacked, Longed for. Balanced and reflective.",
    columns: [
      { id: "liked", name: "Liked", hint: "What you enjoyed or appreciated" },
      { id: "learned", name: "Learned", hint: "New things you picked up" },
      {
        id: "lacked",
        name: "Lacked",
        hint: "What was missing or insufficient",
      },
      {
        id: "longed-for",
        name: "Longed for",
        hint: "What you wished you had",
      },
    ],
  },
  "start-stop-continue": {
    id: "start-stop-continue",
    name: "Start / Stop / Continue",
    description: "Action-oriented. Three buckets, easy to facilitate.",
    columns: [
      { id: "start", name: "Start", hint: "Things to begin doing" },
      { id: "stop", name: "Stop", hint: "Things to stop doing" },
      { id: "continue", name: "Continue", hint: "Things working well, keep" },
    ],
  },
  "mad-sad-glad": {
    id: "mad-sad-glad",
    name: "Mad / Sad / Glad",
    description: "Surface feelings first. Good when morale is the topic.",
    columns: [
      { id: "mad", name: "Mad", hint: "What frustrated you" },
      { id: "sad", name: "Sad", hint: "What disappointed you" },
      { id: "glad", name: "Glad", hint: "What made you happy" },
    ],
  },
  sailboat: {
    id: "sailboat",
    name: "Sailboat",
    description: "Metaphor-driven. Wind pushes, anchors slow, rocks are risks.",
    columns: [
      { id: "wind", name: "Wind", hint: "What's helping us move forward" },
      { id: "anchors", name: "Anchors", hint: "What's slowing us down" },
      { id: "rocks", name: "Rocks", hint: "Risks ahead" },
      { id: "island", name: "Island", hint: "The goal we're sailing toward" },
    ],
  },
};

export const TEMPLATE_ORDER = [
  "four-ls",
  "start-stop-continue",
  "mad-sad-glad",
  "sailboat",
] as const;

export type BuiltinTemplateId = (typeof TEMPLATE_ORDER)[number];

const COLUMN_NAME_MAX = 30;
const COLUMN_HINT_MAX = 80;
const MAX_CUSTOM_COLUMNS = 6;
const MIN_CUSTOM_COLUMNS = 2;

interface RawCustomColumn {
  name: unknown;
  hint?: unknown;
}

export function buildCustomTemplate(
  rawColumns: RawCustomColumn[],
): RetroTemplate | null {
  const cleaned = rawColumns
    .map((raw, index) => {
      const name =
        typeof raw.name === "string"
          ? raw.name.trim().slice(0, COLUMN_NAME_MAX)
          : "";
      if (!name) return null;
      const hint =
        typeof raw.hint === "string" && raw.hint.trim().length > 0
          ? raw.hint.trim().slice(0, COLUMN_HINT_MAX)
          : undefined;
      return { id: `col-${String(index + 1)}`, name, hint };
    })
    .filter(
      (c): c is { id: string; name: string; hint: string | undefined } =>
        c !== null,
    );

  if (
    cleaned.length < MIN_CUSTOM_COLUMNS ||
    cleaned.length > MAX_CUSTOM_COLUMNS
  ) {
    return null;
  }

  return {
    id: "custom",
    name: "Custom",
    description: "Columns defined by the room host.",
    columns: cleaned.map((c) =>
      c.hint === undefined
        ? { id: c.id, name: c.name }
        : { id: c.id, name: c.name, hint: c.hint },
    ),
  };
}

export function getTemplate(id: string): RetroTemplate | null {
  return TEMPLATES[id] ?? null;
}
