import type { BaseChallenge } from "../../game/types";

export const responsiveSpacingChallenges: BaseChallenge[] = [
  {
    id: "rs-001",
    category: "responsive-spacing",
    difficulty: "easy",
    title: "Fluid spacing with clamp",
    prompt: "Which spacing scales smoothly with the screen?",
    content: {
      type: "code",

      lang: "css",

      left: `.section {
  padding: 2rem;
}

@media (min-width: 768px) {
  .section { padding: 4rem; }
}

@media (min-width: 1024px) {
  .section { padding: 6rem; }
}`,

      right: `.section {
  padding: clamp(2rem, 1rem + 4vw, 6rem);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`clamp()` provides smooth scaling between 2rem and 6rem based on viewport width, all in one line instead of three rules. No breakpoints, no jumps. The spacing grows proportionally with the screen.",
    explanationWrong:
      "Stepped padding creates visual jumps at each breakpoint. At 767px you have 2rem padding; at 768px it snaps to 4rem. `clamp()` creates a smooth transition that feels more natural and requires no maintenance.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
    sourceLabel: "MDN: clamp()",
  },
  {
    id: "rs-002",
    category: "responsive-spacing",
    difficulty: "easy",
    title: "Spacing scale with theme tokens",
    prompt: "Which uses the MUI spacing system correctly?",
    content: {
      type: "code",

      left: `<Stack spacing={4}>
  <Typography>Title</Typography>
  <Box sx={{ mt: "32px", mb: "24px" }}>
    <Content />
  </Box>
  <Box sx={{ mt: "16px" }}>
    <Footer />
  </Box>
</Stack>`,

      right: `<Stack spacing={4}>
  <Typography>Title</Typography>
  <Box sx={{ mt: 4, mb: 3 }}>
    <Content />
  </Box>
  <Box sx={{ mt: 2 }}>
    <Footer />
  </Box>
</Stack>`,
    },

    correctSide: "right",
    explanationCorrect:
      "MUI spacing units (1 unit = 8px by default) keep spacing consistent with the theme's spacing scale. `mt: 4` = 32px, `mb: 3` = 24px. If the theme's spacing factor changes, all values update together. Pixel strings bypass the system.",
    explanationWrong:
      "Hardcoded pixel strings like `\"32px\"` bypass MUI's spacing theme. If the team adjusts the spacing scale (e.g., from 8px to 4px units), these values won't update. Use the numeric shorthand to stay in sync with the design system.",
    sourceUrl: "https://mui.com/system/spacing/",
    sourceLabel: "MUI: Spacing",
  },
  {
    id: "rs-003",
    category: "responsive-spacing",
    difficulty: "medium",
    title: "Responsive spacing with MUI sx",
    prompt: "Which adjusts spacing without a hook?",
    content: {
      type: "code",

      left: `function Section({ children }: Props) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box sx={{ p: isMobile ? 2 : 4, gap: isMobile ? 2 : 3 }}>
      {children}
    </Box>
  );
}`,

      right: `function Section({ children }: Props) {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {children}
    </Box>
  );
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "MUI's `sx` breakpoint objects compile to CSS media queries with no JavaScript hook needed. No re-renders on resize, no SSR hydration mismatch, and the responsive intent is declarative right where the styles are defined.",
    explanationWrong:
      "`useMediaQuery` triggers re-renders on breakpoint crossings and defaults to `false` during SSR. For purely visual spacing changes, CSS media queries (via `sx` breakpoint objects) are always the better choice.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "rs-004",
    category: "responsive-spacing",
    difficulty: "medium",
    title: "Logical properties for spacing",
    prompt: "Which spacing works for RTL languages too?",
    content: {
      type: "code",

      lang: "css",

      left: `.card {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}`,

      right: `.card {
  margin-inline: 1rem;
  padding-inline: 1.5rem;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Logical properties (`margin-inline`, `padding-inline`) automatically flip for right-to-left languages. `margin-inline` is shorthand for `margin-inline-start` + `margin-inline-end`. Fewer lines, and your layout works for RTL users without any additional CSS.",
    explanationWrong:
      "`margin-left`/`margin-right` are physical properties and they don't flip in RTL layouts. If your app is ever translated to Arabic, Hebrew, or another RTL language, all physical spacing needs manual overrides. Logical properties handle this automatically.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values",
    sourceLabel: "MDN: Logical properties",
  },
  {
    id: "rs-005",
    category: "responsive-spacing",
    difficulty: "hard",
    title: "Spacing custom properties with cascade",
    prompt: "Which spacing tokens need less maintenance?",
    content: {
      type: "code",

      lang: "css",

      left: `:root {
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
}

@media (min-width: 768px) {
  :root {
    --space-sm: 0.75rem;
    --space-md: 1.5rem;
    --space-lg: 3rem;
  }
}

@media (min-width: 1280px) {
  :root {
    --space-sm: 1rem;
    --space-md: 2rem;
    --space-lg: 4rem;
  }
}`,

      right: `:root {
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
  --space-md: clamp(1rem, 0.75rem + 1vw, 2rem);
  --space-lg: clamp(2rem, 1.25rem + 2.5vw, 4rem);
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Fluid custom properties scale smoothly without breakpoints. Define them once, use everywhere. Adding a new breakpoint to the stepped approach means redefining every variable; the fluid approach needs no updates.",
    explanationWrong:
      "Every new breakpoint requires redefining every spacing variable. Forget one? That spacing token stays at the previous breakpoint's value. `clamp()` scales every token continuously with zero maintenance overhead.",
    sourceUrl: "https://utopia.fyi/space/calculator/",
    sourceLabel: "Utopia: Fluid space calculator",
  },
];
