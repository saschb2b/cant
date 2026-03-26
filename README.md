# Can't Series Monorepo

Educational platforms for developers. Each app presents code challenges where you pick the better variant, with topic-specific tools and a pattern reference library.

| App | Topic | Live |
|-----|-------|------|
| [cant-maintain](apps/cant-maintain) | React component API design | [cantmaintain.com](https://cantmaintain.com) |
| [cant-resize](apps/cant-resize) | Responsive design patterns | [cantresize.com](https://cantresize.com) |
| [cant-type](apps/cant-type) | TypeScript patterns | [canttype.com](https://canttype.com) |

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** MUI 7, Emotion, Lucide icons
- **Syntax highlighting:** Shiki
- **Monorepo:** pnpm workspaces + Turborepo
- **Shared components:** Storybook 10
- **Analytics:** Umami (self-hosted)
- **Hosting:** Coolify (self-hosted)

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

# Start a single app
pnpm dev:maintain    # cant-maintain on :3000
pnpm dev:resize      # cant-resize on :3000
pnpm dev:type        # cant-type on :3000

# Start Storybook for shared components
pnpm storybook       # opens on :6006
```

## Project structure

```
cant/
├── apps/
│   ├── cant-maintain/       # React API patterns app
│   ├── cant-resize/         # Responsive design app
│   └── cant-type/           # TypeScript patterns app
├── packages/
│   └── shared/              # @cant/shared — shared components and utils
│       ├── .storybook/      # Storybook config
│       └── src/
│           ├── components/  # UI components
│           └── lib/         # Utilities, hooks, game logic
├── turbo.json               # Turborepo task config
├── pnpm-workspace.yaml      # Workspace definition
└── tsconfig.base.json       # Shared TypeScript config
```

## Available scripts

Run from the repo root:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps (resource-heavy, use filtered scripts instead) |
| `pnpm dev:maintain` | Start cant-maintain only |
| `pnpm dev:resize` | Start cant-resize only |
| `pnpm dev:type` | Start cant-type only |
| `pnpm build` | Production build all apps (parallel) |
| `pnpm build:maintain` | Build cant-maintain only |
| `pnpm build:resize` | Build cant-resize only |
| `pnpm build:type` | Build cant-type only |
| `pnpm lint` | Lint all apps |
| `pnpm typecheck` | Type-check all apps |
| `pnpm format:check` | Check formatting |
| `pnpm storybook` | Launch Storybook for shared package |
| `pnpm build-storybook` | Build static Storybook |

## Shared package (`@cant/shared`)

The `packages/shared` package contains components and utilities used across all apps. Apps import from it using:

```tsx
import { ThemeProvider } from "@cant/shared/components/theme-provider";
import { GameHeader } from "@cant/shared/components/game/game-header";
import { codeBlockStyles } from "@cant/shared/lib/code-styles";
import { createTracker } from "@cant/shared/lib/analytics";
```

### What lives in shared

**Components:** ThemeProvider, EmotionRegistry, FormattedText, ChallengeAnchor, SourceLink, Template, NotFound, AnalyticsProviderWrapper

**Game UI:** GameHeader, ExplanationPanel, ActivityGraph

**Utilities:** Shiki highlighter, code block styles, analytics (createTracker + context), game types, activity store, history store

### What stays per-app

- `lib/theme.ts` — each app has its own color palette
- `lib/shiki.ts` — cant-resize adds CSS language support, cant-type adds error decorations
- Challenge data and category definitions
- Landing pages and app-specific features (viewer, playground, changelog)

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
   - `lib/learn/categories.ts` — your challenge categories
   - `lib/learn/challenges/` — your challenge content
   - `app/page.tsx` — your landing page
   - Metadata in `app/layout.tsx`

4. Add root scripts to `package.json`:
   ```json
   "dev:newapp": "turbo dev --filter=cant-newapp",
   "build:newapp": "turbo build --filter=cant-newapp"
   ```

5. Run `pnpm install` to link the workspace.

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

### Deployment

See [docs/coolify-deployment.md](docs/coolify-deployment.md) for self-hosted deployment with Coolify.

## License

MIT
