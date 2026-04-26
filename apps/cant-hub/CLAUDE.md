# Can't Hub - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- This is the landing page hub, not a challenge app. It showcases all series with stats and links.
- Challenge and category counts are derived from `@cant/shared/lib/app-catalog` (single source of truth). No manual counting needed.
- Reads app metadata (name, colors, icons, links) from `@cant/shared/lib/cant-apps`
- No Shiki, no game logic, no challenge data
- Umami website ID: `7d721299-598d-463c-b6e8-18ed8f067794`

## Screening feature flag

The recruiter screening flow (sign-in, dashboard, candidate `/s/*` routes) is gated by `NEXT_PUBLIC_SCREENING_ENABLED`. When unset or not `"true"`, `proxy.ts` returns 404 for all screening routes and `UserMenu` renders nothing. Production deployments leave it unset; local dev opts in via `.env.local`. See `docs/local-auth-setup.md`.
