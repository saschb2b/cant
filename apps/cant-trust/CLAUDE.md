# Can't Trust - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- 18 categories across 3 parts: The Trust Problem (traditional finance), The Bridge (cryptography), The Trust Solution (blockchain/crypto)
- Most challenges will use `type: "visual"` with animated components in `components/visual/`, but initial challenges use `type: "code"` with pseudocode comparisons
- Visual components use `CanvasSimulation` and `useIsDarkMode` from `@cant/shared/components/canvas-simulation` for the shell
- Theme colors: Bitcoin gold (#F7931A dark primary, #C28A1A light primary)
- Planning document: `docs/cant-trust-plan.md`
- Umami website ID: `placeholder-cant-trust` (not yet configured)
