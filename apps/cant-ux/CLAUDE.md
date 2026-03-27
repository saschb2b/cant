# Can't UX - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- All challenges use `type: "visual"` content with live React component pairs
- Visual demo components live in `components/visual/` (one file per category)
- The component registry maps componentId strings to components in `components/visual/registry.tsx`
- The learn category page uses a custom `renderContentPanel` to resolve visual components
- The game wires visual components through the `visualPanel` slot
- No viewer/canvas feature in this app (unlike cant-resize)
