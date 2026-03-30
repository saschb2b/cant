# Can't SEO - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- The Link Inspector (`/inspector`) is unique to this app, code in `components/inspector/` and `app/api/inspect/`
- `lib/shiki.ts` adds HTML language support on top of the shared TSX/CSS highlighter
- `lib/code-styles.ts` has flex layout styles for side-by-side code panels
- Umami website ID: `1ca08826-ca6c-4791-b790-7e3651301ce0`
