# Can't SEO

An SEO toolkit for Next.js developers. Inspect how any URL appears across social platforms, and learn SEO patterns through side-by-side code comparisons.

## Link Inspector

A link preview inspector at `/inspector`.

- **URL scraping**: Paste any URL and extract all meta tags, Open Graph, Twitter Cards, JSON-LD, favicons, and canonical URLs
- **Platform previews**: See how the link appears on Google, LinkedIn, Twitter/X, Slack, Microsoft Teams, Discord, and WhatsApp
- **SEO checklist**: 12-point score showing which elements are present or missing, with inline code snippets to fix each issue
- **Platform filter**: Toggle individual platform previews on or off
- **Raw metadata**: Expandable table of all meta tags with OG/Twitter/other count badges
- **Missing image placeholders**: Clear visual indicator when og:image is absent

## Learn

64 SEO patterns across 8 categories at `/learn`.

- **Foundations**: Meta Tags, Open Graph, Twitter Cards
- **Technical SEO**: Canonical URLs, Sitemaps and Robots, Structured Data
- **Performance and i18n**: Image Optimization, Internationalization

Each pattern shows an Avoid/Prefer code comparison with syntax highlighting, an explanation, and a link to authoritative documentation (Next.js docs, MDN, web.dev, schema.org).

## Play

Pick the better SEO pattern in 10 side-by-side code challenges at `/play`. Daily and weekly seeds for consistent challenge sets.

## Search

Fuzzy search across all pages, categories, and patterns with Ctrl+K / Cmd+K. Powered by fuse.js with keyword extraction from code snippets.

## Tech Stack

- Next.js 16 (App Router, View Transitions)
- React 19
- Material UI 7 + Emotion
- Shiki (syntax highlighting for TSX, CSS, HTML)
- htmlparser2 (server-side HTML parsing for the inspector API)
- Fuse.js (search)
- Umami (analytics)
- TypeScript, pnpm

## Development

```bash
pnpm install
pnpm dev:seo
```

## Project Structure

```
app/
  page.tsx                    # Landing page
  inspector/page.tsx          # Link inspector tool
  api/inspect/route.ts        # URL scraping API endpoint
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
  inspector/
    types.ts                  # InspectResponse type
    preview-card-base.tsx     # Shared card wrapper for all platforms
    google-preview.tsx        # Google Search result preview
    linkedin-preview.tsx      # LinkedIn link card preview
    twitter-preview.tsx       # Twitter/X card preview (summary + large image)
    slack-preview.tsx         # Slack unfurl preview
    teams-preview.tsx         # Microsoft Teams card preview
    discord-preview.tsx       # Discord embed preview
    whatsapp-preview.tsx      # WhatsApp link preview
    image-placeholder.tsx     # "No og:image found" placeholder
    seo-score.tsx             # 12-point checklist with code snippets
    metadata-table.tsx        # Raw meta tags and JSON-LD accordion
  game/
    game.tsx                  # Game wrapper
    lobby-screen.tsx          # Seed selection and category filter
    results-screen.tsx        # Score, rank, and share
    code-panel.tsx            # Syntax-highlighted code card
    explanation-panel.tsx     # Correct/wrong explanation
    activity-graph.tsx        # Play history heatmap

lib/
  theme.ts                    # MUI light/dark theme (blue palette)
  shiki.ts                    # Syntax highlighter (TSX, CSS, HTML)
  analytics.ts                # Type-safe Umami event tracking
  search-items.ts             # Search index generation
  learn/
    types.ts                  # Challenge types
    categories.ts             # 8 categories with metadata
    challenges/               # 64 patterns across 8 files
  game/
    types.ts                  # Game state types
    use-game.ts               # Game state hook
    share.ts                  # Score sharing and ranks
    seeded-random.ts          # Deterministic challenge order
    history.ts                # Play history store
    activity.ts               # Activity heatmap store
    actions.ts                # Server actions
```
