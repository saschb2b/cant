# Can't Type - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- The TypeScript playground (`/playground`) is unique to this app, code in `components/playground/` and `lib/playground/`
- `lib/shiki.ts` adds error/OK code decorations (wavy underlines) on top of the shared highlighter
- `scripts/vendor-typescript.mjs` minifies the TypeScript compiler for the playground worker (runs automatically during `dev` and `build`)
- `getRank()` in `lib/game/share.ts` returns `{ title, emoji }` objects (not plain strings like the other apps)
- Umami website ID: `feed24d7-ba3d-4869-9ea7-0b05343937ab`
