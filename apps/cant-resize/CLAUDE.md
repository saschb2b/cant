# Can't Resize - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- The viewport viewer (`/canvas`) is unique to this app, code in `components/viewer/` and `lib/viewer/`
- `lib/shiki.ts` adds CSS language support on top of the shared TSX highlighter
- `lib/code-styles.ts` has extra flex layout styles for side-by-side code panels
- Umami website ID: `24a9a7f0-ea82-4364-8eae-74f50b296d3e`
