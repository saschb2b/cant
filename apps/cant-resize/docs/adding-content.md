# Adding Content

## New Challenge

Challenge data is not stored in this app. It lives in the shared package, one directory per app:

```
packages/shared/src/lib/challenges/cant-resize/
```

Append a `Challenge` to the relevant category file there. See "Adding a new challenge" in the root [CLAUDE.md](../../../CLAUDE.md) for the authoritative format, including the `content` discriminated union (`code`, `image`, `visual`, `molecule`, `ticket`) and the rules on picking a content type and keeping titles neutral.

## New Category

Categories are derived from the shared app catalog, so there is no per-app list to maintain:

1. Add the category to the `cant-resize` entry in `packages/shared/src/lib/app-catalog.ts` (slug, label, description, `questionCount`). `ChallengeCategory`, `CATEGORY_ORDER`, `CATEGORY_LABELS`, and `CATEGORY_DESCRIPTIONS` all derive from it.
2. Group it under a section in `lib/learn/categories.ts` (`CATEGORY_SECTIONS`) so it appears in the lobby filter.
3. Create the challenge file in `packages/shared/src/lib/challenges/cant-resize/` and export it from that directory's `index.ts`.

## New Device Preset

The multi-device viewer (`/canvas`) is unique to this app. Add to `DEVICE_PRESETS` in `lib/viewer/device-presets.ts`:

```ts
{ id: "device-id", name: "Display Name", category: "phone", width: 390, height: 844 }
```
