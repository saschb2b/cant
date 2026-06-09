# Claude Code Rules

## Monorepo structure

This is a pnpm + Turborepo monorepo. Multiple Next.js apps share code via `@cant/shared`.

```
apps/cant-maintain    # React component API patterns
apps/cant-resize      # Responsive design patterns
apps/cant-type        # TypeScript patterns
apps/cant-orchestrate # Container orchestration patterns
apps/cant-seo         # SEO best practices for Next.js
apps/cant-ux          # UX design patterns
apps/cant-explode     # Chemistry patterns (molecules, reactions, structures)
apps/cant-branch      # Git version control patterns
apps/cant-query       # API design patterns
apps/cant-test        # Testing patterns (+ Bug Hunt game)
apps/cant-game        # Game development patterns
apps/cant-ticket      # Agile ticket craft and estimation
apps/cant-hub         # Series hub / landing page / screening
packages/shared       # @cant/shared - components, game logic, challenges, utilities
```

## Before committing

Run checks from the repo root:

```bash
pnpm check
```

This runs all four checks together (lint, typecheck, test, format:check) via Turborepo, with `--continue` so every failure is reported in one pass. To run them individually:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
```

If formatting fails, run `pnpm format` from the repo root (or `npx prettier --write .` in a single app directory).

Do not commit code that fails any of these checks.

`pnpm test` runs each app's vitest suite via Turborepo (apps without a `test` script are skipped). Add tests as colocated `lib/**/*.test.ts` files; see `apps/cant-ticket` or `apps/cant-test` for the setup.

If you encounter pre-existing lint or type errors in files you did not change, fix them immediately. Do not ignore them or defer them as "pre-existing." The codebase must be clean after every session.

When your changes affect project structure (adding/removing/moving apps, files, directories, exports, or dependencies), update all documentation that references the old structure before committing. Check at minimum:

- `CLAUDE.md` (this file) — monorepo structure, shared exports, adding apps/challenges
- `README.md` — app table, project structure tree, "what stays per-app," adding a new app
- App-specific `CLAUDE.md` files — challenge paths, app-specific notes

To check a single app: `pnpm turbo lint --filter=cant-maintain`

## Working with Turborepo

- Use filtered commands when working on one app: `pnpm dev:maintain`, `pnpm build:resize`, `pnpm dev:seo`
- `pnpm dev` starts all apps simultaneously (resource-heavy, avoid unless needed)
- Turbo caches builds. If you change shared code, dependent apps rebuild automatically
- The `build` task depends on `^build` (shared package builds first)

## Working with @cant/shared

### When to add to shared

- Component exists in 2+ apps with identical or near-identical code
- Utility function is used across apps
- **Every shared component must have a Storybook story.** When adding or modifying a component in `packages/shared/src/components/`, create or update its story in the `__stories__/` directory next to it. This is not optional.

### When to keep per-app

- Component uses app-specific challenge data or categories
- File has fewer than ~3 lines of shared logic (re-export is fine, don't over-abstract)
- Theme colors, landing pages, app-specific features (viewer, playground, inspector, changelog)

### Pattern: thin wrappers

Apps import shared components and pass app-specific config as props:

```tsx
// apps/cant-resize/components/site-footer.tsx
import { SiteFooter as SharedSiteFooter } from "@cant/shared/components/site-footer";

const NAV_LINKS = [
  { href: "/canvas", label: "Viewer" },
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
  {
    href: "https://github.com/saschb2b/cant-resize",
    label: "GitHub",
    external: true,
  },
];

export function SiteFooter() {
  return <SharedSiteFooter navLinks={NAV_LINKS} />;
}
```

### Adding shared exports

When adding new files to `packages/shared/src/`, check that the export pattern in `packages/shared/package.json` covers it. Current patterns:

- `./components/*` maps to `./src/components/*.tsx`
- `./components/game/*` maps to `./src/components/game/*.tsx`
- `./lib/*` maps to `./src/lib/*.ts`
- `./lib/game/*` maps to `./src/lib/game/*.ts`
- `./lib/challenges/*` maps to `./src/lib/challenges/*/index.ts`

Each app's `next.config.mjs` includes `transpilePackages: ["@cant/shared"]`.

### App registry

All apps are registered in `packages/shared/src/lib/cant-apps.ts`. Each entry includes the app name, description, theme colors, icon SVG content, and cross-promo text. Update this file when adding a new app.

The `CantSeriesGrid` component (`packages/shared/src/components/cant-series-grid.tsx`) renders the cross-links section on landing pages (`variant="full"`) and play lobbies (`variant="compact"`). It reads from the app registry.

## Working with Storybook

Run: `pnpm storybook` (opens on :6006)

### Adding a story

Create a `.stories.tsx` file next to the component in a `__stories__` directory:

```
packages/shared/src/components/__stories__/my-component.stories.tsx
packages/shared/src/components/game/__stories__/my-game-component.stories.tsx
```

### Story quality standard

Stories should work as component documentation, not just render tests. Every story file must include:

1. **`parameters.docs.description.component`** - a 1-3 sentence description of what the component does, where it is used, and any peer dependencies it requires
2. **`argTypes`** - every prop should have a `description`, appropriate `control` type, and `table.defaultValue.summary` for props with defaults
3. **JSDoc comments on exported stories** - a one-line description explaining what the variant demonstrates
4. **Multiple variants** - show default usage, edge cases, and customization options (different sizes, styles, data)

See `packages/shared/src/components/__stories__/smiles-canvas.stories.tsx` for a reference example.

### Story naming conventions

Use space-separated readable titles grouped by function:

```tsx
const meta: Meta<typeof MyComponent> = {
  title: "Layout/My Component", // not "Layout/MyComponent"
  component: MyComponent,
  tags: ["autodocs"],
};
```

Groups: `Foundation`, `Layout`, `Content`, `Visual Renderers`, `Game` (sorted in this order). Use `Visual Renderers` for shared rendering components (Canvas Simulation, Smiles Canvas, Molecule Viewer, PDB Viewer). Use `Content` for challenge UI components (Learn Content Panel, Challenge Anchor, Source Link, etc.).

### Next.js in Storybook

Shared components use `next/link`, `next/image`, and `next/navigation`. These are mocked in `.storybook/mocks/`. If you add a new Next.js import to a shared component, add a mock for it.

### Dark mode

Use the sun/moon toggle in the Storybook toolbar to switch between light and dark themes.

## Code style

- Use pnpm, not npm
- No em dashes in any text (user-facing, comments, JSDoc, metadata). Use commas, periods, colons, or "and" instead
- Prefer MUI's `sx` breakpoint objects over `useMediaQuery` for responsive styling
- Don't override MUI's default `borderRadius` unless there's a specific visual reason
- Keep challenge explanations factually accurate and natural-sounding
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Do not use MUI's `component={Link}` prop in server components. Next.js 16 server components cannot pass functions as props to client components. Wrap `<Link>` around the MUI component instead: `<Link href="..."><Button>text</Button></Link>`

### No thin wrappers

Do not leave behind thin wrapper files that only re-export or trivially delegate to another module. When moving code (e.g. from an app to `@cant/shared`), update all consumers to import from the new location directly and delete the old file. A file that does nothing but `export { X } from "somewhere-else"` or cast a type is dead weight.

Before creating any new file, check whether an existing file can be extended or whether consumers can import the source directly. If a wrapper exists only to re-type or re-export, remove it and update the imports.

## Adding a new app

1. Copy an existing app: `cp -r apps/cant-resize apps/cant-newapp`
2. Update `package.json` name, `next.config.mjs` (keep `output: "standalone"`), metadata in `layout.tsx`
3. Customize `lib/theme.ts`, categories, and landing page. Create challenge files in `packages/shared/src/lib/challenges/cant-newapp/`
4. Add scripts to root `package.json`: `dev:newapp`, `build:newapp`
5. Register the app in `packages/shared/src/lib/cant-apps.ts` with name, colors, and icon SVG content
6. **Keep all icon representations in sync.** Each app has four icon locations that must use the same visual design:
   - `packages/shared/src/lib/cant-apps.ts` `iconSvgContent` (SVG shapes in a 180x180 viewBox, used in app switcher and hub)
   - `apps/<name>/public/icon.svg` (SVG favicon, 32x32)
   - `apps/<name>/app/icon.tsx` (generated PNG favicon, 32x32, using `ImageResponse`)
   - `apps/<name>/app/apple-icon.tsx` (generated Apple touch icon, 180x180, using `ImageResponse`)
7. Create `apps/cant-newapp/Dockerfile` (copy from an existing app, replace the app name)
8. Add the app to the hub: add an entry in `apps/cant-hub/components/hub-series-grid.tsx` `SERIES_META` with challenge/category counts, and update `TOTAL_CHALLENGES` in `apps/cant-hub/components/hero.tsx`
9. Run `pnpm install`

## Adding a new challenge

1. Open the relevant category file in `packages/shared/src/lib/challenges/{app}/`
2. **Pick the best content type before writing anything.** Do not default to `type: "code"`. For each challenge, decide:
   - Can this concept be **animated or simulated**? Use `type: "visual"` with a Canvas 2D or library-backed component (e.g. pathfinding grids, physics simulations, shading comparisons, steering behaviors)
   - Can this concept be **drawn as a structure or diagram**? Use `type: "visual"` with SVG or an npm renderer (e.g. molecular structures, file trees, flow diagrams, git graphs)
   - Is the concept **domain-specific data** with a shared renderer? Use a specialized type like `type: "molecule"`
   - Is this purely a **syntax or API pattern** where the code itself is the point? Only then use `type: "code"`
   - Look at existing visual components in the app's `components/visual/` directory. Reuse or extend them when possible.
3. Append a `Challenge` object with a `content` block and both `explanationCorrect` and `explanationWrong`
4. Link to an authoritative source (React docs, MDN, TypeScript docs)
5. Follow visual parity rules: both sides should have similar length and structure
6. The `correctSide` value is randomized at runtime in game mode
7. **Keep the hub in sync.** Update the challenge count in `apps/cant-hub/components/hub-series-grid.tsx` `SERIES_META` and `TOTAL_CHALLENGES` in `apps/cant-hub/components/hero.tsx` whenever challenges are added or removed
8. **Keep titles and code comments neutral.** Titles and inline code comments must not hint at which side is correct. This is critical for game mode, where players choose the better pattern.
   - Titles should describe the topic, not name the solution (e.g. "Pagination strategy" not "Cursor-based pagination")
   - Do not use value-laden words in titles like "proper", "robust", "structured", "over-fetching", "minimal"
   - Inline code comments should describe what the code does, not judge it
   - Do not add comments listing downsides only on the wrong side (e.g. "// No error handling", "// Crackable in seconds")
   - Do not add comments listing advantages only on the correct side (e.g. "// Fully typed, auto-generated", "// Single source of truth")
   - Both sides should feel equally plausible at first glance. Value judgments belong in `explanationCorrect` and `explanationWrong`, not in titles or code

### Choosing the right content type

**Do not default to code challenges.** `type: "code"` is only appropriate when the challenge is specifically about syntax or API usage. Most concepts are far more engaging and educational as live visuals: animated simulations, interactive diagrams, rendered structures, or side-by-side component comparisons. If a concept can be visualized, it must be visualized.

**Use npm packages for visual rendering.** Search for a well-maintained npm package that handles the domain-specific rendering (e.g. `3dmol` for 3D molecules, `smiles-drawer` for chemical structures, `recharts` for charts). Using a proven library produces better visuals with less custom code. For interactive simulations (physics, pathfinding, particle effects), Canvas 2D with `requestAnimationFrame` is a good fit. Only fall back to static SVG when no animated or library-based approach applies.

**Contribute reusable visual components to `@cant/shared`.** When a visual component (chart renderer, diagram viewer, interactive widget) could serve multiple apps, build it in `packages/shared/src/components/` rather than keeping it app-local. The following shared renderers are already available:

- `@cant/shared/components/molecule-viewer` - 3D molecule viewer (`3dmol`, XYZ format, auto-rotating)
- `@cant/shared/components/pdb-viewer` - 3D protein structure viewer (`3dmol`, PDB format, fetches from RCSB)
- `@cant/shared/components/smiles-canvas` - 2D chemical structure renderer (`smiles-drawer`, SMILES notation, dark/light theme)
- `@cant/shared/components/canvas-simulation` - Canvas 2D simulation shell (Paper + label + bordered canvas) plus `useIsDarkMode` hook

`3dmol` and `smiles-drawer` are optional peer deps of `@cant/shared`. Only apps that import the molecule/SMILES components need to install them. `CanvasSimulation` uses only MUI (no extra deps).

### Challenge content types

Every challenge has a `content` field that describes what is being compared. The `correctSide` field indicates which side (`"left"` or `"right"`) is the better option.

**Code challenge** (two syntax-highlighted code snippets):

```ts
{
  id: "mq-001",
  category: "media-queries",
  difficulty: "easy",
  title: "Mobile-first vs desktop-first",
  content: {
    type: "code",
    lang: "css",                    // optional, defaults to "tsx"
    left: `/* Desktop-first */
@media (max-width: 768px) { ... }`,
    right: `/* Mobile-first */
@media (min-width: 768px) { ... }`,
  },
  correctSide: "right",
  explanationCorrect: "Mobile-first starts with the simplest layout...",
  explanationWrong: "Desktop-first forces you to undo styles...",
  sourceUrl: "https://developer.mozilla.org/...",
  sourceLabel: "MDN: Mobile-first responsive design",
}
```

**Image challenge** (two static images, e.g. UX screenshots):

```ts
{
  id: "ux-001",
  category: "form-ux",
  difficulty: "easy",
  title: "Touch target sizing",
  content: {
    type: "image",
    left: { src: "/challenges/ux-001-a.png", alt: "Tiny buttons" },
    right: { src: "/challenges/ux-001-b.png", alt: "44px touch targets" },
  },
  correctSide: "right",
  // ...
}
```

**Visual challenge** (two live React components from a registry):

```ts
{
  id: "vis-001",
  category: "layout",
  difficulty: "medium",
  title: "Form layout comparison",
  content: {
    type: "visual",
    left: { componentId: "LoginFormCramped" },
    right: { componentId: "LoginFormSpaced" },
  },
  correctSide: "right",
  // ...
}
```

**Molecule challenge** (two chemical structures with properties):

```ts
{
  id: "mol-001",
  category: "structural-formulas",
  difficulty: "medium",
  title: "Benzene representation",
  content: {
    type: "molecule",
    left: {
      name: "Cyclohexatriene",
      formula: "C₆H₆",
      smiles: "C1=CC=CC=C1",
      properties: { "Bond lengths": "Alternating" },
    },
    right: {
      name: "Benzene",
      formula: "C₆H₆",
      smiles: "c1ccccc1",
      properties: { "Bond lengths": "Equal (1.40 A)" },
    },
  },
  correctSide: "right",
  // ...
}
```

**Game simulation challenge** (two animated Canvas 2D components, e.g. pathfinding, physics, shading):

```ts
{
  id: "ai-002",
  category: "ai",
  difficulty: "medium",
  title: "Pathfinding heuristic",
  prompt: "Which A* heuristic produces shorter paths on a grid that allows diagonal movement?",
  content: {
    type: "visual",
    left: { componentId: "PathfindingManhattan" },
    right: { componentId: "PathfindingOctile" },
  },
  correctSide: "right",
  // ...
}
```

Each component renders a live animated canvas (collision detection, rope physics, shading models, steering behaviors, etc.) using `requestAnimationFrame` loops. See `apps/cant-game/components/visual/` for examples of canvas-based game simulations that visualize concepts far more effectively than code snippets.

### Using visual challenges in an app

Visual challenges render live React components instead of code snippets. They require per-app wiring since the component registry is app-specific. Prefer visual challenges over plain-text code when the content is structural (file trees, diagrams, flows, molecules, charts) rather than syntax.

**Per-app setup** (see cant-branch, cant-test, or cant-explode for full examples):

1. **Find an npm package** that handles the domain-specific rendering (e.g. `3dmol` for 3D molecules, `smiles-drawer` for 2D chemical structures, `recharts` for charts). Prefer proven libraries over hand-rolled SVG.
2. Create visual components in `components/visual/` (e.g. `file-tree.tsx`, `git-graph.tsx`, `molecule-viewer.tsx`)
3. Create a registry in `components/visual/registry.tsx` that maps `componentId` strings to components
4. Create a `components/game/visual-panel.tsx` wrapper that looks up the registry and renders via `SharedVisualPanel`
5. Pass `visualPanel: VisualPanelWrapper` in the `slots` prop of `SharedGame` in `components/game/game.tsx`
6. In `app/learn/[category]/page.tsx`, add a `renderContentPanel` function that checks for `entry?.type === "visual"` and renders the component from the registry, falling back to `LearnContentPanel` for code/image types

**Apps with visual challenges:** cant-game (animated Canvas 2D game simulations: pathfinding, collision detection, shading, rope physics, steering, state machines), cant-explode (3D molecules via `3dmol`, 2D structures via `smiles-drawer`, SVG orbital/energy diagrams, periodic table visualizations), cant-branch (git graphs, file trees, diffs, terminals, flow diagrams), cant-ux (visual component comparisons), cant-test (file trees)

### Shared infrastructure

All challenge data lives in `packages/shared/src/lib/challenges/{app}/`, one directory per app. Each directory has category files and a barrel `index.ts` that exports a combined `challenges` array. Apps import directly: `import { challenges } from "@cant/shared/lib/challenges/cant-resize"`.

Challenge types use the generic `BaseChallenge<Category>` from `@cant/shared/lib/game`. Each app defines a one-line type alias in its `lib/learn/types.ts` (or `lib/game/types.ts`): `export type Challenge = BaseChallenge<ChallengeCategory>`.

Challenge rendering is centralized in `@cant/shared`:

- `buildContentMap()` processes challenges into a render-ready content map, handling `correctSide` mapping and Shiki highlighting for code challenges
- `LearnCategoryPage` renders the full learn/[category] page; apps provide a `renderExplanation` slot and optionally a `renderContentPanel` slot for visual challenges
- `LearnIndexPage` renders the learn index page with optional learning path
- `LearnContentPanel` renders the Avoid/Prefer content panels (code, image, visual, or molecule)
- `ImagePanel`, `VisualPanel`, and `MoleculePanel` are game-mode panel components for non-code challenges
- Content types are defined as a discriminated union (`ChallengeContent`) in `packages/shared/src/lib/game/types.ts`: `code`, `image`, `visual`, `molecule`

When building visual components that could serve multiple apps, add them to `@cant/shared` so other apps can reuse them. New content type variants can be added to the `ChallengeContent` union when an existing type does not fit.

## Deployment

Each app deploys as a Docker container via Coolify. See `docs/coolify-deployment.md` for full details.

Key files:

- `apps/<name>/Dockerfile` per app
- `.dockerignore` at repo root
- `output: "standalone"` in each `next.config.mjs`
