# Can't Maintain - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/game/categories.ts` and `lib/game/challenges/` (note: `game/` not `learn/`)
- The changelog page (`/changelog`) is unique to this app
- Uses Inter font (the other apps use Geist)
- Has a custom accent palette color in `lib/theme.ts`
- `lib/shiki.ts` is fully replaced by `@cant/shared/lib/shiki` (no app-specific extensions)
- See `AGENTS.md` for detailed challenge design rules and visual parity guidelines
- Umami website ID: `c4123bd8-26b2-45df-9f44-ff7139d83c30`
