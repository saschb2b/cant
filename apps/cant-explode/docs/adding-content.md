# Adding Content

## New Challenge

Add to the relevant file in `lib/learn/challenges/`:

```ts
{
  id: "xx-001",
  category: "category-slug",
  difficulty: "easy" | "medium" | "hard",
  title: "Short title",
  badCode: `...`,
  goodCode: `...`,
  lang: "tsx" | "css", // optional, defaults to tsx
  correctSide: "right",
  explanationCorrect: "Why the good code is better.",
  explanationWrong: "Why the bad code is problematic.",
  sourceUrl: "https://...",
  sourceLabel: "Source: Description",
}
```

## New Category

1. Add slug to `ChallengeCategory` type in `lib/learn/types.ts`
2. Add to `CATEGORY_ORDER`, `CATEGORY_LABELS`, `CATEGORY_DESCRIPTIONS`, `CATEGORY_SECTIONS` in `lib/learn/categories.ts`
3. Create challenge file in `lib/learn/challenges/`
4. Import and spread in `lib/learn/challenges/index.ts`

## New Device Preset

Add to `DEVICE_PRESETS` in `lib/viewer/device-presets.ts`:

```ts
{ id: "device-id", name: "Display Name", category: "phone", width: 390, height: 844 }
```
