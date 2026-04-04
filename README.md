# Can't Series Monorepo

Educational platforms where you pick the better option in side-by-side comparisons, covering code patterns, design, chemistry, and more.

| App                                       | Topic                      | Tool                | Live                                                                   |
| ----------------------------------------- | -------------------------- | ------------------- | ---------------------------------------------------------------------- |
| [cant-maintain](apps/cant-maintain)       | React component API design | Changelog           | [cant-maintain.saschb2b.com](https://cant-maintain.saschb2b.com)       |
| [cant-resize](apps/cant-resize)           | Responsive design patterns | Multi-device viewer | [cant-resize.saschb2b.com](https://cant-resize.saschb2b.com)           |
| [cant-type](apps/cant-type)               | TypeScript patterns        | TS Playground       | [cant-type.saschb2b.com](https://cant-type.saschb2b.com)               |
| [cant-orchestrate](apps/cant-orchestrate) | Container orchestration    | Dockerfile explorer | [cant-orchestrate.saschb2b.com](https://cant-orchestrate.saschb2b.com) |
| [cant-seo](apps/cant-seo)                 | SEO for Next.js            | Link inspector      | [cant-seo.saschb2b.com](https://cant-seo.saschb2b.com)                 |
| [cant-ux](apps/cant-ux)                   | UX design patterns         | Visual comparisons  | [cant-ux.saschb2b.com](https://cant-ux.saschb2b.com)                   |
| [cant-explode](apps/cant-explode)         | Chemistry and biochemistry | 3D molecule viewer  | [cant-explode.saschb2b.com](https://cant-explode.saschb2b.com)         |
| [cant-hub](apps/cant-hub)                 | Series hub / landing       | App directory       | [cant.saschb2b.com](https://cant.saschb2b.com)                         |

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** MUI 7, Emotion, Lucide icons
- **Syntax highlighting:** Shiki
- **3D molecular viewer:** 3Dmol.js (cant-explode)
- **Monorepo:** pnpm workspaces + Turborepo
- **Shared components:** Storybook 10
- **Analytics:** Umami (self-hosted)
- **Hosting:** Coolify (self-hosted, Docker)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) 10.20+

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
```

## Getting started

```bash
# Install all dependencies
pnpm install

# Start all apps at once (cross-app links work between them)
pnpm dev

# Or start a single app
pnpm dev:hub           # cant-hub on :3000
pnpm dev:maintain      # cant-maintain on :3001
pnpm dev:resize        # cant-resize on :3002
pnpm dev:type          # cant-type on :3003
pnpm dev:orchestrate   # cant-orchestrate on :3004
pnpm dev:seo           # cant-seo on :3005
pnpm dev:ux            # cant-ux on :3006
pnpm dev:explode       # cant-explode on :3007

# Start Storybook for shared components
pnpm storybook         # opens on :6006
```

Each app has a fixed dev port. When running `pnpm dev`, all apps start simultaneously and cross-app links (header, footer, series grid) automatically point to `localhost:<port>` instead of the production URLs.

## Project structure

```
cant/
├── apps/
│   ├── cant-maintain/       # React API patterns app
│   ├── cant-resize/         # Responsive design app
│   ├── cant-type/           # TypeScript patterns app
│   ├── cant-orchestrate/    # Container orchestration app
│   ├── cant-seo/            # SEO patterns app
│   ├── cant-ux/             # UX design patterns app
│   ├── cant-explode/        # Chemistry and biochemistry app
│   └── cant-hub/            # Series hub / landing page
├── packages/
│   └── shared/              # @cant/shared — shared components and utils
│       ├── .storybook/      # Storybook config
│       └── src/
│           ├── components/  # UI components
│           └── lib/
│               ├── challenges/  # Challenge data per app
│               └── game/        # Game logic, types, utilities
├── docs/                    # Deployment and ops documentation
├── turbo.json               # Turborepo task config
├── pnpm-workspace.yaml      # Workspace definition
└── tsconfig.base.json       # Shared TypeScript config
```

## Available scripts

Run from the repo root:

| Script                   | Description                           |
| ------------------------ | ------------------------------------- |
| `pnpm dev`               | Start all apps with cross-app linking |
| `pnpm dev:hub`           | Start cant-hub only (:3000)           |
| `pnpm dev:maintain`      | Start cant-maintain only (:3001)      |
| `pnpm dev:resize`        | Start cant-resize only (:3002)        |
| `pnpm dev:type`          | Start cant-type only (:3003)          |
| `pnpm dev:orchestrate`   | Start cant-orchestrate only (:3004)   |
| `pnpm dev:seo`           | Start cant-seo only (:3005)           |
| `pnpm dev:ux`            | Start cant-ux only (:3006)            |
| `pnpm dev:explode`       | Start cant-explode only (:3007)       |
| `pnpm build`             | Production build all apps (parallel)  |
| `pnpm build:maintain`    | Build cant-maintain only              |
| `pnpm build:resize`      | Build cant-resize only                |
| `pnpm build:type`        | Build cant-type only                  |
| `pnpm build:orchestrate` | Build cant-orchestrate only           |
| `pnpm build:seo`         | Build cant-seo only                   |
| `pnpm build:ux`          | Build cant-ux only                    |
| `pnpm build:hub`         | Build cant-hub only                   |
| `pnpm build:explode`     | Build cant-explode only               |
| `pnpm lint`              | Lint all apps                         |
| `pnpm typecheck`         | Type-check all apps                   |
| `pnpm format:check`      | Check formatting                      |
| `pnpm storybook`         | Launch Storybook for shared package   |
| `pnpm build-storybook`   | Build static Storybook                |

## Shared package (`@cant/shared`)

The `packages/shared` package contains components and utilities used across all apps. Apps import from it using:

```tsx
import { ThemeProvider } from "@cant/shared/components/theme-provider";
import { CantSeriesGrid } from "@cant/shared/components/cant-series-grid";
import { createTracker } from "@cant/shared/lib/analytics";
```

### What lives in shared

**Components:** ThemeProvider, EmotionRegistry, FormattedText, ChallengeAnchor, SourceLink, Template, NotFound, AnalyticsProviderWrapper, CantSeriesGrid, Hero, HeroCta, FeatureGrid, OpenSourceBanner

**Game UI:** Game, GameHeader, LobbyScreen, ResultsScreen, CodePanel, ImagePanel, VisualPanel, ExplanationPanel, ActivityGraph, CategoryFilter, SeedInput

**Learn UI:** LearnIndexPage, LearnCategoryPage, LearnContentPanel, LearnSidebar, LearnMobileNav

**Utilities:** Shiki highlighter, code block styles, analytics context, app theme context, game types, activity store, history store, seeded random, app registry

### AppThemeProvider

Per-app customization (panel labels, styling, checkmark animations) is centralized via an `AppThemeProvider` context. Each app defines its config once in a wrapper component, and all shared components read from it via `useAppTheme()`.

```
packages/shared/src/lib/
├── app-theme.ts           # Types, defaults, createAppTheme() — importable by server components
└── app-theme-context.tsx   # "use client" — context, provider, hook
```

Each app creates `components/app-theme-wrapper.tsx`:

```tsx
"use client";
import {
  AppThemeProvider,
  createAppTheme,
} from "@cant/shared/lib/app-theme-context";
import checkmarkAnimation from "./game/checkmark-animation.json";

const appTheme = createAppTheme({
  labels: { betterLabel: "Correct", worseLabel: "Incorrect" },
  styling: { headerBackground: "secondary.main" },
  slots: { checkmarkAnimation },
});

export function AppThemeWrapper({ children }) {
  return <AppThemeProvider value={appTheme}>{children}</AppThemeProvider>;
}
```

And wraps it in `app/layout.tsx`:

```tsx
<ThemeProvider theme={theme}>
  <AnalyticsProviderWrapper>
    <AppThemeWrapper>{children}</AppThemeWrapper>
  </AnalyticsProviderWrapper>
</ThemeProvider>
```

For server components (learn pages), import from the non-client module:

```tsx
import { createAppTheme } from "@cant/shared/lib/app-theme";
```

**Configurable values:**

| Field                      | Type        | Default              | Used by                              |
| -------------------------- | ----------- | -------------------- | ------------------------------------ |
| `labels.betterLabel`       | `ReactNode` | `"Better"`           | Game panels (correct answer)         |
| `labels.worseLabel`        | `ReactNode` | `"Worse"`            | Game panels (wrong answer)           |
| `labels.badLabel`          | `string`    | `"Avoid"`            | Learn pages (bad side header)        |
| `labels.goodLabel`         | `string`    | `"Prefer"`           | Learn pages (good side header)       |
| `styling.headerBackground` | `string`    | `"action.selected"`  | Panel headers, lobby cards           |
| `styling.codeBackground`   | `string`    | `"background.paper"` | Code panel background                |
| `slots.checkmarkAnimation` | `JSON`      | `undefined`          | Lottie checkmark on correct answer   |
| `slots.overlaySlot`        | `ReactNode` | `undefined`          | Extra overlay (e.g. sparkle effects) |

### App registry

All apps are registered in `packages/shared/src/lib/cant-apps.ts` with their name, description, theme colors, icon SVG content, and cross-promo text. The `CantSeriesGrid` component renders cross-links on landing pages (`variant="full"`) and play lobbies (`variant="compact"`).

### What stays per-app

- `lib/theme.ts` — each app has its own color palette
- `components/app-theme-wrapper.tsx` — per-app panel labels, styling, and animations
- `lib/shiki.ts` — apps add language support as needed (CSS, HTML, Dockerfile, YAML, etc.)
- Category definitions (`lib/learn/categories.ts` or `lib/game/categories.ts`)
- Landing pages and app-specific features (viewer, playground, inspector, explorer, changelog)
- `icon.tsx`, `apple-icon.tsx`, `public/icon.svg` — each app's branded icon

## Adding a new app

1. Copy an existing app as a starting point:

   ```bash
   cp -r apps/cant-resize apps/cant-newapp
   ```

2. Update `apps/cant-newapp/package.json`:
   - Change `name` to `cant-newapp`
   - Keep `@cant/shared` as a workspace dependency

3. Customize:
   - `lib/theme.ts` — your app's color palette
   - `components/app-theme-wrapper.tsx` — panel labels, styling, checkmark animation
   - `lib/learn/categories.ts` — your challenge categories
   - `packages/shared/src/lib/challenges/cant-newapp/` — your challenge content
   - `app/page.tsx` — your landing page
   - `app/icon.tsx`, `app/apple-icon.tsx`, `public/icon.svg` — your app icon
   - Metadata in `app/layout.tsx`

4. Wire up `AppThemeWrapper` in `app/layout.tsx` (see AppThemeProvider section above).

5. Register the app in `packages/shared/src/lib/cant-apps.ts` with name, colors, and icon SVG content.

6. Add root scripts to `package.json`:

   ```json
   "dev:newapp": "turbo dev --filter=cant-newapp",
   "build:newapp": "turbo build --filter=cant-newapp"
   ```

7. Create `apps/cant-newapp/Dockerfile` (copy from an existing app, replace the app name).

8. Run `pnpm install` to link the workspace.

## Contributing

### Before committing

Run all checks and fix any issues:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
```

If formatting fails, run `npx prettier --write .` from the app directory and include the changes.

### Code style

- Use pnpm, not npm
- No em dashes in any text (user-facing, comments, JSDoc, metadata). Use commas, periods, colons, or "and" instead
- Prefer MUI's `sx` breakpoint objects over `useMediaQuery` for responsive styling
- Keep challenge explanations factually accurate and natural-sounding
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

### Deployment

Each app deploys as a Docker container via Coolify with selective rebuilds per app. See [docs/coolify-deployment.md](docs/coolify-deployment.md) for setup, webhook configuration, and watch paths.

## License

MIT
