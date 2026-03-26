import type { Challenge } from "../types";

export const responsivePropsChallenges: Challenge[] = [
  {
    id: "rp-001",
    category: "responsive-props",
    difficulty: "easy",
    title: "Breakpoint-aware direction prop",
    badCode: `function Features() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Stack direction={isMobile ? "column" : "row"}>
      <FeatureCard />
      <FeatureCard />
    </Stack>
  );
}`,
    goodCode: `function Features() {
  return (
    <Stack direction={{ xs: "column", sm: "row" }}>
      <FeatureCard />
      <FeatureCard />
    </Stack>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "MUI's responsive prop objects compile to CSS media queries with no hook, no re-render, and no SSR flash. The intent is also more readable: `{ xs: 'column', sm: 'row' }` is a data structure describing the layout at each breakpoint.",
    explanationWrong:
      "`useMediaQuery` defaults to `false` during SSR, so the server always renders the `row` layout. On mobile, React hydrates and immediately re-renders to `column`, causing a visible layout flash.",
    sourceUrl: "https://mui.com/material-ui/react-stack/#responsive-values",
    sourceLabel: "MUI: Stack responsive values",
  },
  {
    id: "rp-002",
    category: "responsive-props",
    difficulty: "easy",
    title: "Responsive Typography variant",
    badCode: `function PageTitle({ children }: Props) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Typography variant={isMobile ? "h5" : "h3"}>
      {children}
    </Typography>
  );
}`,
    goodCode: `function PageTitle({ children }: Props) {
  return (
    <Typography
      variant="h3"
      sx={{
        fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
      }}
    >
      {children}
    </Typography>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Keep the semantic `variant` (h3 for heading hierarchy and accessibility) and override the visual size with responsive `fontSize` in `sx`. This gives you correct heading semantics with flexible visual sizing, and no JavaScript hook is needed.",
    explanationWrong:
      "Changing `variant` between `h5` and `h3` changes the rendered HTML element, which affects heading hierarchy and screen reader navigation. The visual size should be separate from the semantic meaning.",
    sourceUrl:
      "https://mui.com/material-ui/react-typography/#responsive-font-sizes",
    sourceLabel: "MUI: Responsive font sizes",
  },
  {
    id: "rp-003",
    category: "responsive-props",
    difficulty: "medium",
    title: "Designing responsive component APIs",
    badCode: `interface CardProps {
  layout: "horizontal" | "vertical";
}

function Card({ layout }: CardProps) {
  return (
    <Stack
      direction={
        layout === "horizontal" ? "row" : "column"
      }
    >
      <CardImage />
      <CardContent />
    </Stack>
  );
}

// Consumer must use useMediaQuery
function Page() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Card layout={isMobile ? "vertical" : "horizontal"} />
  );
}`,
    goodCode: `interface CardProps {
  layout:
    | "horizontal"
    | "vertical"
    | Partial<Record<Breakpoint, "horizontal" | "vertical">>;
}

function Card({ layout }: CardProps) {
  const direction =
    typeof layout === "string"
      ? layout === "horizontal" ? "row" : "column"
      : Object.fromEntries(
          Object.entries(layout).map(([bp, l]) => [
            bp,
            l === "horizontal" ? "row" : "column",
          ]),
        );

  return (
    <Stack direction={direction}>
      <CardImage />
      <CardContent />
    </Stack>
  );
}

// Consumer: zero hooks needed
function Page() {
  return (
    <Card layout={{ xs: "vertical", sm: "horizontal" }} />
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "By accepting breakpoint objects in the API, the component handles responsiveness internally via CSS. The consumer never needs `useMediaQuery`. This follows MUI's pattern, so if your component wraps MUI, expose the same responsive API.",
    explanationWrong:
      "Forcing the consumer to use `useMediaQuery` means every usage site has the same SSR hydration bug risk, and every consumer writes the same boilerplate. Push responsive logic into the component where it can be handled with CSS.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "rp-004",
    category: "responsive-props",
    difficulty: "medium",
    title: "Responsive visibility prop",
    badCode: `interface SectionProps {
  children: ReactNode;
  hideOnMobile?: boolean;
}

function Section({ children, hideOnMobile }: SectionProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  if (hideOnMobile && isMobile) return null;
  return <Box>{children}</Box>;
}`,
    goodCode: `interface SectionProps {
  children: ReactNode;
  display?: ResponsiveStyleValue<"block" | "none">;
}

function Section({
  children,
  display = "block",
}: SectionProps) {
  return <Box sx={{ display }}>{children}</Box>;
}

// Usage
<Section display={{ xs: "none", md: "block" }}>
  <Sidebar />
</Section>`,
    correctSide: "right",
    explanationCorrect:
      "Exposing `display` as a responsive prop delegates visibility to CSS. The component renders in the HTML (good for SEO), toggles via media queries (no flash), and the consumer controls exactly which breakpoints show or hide it.",
    explanationWrong:
      "`hideOnMobile` is a boolean that forces a single breakpoint decision. What if you want to hide on tablet too? Or show on large phones? A responsive `display` prop gives the consumer full breakpoint control without adding more boolean props.",
    sourceUrl: "https://mui.com/system/display/#hiding-elements",
    sourceLabel: "MUI: Hiding elements",
  },
  {
    id: "rp-005",
    category: "responsive-props",
    difficulty: "hard",
    title: "Responsive columns prop",
    badCode: `interface GridProps {
  columns: number;
  mobileColumns?: number;
  tabletColumns?: number;
}

function AppGrid({
  columns,
  mobileColumns = 1,
  tabletColumns = 2,
}: GridProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");

  const cols = isMobile
    ? mobileColumns
    : isTablet
      ? tabletColumns
      : columns;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: \`repeat(\${cols}, 1fr)\`,
      }}
    >
      {/* children */}
    </Box>
  );
}`,
    goodCode: `interface GridProps {
  columns: ResponsiveStyleValue<number>;
  children: ReactNode;
}

function AppGrid({ columns, children }: GridProps) {
  const gridTemplateColumns =
    typeof columns === "number"
      ? \`repeat(\${columns}, 1fr)\`
      : Object.fromEntries(
          Object.entries(columns).map(([bp, n]) => [
            bp,
            \`repeat(\${n}, 1fr)\`,
          ]),
        );

  return (
    <Box sx={{ display: "grid", gridTemplateColumns }}>
      {children}
    </Box>
  );
}

// Usage: clean, one prop
<AppGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>`,
    correctSide: "right",
    explanationCorrect:
      "One `columns` prop accepting breakpoint objects replaces three separate props and two hooks. The consumer's API is clean (`columns={{ xs: 1, md: 3 }}`), and the implementation compiles to pure CSS media queries.",
    explanationWrong:
      "Three props (`columns`, `mobileColumns`, `tabletColumns`) don't scale. What about `xl`? What about custom breakpoints? Two `useMediaQuery` hooks cause double re-renders on resize and SSR hydration issues. The responsive object pattern handles all breakpoints in one prop.",
    sourceUrl: "https://mui.com/material-ui/react-grid/#responsive-values",
    sourceLabel: "MUI: Grid responsive values",
  },
];
