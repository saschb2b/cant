// Can't Ticket - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories live in `lib/learn/categories.ts` (catalog-derived from `@cant/shared/lib/app-catalog`).
- Challenge files live in `packages/shared/src/lib/challenges/cant-ticket/`, one per category, barrelled in `index.ts`.
- Most challenges are `type: "code"` with `lang: "markdown"`, comparing two ticket bodies side by side. Both panels must look equally plausible at first glance, with no value-judgment words in titles or inline notes.
- Shiki has `markdown` registered as the default language; `tsx` is also loaded for the rare snippet.
- No app-specific tool (no canvas, playground, inspector). Just learn + game + rooms.
- Visual components are not wired in this app yet; if a category later wants a hierarchy diagram or splitting flow, contribute it to `@cant/shared/components/` first and add the registry plumbing.

## Rooms (live gimmicks)

Live team rooms live under `/rooms`. The hub page lists the available tools as cards; each tool has its own creation page and per-session room page. To add another tool later, add a card to `app/rooms/page.tsx` and mirror the directory layout below.

Current tools:

- **Planning Poker** at `/rooms/poker` and `/rooms/poker/[sessionId]`. State in-process under `Symbol.for("cant-ticket:poker-sessions")`. APIs at `/api/poker/sessions/...`.
- **Sprint Retro** at `/rooms/retro` and `/rooms/retro/[sessionId]`. State in-process under `Symbol.for("cant-ticket:retro-sessions")`. APIs at `/api/retro/sessions/...`. Templates are static config in `lib/retro/templates.ts` (4 L's, Start/Stop/Continue, Mad/Sad/Glad, Sailboat, plus runtime Custom). Notes are hidden from non-authors until any participant clicks "Reveal" — visibility is enforced server-side by `snapshotNote` and per-recipient broadcasts. Vote tallies are withheld the same way: `snapshotSession` only emits aggregate `voteCounts` in the `results` phase, and the `phase-changed` event carries the final tally on the transition into results, so during voting each participant sees only their own picks (no live counts, no bandwagon). In results the tally shows but the per-card "you voted" highlight is suppressed so a shared screen never exposes individual votes. Results keeps the board central: columns sort by votes and the board's top vote-getter(s) get a primary-tinted card and vote chip (`topVoteCount` computed in `retro-room.tsx`, threaded through `Column` to `VoteChip`) so the most-voted items stand out in place. Action items are always visible. Export is "copy as markdown" only (action item owners survive anonymization since they are accountability, not authorship); nothing is persisted.

Shared bits: `lib/rooms/session-id.ts` generates session and participant IDs for both gimmicks. Each gimmick has its own in-process store keyed by a distinct `Symbol.for(...)` namespace and its own SSE broadcaster. Sessions and participants vanish when the server restarts or after idle timeouts (5 min empty TTL, 30s participant grace). The feature assumes a single Node instance; nothing is wired to any persistence layer.
