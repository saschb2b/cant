// Can't Ticket - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories live in `lib/learn/categories.ts` (catalog-derived from `@cant/shared/lib/app-catalog`).
- Challenge files live in `packages/shared/src/lib/challenges/cant-ticket/`, one per category, barrelled in `index.ts`.
- Most challenges are `type: "code"` with `lang: "markdown"`, comparing two ticket bodies side by side. Both panels must look equally plausible at first glance, with no value-judgment words in titles or inline notes.
- Shiki has `markdown` registered as the default language; `tsx` is also loaded for the rare snippet.
- No app-specific tool (no canvas, playground, inspector). Just learn + game.
- Visual components are not wired in this app yet; if a category later wants a hierarchy diagram or splitting flow, contribute it to `@cant/shared/components/` first and add the registry plumbing.
