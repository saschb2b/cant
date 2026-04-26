import type { BaseChallenge } from "../../game/types";

export const flexboxPatternChallenges: BaseChallenge[] = [
  {
    id: "fb-001",
    category: "flexbox-patterns",
    difficulty: "easy",
    title: "flex-wrap for natural reflow",
    prompt: "Which wraps items based on available space?",
    content: {
      type: "code",

      lang: "css",

      left: `.card-row {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .card-row {
    flex-direction: column;
  }
}`,

      right: `.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-row > * {
  flex: 1 1 300px;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`flex-wrap: wrap` with `flex: 1 1 300px` means each card wants to be at least 300px wide. When the container can't fit two 300px cards side by side, they automatically wrap without any breakpoint. The items also grow to fill available space.",
    explanationWrong:
      "A `max-width: 768px` breakpoint is arbitrary. What if the container is in a sidebar and only 400px wide? The cards would still try to sit side by side because the *viewport* is wider than 768px. `flex-wrap` responds to actual available space.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap",
    sourceLabel: "MDN: flex-wrap",
  },
  {
    id: "fb-002",
    category: "flexbox-patterns",
    difficulty: "easy",
    title: "Gap vs margin for spacing",
    prompt: "Which spacing method is cleaner in flexbox?",
    content: {
      type: "code",

      lang: "css",

      left: `.nav-links {
  display: flex;
}

.nav-links > * {
  margin-right: 1rem;
}

.nav-links > *:last-child {
  margin-right: 0;
}`,

      right: `.nav-links {
  display: flex;
  gap: 1rem;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`gap` applies spacing *between* flex children only, so there's no extra margin on the first or last item and no `:last-child` override needed. It also works correctly when items wrap: no trailing gap on the last item of each row.",
    explanationWrong:
      "Margin-based spacing requires removing the margin from the last child. If items wrap, you also need to handle the last item of *each row*, which `:last-child` doesn't cover. `gap` handles all of this automatically.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/gap",
    sourceLabel: "MDN: gap",
  },
  {
    id: "fb-003",
    category: "flexbox-patterns",
    difficulty: "medium",
    title: "flex-shrink for graceful overflow",
    prompt: "Which toolbar handles overflow gracefully?",
    content: {
      type: "code",

      lang: "css",

      left: `.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}`,

      right: `.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-title {
  flex: 1 1 0%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-actions {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`flex: 1 1 0%` makes the title take remaining space and shrink when needed. `min-width: 0` overrides the default `min-width: auto` so text truncation actually works. `flex-shrink: 0` on actions prevents buttons from compressing.",
    explanationWrong:
      "Without `min-width: 0`, the title's `min-width: auto` prevents it from shrinking below its content width, so the ellipsis never activates and the toolbar overflows. Without `flex-shrink: 0`, the action buttons may also compress.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink",
    sourceLabel: "MDN: flex-shrink",
  },
  {
    id: "fb-004",
    category: "flexbox-patterns",
    difficulty: "medium",
    title: "Holy grail layout with flexbox",
    prompt: "Which layout adapts without media queries?",
    content: {
      type: "code",

      lang: "css",

      left: `.layout {
  display: flex;
}

.sidebar { width: 250px; }
.main { width: calc(100% - 500px); }
.aside { width: 250px; }

@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar, .main, .aside {
    width: 100%;
  }
}`,

      right: `.layout {
  display: flex;
  flex-wrap: wrap;
}

.sidebar { flex: 0 0 250px; }
.main { flex: 1 1 600px; }
.aside { flex: 0 0 250px; }`,
    },

    correctSide: "right",
    explanationCorrect:
      "With `flex-wrap: wrap`, the main content has a `flex-basis` of 600px. When the container is narrower than 250 + 600 + 250 = 1100px, items naturally wrap. No media query, no calc(), and it adapts to any container width.",
    explanationWrong:
      "Hardcoded `calc(100% - 500px)` breaks if either sidebar changes width. The 768px breakpoint is arbitrary and doesn't account for the actual content needs. `flex-wrap` with appropriate `flex-basis` values creates a self-adjusting layout.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Typical_use_cases_of_flexbox",
    sourceLabel: "MDN: Typical flexbox use cases",
  },
  {
    id: "fb-005",
    category: "flexbox-patterns",
    difficulty: "hard",
    title: "Responsive alignment with margin-auto",
    prompt: "Which header alignment avoids useMediaQuery?",
    content: {
      type: "code",

      left: `function Header() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Stack
      direction="row"
      justifyContent={
        isMobile ? "center" : "space-between"
      }
    >
      <Logo />
      <Nav />
      <Actions />
    </Stack>
  );
}`,

      right: `function Header() {
  return (
    <Stack direction="row" alignItems="center">
      <Logo />
      <Box sx={{ flex: 1 }} />
      <Nav sx={{ display: { xs: "none", sm: "flex" } }} />
      <Actions sx={{ ml: { xs: "auto", sm: 0 } }} />
    </Stack>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      'A flex spacer (`flex: 1`) pushes nav and actions to the right. On mobile, nav is hidden with CSS and `ml: "auto"` pushes the actions to the far right. No `useMediaQuery`, no hydration flash, and the layout is controlled entirely with CSS.',
    explanationWrong:
      '`useMediaQuery` causes a hydration mismatch: the server renders `space-between` (desktop), then React corrects to `center` on mobile after hydration. The spacer + `display` approach avoids this entirely. `ml: "auto"` pushes the actions to the right when nav is hidden.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container#using_auto_margins_for_main_axis_alignment",
    sourceLabel: "MDN: Auto margins in flexbox",
  },
];
