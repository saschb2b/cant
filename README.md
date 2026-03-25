# Can't Type

Type magic, demystified. A TypeScript education app with a pattern quiz, a reference library, and a type sandbox.

## Play

Pick the better TypeScript pattern in 10 side-by-side code challenges at `/play`.

- **Daily and weekly seeds** for shared challenges
- **Streak tracking** with magical rank system (Novice through Archmage)
- **Activity graph** showing your practice history
- **Shareable results** with encoded URLs

## Learn

107 TypeScript patterns across 16 categories at `/learn`.

- **Foundations**: Type Narrowing, Generics, Utility Types, Union and Intersection
- **Type Safety**: Type Assertions, Enums and Literals, Strict Mode, Readonly and Immutability
- **Functions and Structures**: Function Types, Interface vs Type, Mapped Types, Template Literals
- **Applied TypeScript**: React TypeScript, Module Types
- **Anti-Patterns**: Error Handling, Common Mistakes

Each pattern shows an Avoid/Prefer code comparison with Shiki syntax highlighting, inline IDE-style decorations (error underlines, OK indicators), and a link to authoritative documentation.

Covers patterns from the TypeScript Handbook, Total TypeScript, and TypeScript 5.8/6.0 features like `NoInfer`, `const` type parameters, `--erasableSyntaxOnly`, and strict-by-default.

## Sandbox

A TypeScript type expander tool at `/playground`.

- **Write types on the left**, see them fully expanded on the right
- **8 presets** covering utility types, mapped types, conditionals, template literals, infer, recursive types, discriminated unions, and Record types
- **Runs the TypeScript compiler** in a web worker (vendored locally, no CDN dependency)
- **Shiki highlighting** on both input and output

## Search

Fuzzy search across all pages, categories, and patterns with Ctrl+K / Cmd+K. Powered by Fuse.js with keyword extraction from code snippets.

## Tech Stack

- Next.js 16 (App Router, View Transitions)
- React 19
- Material UI 7 + Emotion
- Shiki (syntax highlighting with decorations)
- TypeScript compiler API (sandbox web worker)
- Fuse.js (search)
- Umami (analytics)
- TypeScript, pnpm

## Development

```bash
pnpm install
pnpm dev
```

The first `dev` or `build` run minifies the TypeScript compiler into `public/workers/typescript.min.js` for the sandbox (via `scripts/vendor-typescript.mjs`). This file is gitignored and regenerated automatically.

### Quality checks

```bash
pnpm run lint
pnpm run typecheck
pnpm run format:check
```

## Project Structure

```
app/
  page.tsx                    # Landing page with hero visual
  play/page.tsx               # Game page
  play/results/page.tsx       # Shareable results page
  learn/
    page.tsx                  # Pattern overview
    [category]/page.tsx       # Category detail
  playground/page.tsx         # Type sandbox

components/
  site-header.tsx             # Shared header (search, nav, theme)
  site-footer.tsx             # Shared footer
  sparkle-field.tsx           # Floating sparkle particles
  search-palette.tsx          # Ctrl+K search dialog
  game/
    game.tsx                  # Main game loop
    code-panel.tsx            # Code display with sparkle burst
    game-header.tsx           # Score, streak, progress dots
    lobby-screen.tsx          # Game setup and history
    results-screen.tsx        # Results with ranks and sparkles
    explanation-panel.tsx     # Post-answer explanation
  playground/
    playground-editor.tsx     # Textarea + Shiki editor with output

lib/
  theme.ts                    # MUI TypeScript-blue theme (light/dark)
  shiki.ts                    # Syntax highlighter with decorations
  code-styles.ts              # Shared code block styles
  learn/
    types.ts                  # Challenge types
    categories.ts             # 16 categories with metadata
    challenges/               # 107 patterns across 16 files
  game/
    share.ts                  # Ranks, encoding, share URLs
    use-game.ts               # Game state machine
  playground/
    presets.ts                # 8 type expansion presets
    use-type-expander.ts      # Web worker hook
    types.ts                  # Worker message types

public/
  workers/
    type-expander.js          # Web worker (loads vendored TS compiler)

scripts/
  vendor-typescript.mjs       # Minifies TS compiler for sandbox
```

## Part of the Can't series

- **Can't Type** - TypeScript patterns (this project)
- [Can't Maintain](https://cant-maintain.saschb2b.com) - React component API design
- [Can't Resize](https://cant-resize.saschb2b.com) - Responsive design patterns
