import type { Challenge } from "../types";

export const conditionalRenderingChallenges: Challenge[] = [
  {
    id: "cr-001",
    category: "conditional-rendering",
    difficulty: "easy",
    title: "CSS display vs conditional render",
    badCode: `function Nav() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile
    ? <MobileNav />
    : <DesktopNav />;
}`,
    goodCode: `function Nav() {
  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <MobileNav />
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopNav />
      </Box>
    </>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Rendering both and toggling with CSS `display` avoids the hydration flash from `useMediaQuery`. Both components exist in the DOM (good for SEO and accessibility), and the switch is instant because no JavaScript needs to run.",
    explanationWrong:
      "`useMediaQuery` returns `false` during SSR. On a mobile device, the server sends DesktopNav, then React hydrates and swaps to MobileNav, causing a visible flash. CSS display toggling eliminates this entirely.",
    sourceUrl: "https://mui.com/system/display/#hiding-elements",
    sourceLabel: "MUI: Hiding elements",
  },
  {
    id: "cr-002",
    category: "conditional-rendering",
    difficulty: "easy",
    title: "When conditional rendering IS correct",
    badCode: `function Dashboard() {
  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <MobileDashboard />
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopDashboard />
      </Box>
    </>
  );
}

// Both dashboards fetch data independently
// Both run expensive chart calculations`,
    goodCode: `"use client";

function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 900px)", {
    defaultMatches: true,
  });

  return isDesktop
    ? <DesktopDashboard />
    : <MobileDashboard />;
}`,
    correctSide: "right",
    explanationCorrect:
      "When both versions are expensive (data fetching, chart rendering, heavy DOM), rendering both wastes resources. `useMediaQuery` with `defaultMatches: true` reduces the SSR flash. For heavy components, the hydration tradeoff is worth avoiding double the work.",
    explanationWrong:
      "Rendering both dashboards means both fetch data, both calculate charts, and both build their DOM trees. Only one is visible. For lightweight UI differences, CSS display is better, but for expensive components, conditional rendering saves real resources.",
    sourceUrl:
      "https://mui.com/material-ui/react-use-media-query/#server-side-rendering",
    sourceLabel: "MUI: useMediaQuery SSR",
  },
  {
    id: "cr-003",
    category: "conditional-rendering",
    difficulty: "medium",
    title: "Progressive disclosure on mobile",
    badCode: `function Filters() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) return null;

  return (
    <Stack spacing={2}>
      <CategoryFilter />
      <PriceFilter />
      <RatingFilter />
    </Stack>
  );
}`,
    goodCode: `function Filters() {
  return (
    <>
      {/* Desktop: always visible */}
      <Stack
        spacing={2}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <CategoryFilter />
        <PriceFilter />
        <RatingFilter />
      </Stack>

      {/* Mobile: behind a drawer */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <FilterDrawer>
          <CategoryFilter />
          <PriceFilter />
          <RatingFilter />
        </FilterDrawer>
      </Box>
    </>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Hiding filters entirely on mobile removes functionality users need. A drawer provides the same filters in a mobile-friendly pattern called progressive disclosure. The filters are always accessible, just presented differently.",
    explanationWrong:
      "Removing filters on mobile means mobile users can't filter results at all. Responsive design isn't about removing features. It's about presenting them appropriately for the device. A drawer or bottom sheet is the mobile pattern for filters.",
    sourceUrl: "https://m3.material.io/components/navigation-drawer/overview",
    sourceLabel: "Material Design: Navigation drawer",
  },
  {
    id: "cr-004",
    category: "conditional-rendering",
    difficulty: "medium",
    title: "Avoiding duplicate component trees",
    badCode: `function ProductPage() {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Header />
        <ProductGrid layout="horizontal" />
        <Sidebar />
        <Footer />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Header />
        <ProductGrid layout="vertical" />
        <Footer />
      </Box>
    </>
  );
}`,
    goodCode: `function ProductPage() {
  return (
    <>
      <Header />
      <Stack direction={{ xs: "column", md: "row" }}>
        <ProductGrid
          sx={{
            flex: 1,
            "& .product-card": {
              flexDirection: { xs: "column", md: "row" },
            },
          }}
        />
        <Sidebar
          sx={{ display: { xs: "none", md: "block" } }}
        />
      </Stack>
      <Footer />
    </>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Share the component tree and use responsive props for the differences. Duplicating the entire page means every change needs updating in two places, event handlers fire twice, and the DOM is much larger. Only split when the differences are truly fundamental.",
    explanationWrong:
      "Two complete page trees means Header, ProductGrid, and Footer are mounted twice, resulting in double the DOM nodes, double the event listeners, and double the data fetching. Any bug fix or feature change must be applied to both copies.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "cr-005",
    category: "conditional-rendering",
    difficulty: "hard",
    title: "Dynamic import for device-specific bundles",
    badCode: `import MobileEditor from "./MobileEditor";
import DesktopEditor from "./DesktopEditor";

function EditorPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <MobileEditor /> : <DesktopEditor />;
}

// Both editors are in the main bundle`,
    goodCode: `import dynamic from "next/dynamic";

const MobileEditor = dynamic(
  () => import("./MobileEditor"),
);
const DesktopEditor = dynamic(
  () => import("./DesktopEditor"),
  { ssr: false },
);

function EditorPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <MobileEditor /> : <DesktopEditor />;
}

// Only the needed editor is downloaded`,
    correctSide: "right",
    explanationCorrect:
      "Dynamic imports with `next/dynamic` code-split each editor into its own chunk. Mobile users only download the mobile editor bundle. This is the correct use of `useMediaQuery`: when you need to avoid *loading* heavy code, not just hiding it with CSS. The hydration flash tradeoff is acceptable here because the alternative (loading both heavy bundles) is worse.",
    explanationWrong:
      "Static imports bundle both editors into the main JavaScript file. Mobile users download the entire desktop editor they'll never use. For heavy, device-specific components, dynamic imports save significant bundle size.",
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading",
    sourceLabel: "Next.js: Lazy loading",
  },
];
