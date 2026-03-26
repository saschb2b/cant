import type { Challenge } from "../types";

export const commonMistakeChallenges: Challenge[] = [
  {
    id: "cm-001",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Fixed width containers",
    badCode: `.container {
  width: 960px;
  margin: 0 auto;
}`,
    goodCode: `.container {
  width: min(100% - 2rem, 960px);
  margin-inline: auto;
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`min(100% - 2rem, 960px)` caps at 960px on large screens but shrinks to fit on small screens with 1rem padding on each side. One line, no media queries, no horizontal overflow. `margin-inline: auto` is the logical property equivalent.",
    explanationWrong:
      "A fixed `960px` container overflows on any screen narrower than 960px. On a 375px phone, you get a horizontal scrollbar and nearly two-thirds of the content is off-screen. Never use fixed pixel widths for layout containers.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/min",
    sourceLabel: "MDN: min()",
  },
  {
    id: "cm-002",
    category: "common-mistakes",
    difficulty: "easy",
    title: "Touch target size",
    badCode: `<IconButton size="small" sx={{ p: 0.5 }}>
  <CloseIcon sx={{ fontSize: 16 }} />
</IconButton>

{/* Renders as ~24px tap target */}`,
    goodCode: `<IconButton
  size="small"
  sx={{ minWidth: 44, minHeight: 44 }}
>
  <CloseIcon sx={{ fontSize: 16 }} />
</IconButton>

{/* Visual is small, tap target is 44px */}`,
    correctSide: "right",
    explanationCorrect:
      "WCAG recommends at least 44x44px touch targets. Setting `minWidth`/`minHeight` on the button keeps the visual compact while making the clickable area finger-friendly. The icon stays 16px but the touch area is 44px.",
    explanationWrong:
      "A 24px tap target is frustrating on touch devices because users miss the button and accidentally tap adjacent elements. Apple's HIG recommends 44pt, Google Material recommends 48dp. Small visual elements need padding to reach the minimum.",
    sourceUrl: "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",
    sourceLabel: "WCAG: Target Size",
  },
  {
    id: "cm-003",
    category: "common-mistakes",
    difficulty: "medium",
    title: "Forgetting the viewport meta tag",
    badCode: `<head>
  <title>My App</title>
  <meta charSet="utf-8" />
</head>`,
    goodCode: `<head>
  <title>My App</title>
  <meta charSet="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
</head>`,
    correctSide: "right",
    explanationCorrect:
      "Without the viewport meta tag, mobile browsers render the page at ~980px wide and zoom out to fit. `width=device-width` tells the browser to use the actual device width, enabling your media queries and responsive CSS to work correctly.",
    explanationWrong:
      'Without `<meta name="viewport">`, mobile browsers assume the page is a desktop site and render it at 980px wide, then zoom out. Media queries based on `min-width: 768px` fire even on a 375px phone because the layout viewport is 980px.',
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag",
    sourceLabel: "MDN: Viewport meta tag",
  },
  {
    id: "cm-004",
    category: "common-mistakes",
    difficulty: "medium",
    title: "Landscape orientation",
    badCode: `.mobile-layout {
  padding-top: env(safe-area-inset-top);
}

/* Only considers portrait mode */
@media (max-width: 768px) {
  .sidebar { display: none; }
}`,
    goodCode: `.mobile-layout {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Consider landscape phones */
@media (max-height: 500px) and (orientation: landscape) {
  .header { position: static; }
  .hero { min-height: auto; }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "Landscape phones have very little vertical space (~320px). A sticky header + full-height hero can leave zero room for content. Safe area insets on left/right handle the notch in landscape. Always test your layout rotated.",
    explanationWrong:
      "Only applying `safe-area-inset-top` ignores landscape mode where the notch is on the side. A `max-width: 768px` breakpoint doesn't account for a phone in landscape (which might be 812px wide). Test both orientations.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/env",
    sourceLabel: "MDN: env() safe areas",
  },
  {
    id: "cm-005",
    category: "common-mistakes",
    difficulty: "hard",
    title: "Pixel assumptions in responsive design",
    badCode: `// "iPhones are 375px wide"
const MOBILE_WIDTH = 375;

function useLayout() {
  const width = useWindowWidth();

  if (width <= MOBILE_WIDTH) return "phone";
  if (width <= 768) return "tablet";
  return "desktop";
}`,
    goodCode: `// Use CSS for visual changes
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
      md: "250px 1fr",
    },
  }}
>
  {/* Layout adapts to content needs */}
</Box>`,
    correctSide: "right",
    explanationCorrect:
      "Device pixel widths are arbitrary and constantly changing. iPhones range from 320px (SE 1st gen) to 440px (16 Pro Max), and Android phones vary even more. Instead of mapping widths to device categories, use CSS layouts that adapt fluidly. Breakpoints should be based on *content needs*, not device brands.",
    explanationWrong:
      "375px covers some iPhones, but the iPhone 12-14 are 390px, the 14 Pro is 393px, and the 16 Pro Max is 440px. Galaxy phones range from 360-412px. Pixel assumptions become wrong with every new device release. Design for content breakpoints, not device widths.",
    sourceUrl:
      "https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/",
    sourceLabel: "The correct way to do CSS breakpoints",
  },
];
