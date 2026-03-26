import type { Challenge } from "../types";

export const gridPatternChallenges: Challenge[] = [
  {
    id: "gp-001",
    category: "grid-patterns",
    difficulty: "easy",
    title: "auto-fill vs fixed columns",
    badCode: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}`,
    goodCode: `.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`auto-fill` with `minmax(250px, 1fr)` creates as many columns as fit, each at least 250px wide, growing to fill space. Three columns on desktop, two on tablet, one on mobile, all with zero media queries. The grid responds to its container, not the viewport.",
    explanationWrong:
      "Hardcoded `1fr 1fr 1fr` always creates three columns. On a 320px phone, each column is ~100px wide, which is far too narrow. The media query at 768px is a bandaid: the grid should naturally adapt to available space.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/repeat#auto-fill",
    sourceLabel: "MDN: repeat(auto-fill)",
  },
  {
    id: "gp-002",
    category: "grid-patterns",
    difficulty: "easy",
    title: "auto-fill vs auto-fit",
    badCode: `/* 2 items in a wide container */
.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(200px, 1fr));
}
/* Creates invisible empty tracks that
   prevent items from stretching fully */`,
    goodCode: `/* 2 items in a wide container */
.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(200px, 1fr));
}
/* Empty tracks collapse to 0px,
   items stretch to fill the row */`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`auto-fit` collapses empty tracks to 0px, so the remaining items stretch via `1fr` to fill the full container width. With 2 items in a 1200px container, `auto-fit` gives two ~600px items. Use `auto-fit` when you want items to expand to fill available space.",
    explanationWrong:
      "`auto-fill` creates as many tracks as can fit, even if some are empty. These empty tracks still participate in the `1fr` distribution, so items share the space with invisible empty columns. The visual result: items don't stretch to fill the row. Use `auto-fill` when you want a consistent grid structure regardless of item count.",
    sourceUrl:
      "https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/",
    sourceLabel: "CSS-Tricks: auto-fill vs auto-fit",
  },
  {
    id: "gp-003",
    category: "grid-patterns",
    difficulty: "medium",
    title: "Responsive grid with subgrid",
    badCode: `.card-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Cards have different content heights,
   causing misaligned footers */
.card {
  display: flex;
  flex-direction: column;
}

.card-footer {
  margin-top: auto;
}`,
    goodCode: `.card-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* header, body, footer */
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`subgrid` aligns the card's internal rows (header, body, footer) across all cards in the same grid row. Every card's footer sits at the same vertical position regardless of content height. This is what `margin-top: auto` approximates but can't guarantee across siblings.",
    explanationWrong:
      "`margin-top: auto` pushes the footer down within each card, but cards in the same row still have different internal proportions. The header of one card might be 2 lines while another is 1, and subgrid ensures these internal rows align across the grid.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid",
    sourceLabel: "MDN: Subgrid",
  },
  {
    id: "gp-004",
    category: "grid-patterns",
    difficulty: "medium",
    title: "Grid areas for layout reordering",
    badCode: `.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar { order: 2; }
  .main { order: 1; }
}`,
    goodCode: `.layout {
  display: grid;
  grid-template-areas:
    "sidebar main";
  grid-template-columns: 240px 1fr;
}

@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "main"
      "sidebar";
    grid-template-columns: 1fr;
  }
}

.sidebar { grid-area: sidebar; }
.main { grid-area: main; }`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Named grid areas make the layout intent readable at a glance because you can see the visual structure in the CSS. Reordering with `grid-template-areas` is explicit about the new arrangement, while `order` just shifts items without showing the full picture.",
    explanationWrong:
      "`order` rearranges items but doesn't convey the intended layout shape. With named areas, any developer can look at the `grid-template-areas` string and immediately see \"main on top, sidebar below\". It's a visual diagram in CSS.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas",
    sourceLabel: "MDN: grid-template-areas",
  },
  {
    id: "gp-005",
    category: "grid-patterns",
    difficulty: "hard",
    title: "Full-bleed layout with grid",
    badCode: `.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.full-bleed {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}`,
    goodCode: `.page {
  display: grid;
  grid-template-columns:
    1fr min(1200px, 100% - 2rem) 1fr;
}

.page > * {
  grid-column: 2;
}

.full-bleed {
  grid-column: 1 / -1;
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "The 3-column grid creates automatic gutters (outer `1fr` columns) with content centered in the middle column. `.full-bleed` spans all columns. No `100vw` scrollbar issues, no negative margin hacks, and it works inside any container.",
    explanationWrong:
      "`100vw` includes the scrollbar width on Windows, causing horizontal overflow. The `calc(-50vw + 50%)` hack is fragile and breaks inside flex/grid containers. It also doesn't account for scrollbars. The grid approach is robust and readable.",
    sourceUrl: "https://www.joshwcomeau.com/css/full-bleed/",
    sourceLabel: "Josh Comeau: Full-bleed layout",
  },
];
