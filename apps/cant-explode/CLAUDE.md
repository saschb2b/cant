# Can't Explode - App Rules

See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide rules.

## App-specific notes

- Categories and challenges live in `lib/learn/categories.ts` and `lib/learn/challenges/`
- This app uses the molecule content type and visual challenges for chemistry structure comparisons
- Visual components in `components/visual/` use shared renderers from `@cant/shared`:
  - `MoleculeViewer` and `PdbViewer` for 3D structures (backed by `3dmol`)
  - `SmilesCanvas` for 2D chemical structure rendering (backed by `smiles-drawer`)
- Other visual components use hand-crafted SVG (orbital diagrams, energy profiles, periodic trends, stereochemistry)
- `lib/shiki.ts` is minimal since most challenges use molecule or visual type, not code
- Umami website ID: `c78811f8-12ee-429b-84e0-592edd47676f`
