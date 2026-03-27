# Can't Orchestrate

A container orchestration toolkit for developers. Explore Dockerfiles with visual stage breakdowns and lint checks, and learn orchestration patterns through side-by-side code comparisons.

## Explorer

A Dockerfile explorer tool at `/explorer`.

- **Paste or select a preset**: Paste any Dockerfile or pick from presets (Node.js, Python, Go, multi-stage)
- **Stage visualization**: Multi-stage builds broken down into visual cards per stage
- **Step breakdown**: Each instruction shown with its layer impact
- **Lint panel**: Automated best-practice checks with warnings and suggestions

## Learn

68 container orchestration patterns across 16 categories at `/learn`.

- **Foundations**: Dockerfile Basics, Image Optimization, Docker Compose, Volumes and Storage
- **Container Patterns**: Networking, Health Checks, Security, Environment Config
- **Orchestration**: Kubernetes Pods, Kubernetes Services, Kubernetes Config, Helm Charts
- **Build and Pipelines**: Docker Swarm, CI/CD Pipelines, Build Scripts, Common Mistakes

Each pattern shows an Avoid/Prefer code comparison with syntax highlighting, an explanation, and a link to authoritative documentation.

## Play

Pick the better orchestration pattern in 10 side-by-side code challenges at `/play`. Daily and weekly seeds for consistent challenge sets.

## Search

Fuzzy search across all pages, categories, and patterns with Ctrl+K / Cmd+K. Powered by fuse.js with keyword extraction from code snippets.

## Tech Stack

- Next.js 16 (App Router, View Transitions)
- React 19
- Material UI 7 + Emotion
- Shiki (syntax highlighting for Dockerfile, YAML, Bash, XML, JSON, TOML)
- Fuse.js (search)
- Umami (analytics)
- TypeScript, pnpm

## Development

```bash
pnpm install
pnpm dev:orchestrate
```

## Project Structure

```
app/
  page.tsx                    # Landing page
  explorer/page.tsx           # Dockerfile explorer tool
  learn/
    page.tsx                  # Pattern overview
    [category]/page.tsx       # Category detail
  play/
    page.tsx                  # Game page
    results/page.tsx          # Shareable results with OG meta

components/
  site-header.tsx             # Header with search, nav, theme toggle
  site-footer.tsx             # Footer with nav links
  search-palette.tsx          # Ctrl+K search dialog
  learn-sidebar.tsx           # Category navigation
  learn-mobile-nav.tsx        # Mobile horizontal scroll nav
  hero-animation.tsx          # Landing page animation
  explorer/
    dockerfile-input.tsx      # Paste/select Dockerfile input
    explorer-view.tsx         # Main explorer layout
    stage-card.tsx            # Visual stage breakdown card
    step-row.tsx              # Individual instruction row
    lint-panel.tsx            # Best-practice lint results
  game/
    game.tsx                  # Game wrapper
    lobby-screen.tsx          # Seed selection and category filter
    results-screen.tsx        # Score, rank, and share
    code-panel.tsx            # Syntax-highlighted code card
    explanation-panel.tsx     # Correct/wrong explanation
    activity-graph.tsx        # Play history heatmap

lib/
  theme.ts                    # MUI light/dark theme (purple palette)
  shiki.ts                    # Syntax highlighter (Dockerfile, YAML, Bash, XML, JSON, TOML)
  analytics.ts                # Type-safe Umami event tracking
  search-items.ts             # Search index generation
  learn/
    types.ts                  # Challenge types
    categories.ts             # 16 categories with metadata
    challenges/               # 68 patterns across 16 files
  explorer/
    types.ts                  # Dockerfile AST types
    parse-dockerfile.ts       # Dockerfile parser
    lint-rules.ts             # Best-practice lint rules
    layer-info.ts             # Layer size estimation
    presets.ts                # Example Dockerfiles
  game/
    types.ts                  # Game state types
    use-game.ts               # Game state hook
    share.ts                  # Score sharing and ranks
    seeded-random.ts          # Deterministic challenge order
    history.ts                # Play history store
    activity.ts               # Activity heatmap store
    actions.ts                # Server actions
```
