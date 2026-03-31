# Can't Game - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- All challenges use `type: "visual"` with animated Canvas 2D components in `components/visual/`
- Visual components render live game simulations (pathfinding, collision detection, shading, rope physics, steering, state machines, camera follow, aim assist, analog deadzones, jump mechanics)
- Visual components use `CanvasSimulation` and `useIsDarkMode` from `@cant/shared/components/canvas-simulation` for the shell; simulation logic is app-specific
- `lib/shiki.ts` adds JSON, YAML, and Bash language support (minimal use since challenges are visual)
- Hero animation (`components/hero-animation.tsx`) is a custom SVG game controller with frame-based input sequences
- Umami website ID: `placeholder-cant-game` (not yet configured)
