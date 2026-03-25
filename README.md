# Can't Resize

A responsive design toolkit for developers. Preview any URL across devices with synced interactions, and learn responsive patterns through side-by-side code comparisons.

## Viewer

A multi-device responsive design viewer at `/canvas`.

- **Device presets**: iPhone, Pixel, Galaxy, iPad, MacBook, desktop sizes, and custom dimensions
- **Freeform canvas**: Infinite pan/zoom workspace with draggable, resizable device frames (Miro-style floating UI)
- **Grid mode**: Auto-arranged comparison view with drag-to-reorder
- **Event sync** (same-origin): Scroll, mouse, click, hover, and navigation sync across all viewports
- **Persistent state**: Device layout saved to localStorage

## Learn

82 responsive design patterns across 16 categories at `/learn`.

- **Foundations**: Media Queries, Container Queries, Fluid Typography, Viewport Units
- **Layout**: Flexbox Patterns, Grid Patterns, Responsive Spacing, Overflow Handling
- **Components**: Breakpoint Hooks, Responsive Props, Conditional Rendering, Responsive Images
- **Frameworks**: MUI Responsive, Tailwind Responsive
- **Anti-Patterns**: Common Mistakes, Testing Responsive

Each pattern shows an Avoid/Prefer code comparison with syntax highlighting, an explanation, and a link to authoritative documentation.

## Search

Fuzzy search across all pages, categories, and patterns with Ctrl+K / Cmd+K. Powered by fuse.js with keyword extraction from code snippets.

## Tech Stack

- Next.js 16 (App Router, View Transitions)
- React 19
- Material UI 7 + Emotion
- Shiki (syntax highlighting)
- Fuse.js (search)
- Umami (analytics)
- TypeScript, pnpm

## Development

```bash
pnpm install
pnpm dev
```

## Project Structure

```
app/
  page.tsx                    # Landing page
  canvas/page.tsx             # Viewer workspace
  learn/
    page.tsx                  # Pattern overview
    [category]/page.tsx       # Category detail
  not-found.tsx               # 404 redirect with analytics

components/
  site-header.tsx             # Shared header (search, nav, theme)
  site-footer.tsx             # Shared footer
  search-palette.tsx          # Ctrl+K search dialog
  formatted-text.tsx          # Inline markdown renderer
  challenge-anchor.tsx        # Copyable heading links
  source-link.tsx             # Tracked external links
  learn-sidebar.tsx           # Category navigation
  learn-mobile-nav.tsx        # Mobile horizontal scroll nav
  viewer/
    viewer-provider.tsx       # Context + reducer for viewer state
    canvas.tsx                # Freeform canvas + grid mode with reorder
    canvas-overlay.tsx        # Floating widget pills (URL, zoom, tools)
    viewport-frame.tsx        # Device frame (drag, resize, iframe sync)
    toolbar.tsx               # Legacy toolbar (unused, kept for reference)
    device-picker.tsx         # Device selection dialog

lib/
  theme.ts                    # MUI light/dark theme
  shiki.ts                    # Syntax highlighter (TSX + CSS)
  code-styles.ts              # Shared code block styles
  analytics.ts                # Type-safe Umami event tracking
  search-items.ts             # Search index generation
  learn/
    types.ts                  # Challenge types
    categories.ts             # 16 categories with metadata
    challenges/               # 82 patterns across 16 files
  viewer/
    types.ts                  # Viewer state types
    device-presets.ts         # Device catalog
    use-canvas.ts             # Pan/zoom with multiplicative scaling
    use-iframe-sync.ts        # PostMessage-based event sync
    use-viewport-drag.ts      # Pointer-based viewport dragging
    use-viewport-resize.ts    # Edge/corner resize handles
    use-zoom-controls.ts      # Zoom UI logic
```

## Limitations

- Some websites block iframe embedding via X-Frame-Options or CSP headers
- Full event sync (scroll, mouse, click, hover, navigation) requires same-origin sites (e.g., localhost)
