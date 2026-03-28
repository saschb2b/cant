# Can't Explode - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- This app uses the molecule content type for chemistry structure comparisons
- `lib/shiki.ts` is minimal since most challenges use molecule type, not code
- Umami website ID: not yet assigned (use empty string for now)
