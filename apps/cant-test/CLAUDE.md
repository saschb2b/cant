# Can't Test - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- Has a Bug Hunt game (`/hunt`), a Minesweeper-style mini-game with three difficulty levels
- Visual challenges use file tree components in `components/visual/` (e.g. colocated vs separate test structure)
- `lib/shiki.ts` adds JSON, YAML, and Bash language support
- Umami website ID: `placeholder-cant-test` (not yet configured)
