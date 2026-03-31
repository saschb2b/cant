# Can't Branch - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/game/categories.ts` and `lib/game/challenges/` (note: `game/` not `learn/`)
- Heavy use of visual challenges with npm rendering libraries:
  - `@gitgraph/react` for git graph visualizations
  - `@xyflow/react` for flow diagrams (CI pipelines, branch protection)
  - `react-arborist` for file tree components
  - `react-diff-viewer-continued` for diff comparisons
- Visual components in `components/visual/` include git graphs, diff viewers, flow diagrams, file trees, terminal outputs, and commit cards
- Uses Inter font (not Geist) and a pink/purple accent palette
- `lib/shiki.ts` adds Bash, YAML, Markdown, JSON, and TOML language support
- Umami website ID: `f09fdcdc-db94-4831-a1c3-d983f38f1205`
