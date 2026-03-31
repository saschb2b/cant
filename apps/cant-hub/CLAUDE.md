# Can't Hub - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- This is the landing page hub, not a challenge app. It showcases all series with stats and links.
- `SERIES_META` in `components/hub-series-grid.tsx` tracks per-app challenge and category counts
- `TOTAL_CHALLENGES` in `components/hero.tsx` is the sum across all apps. Update both when adding or removing challenges.
- Reads app metadata (name, colors, icons, links) from `@cant/shared/lib/cant-apps`
- No Shiki, no game logic, no challenge data
- Umami website ID: `7d721299-598d-463c-b6e8-18ed8f067794`
