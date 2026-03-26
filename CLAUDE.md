# Claude Code Rules

## Monorepo structure

This is a pnpm + Turborepo monorepo. Three Next.js apps share code via `@cant/shared`.

```
apps/cant-maintain    # React component API patterns
apps/cant-resize      # Responsive design patterns
apps/cant-type        # TypeScript patterns
packages/shared       # @cant/shared - components, game logic, utilities
```

## Before committing

Run checks from the repo root:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
```

If formatting fails, run `npx prettier --write .` from the affected app directory.

Do not commit code that fails any of these checks.

To check a single app: `pnpm turbo lint --filter=cant-maintain`

## Working with Turborepo

- Use filtered commands when working on one app: `pnpm dev:maintain`, `pnpm build:resize`
- `pnpm dev` starts all apps simultaneously (resource-heavy, avoid unless needed)
- Turbo caches builds. If you change shared code, dependent apps rebuild automatically
- The `build` task depends on `^build` (shared package builds first)

## Working with @cant/shared

### When to add to shared

- Component exists in 2+ apps with identical or near-identical code
- Utility function is used across apps

### When to keep per-app

- Component uses app-specific challenge data or categories
- File has fewer than ~3 lines of shared logic (re-export is fine, don't over-abstract)
- Theme colors, landing pages, app-specific features (viewer, playground, changelog)

### Pattern: thin wrappers

Apps import shared components and pass app-specific config as props:

```tsx
// apps/cant-resize/components/site-footer.tsx
import { SiteFooter as SharedSiteFooter } from "@cant/shared/components/site-footer";

const NAV_LINKS = [
  { href: "/canvas", label: "Viewer" },
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Learn" },
  { href: "https://github.com/saschb2b/cant-resize", label: "GitHub", external: true },
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

Each app's `next.config.mjs` includes `transpilePackages: ["@cant/shared"]`.

## Working with Storybook

Run: `pnpm storybook` (opens on :6006)

### Adding a story

Create a `.stories.tsx` file next to the component in a `__stories__` directory:

```
packages/shared/src/components/__stories__/my-component.stories.tsx
packages/shared/src/components/game/__stories__/my-game-component.stories.tsx
```

### Story naming conventions

Use space-separated readable titles grouped by function:

```tsx
const meta: Meta<typeof MyComponent> = {
  title: "Layout/My Component",  // not "Layout/MyComponent"
  component: MyComponent,
  tags: ["autodocs"],
};
```

Groups: `Foundation`, `Layout`, `Content`, `Game` (sorted in this order).

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

## Adding a new app

1. Copy an existing app: `cp -r apps/cant-resize apps/cant-newapp`
2. Update `package.json` name, `next.config.mjs`, metadata in `layout.tsx`
3. Customize `lib/theme.ts`, categories, challenges, and landing page
4. Add scripts to root `package.json`: `dev:newapp`, `build:newapp`
5. Run `pnpm install`

## Adding a new challenge

1. Open the relevant category file in the app's `lib/learn/challenges/` (or `lib/game/challenges/`)
2. Append a `Challenge` object with both `explanationCorrect` and `explanationWrong`
3. Link to an authoritative source (React docs, MDN, TypeScript docs)
4. Follow visual parity rules: both code sides should have similar length and structure
5. The `correctSide` value is randomized at runtime
