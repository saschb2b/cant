import type { Challenge } from "../types";

export const breakpointHooksChallenges: Challenge[] = [
  {
    id: "bh-001",
    category: "breakpoint-hooks",
    difficulty: "easy",
    title: "Avoiding layout shift with useMediaQuery",
    badCode: `function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile
    ? <MobileLayout />
    : <DesktopLayout />;
}`,
    goodCode: `function App() {
  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <MobileLayout />
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopLayout />
      </Box>
    </>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "Rendering both layouts and toggling visibility with CSS avoids the flash of wrong content during SSR hydration. `useMediaQuery` returns `false` on the server, so the conditional approach always shows DesktopLayout first, then snaps to MobileLayout after hydration on mobile.",
    explanationWrong:
      "Conditionally rendering based on `useMediaQuery` causes a layout shift on mobile: the server renders DesktopLayout (because the hook defaults to `false`), then React hydrates and swaps to MobileLayout. Users see a jarring flash.",
    sourceUrl:
      "https://mui.com/material-ui/react-use-media-query/#server-side-rendering",
    sourceLabel: "MUI: useMediaQuery SSR",
  },
  {
    id: "bh-002",
    category: "breakpoint-hooks",
    difficulty: "easy",
    title: "CSS vs JavaScript for responsive logic",
    badCode: `function ProfileCard({ user }: Props) {
  const isSmall = useMediaQuery("(max-width: 600px)");

  return (
    <Stack direction={isSmall ? "column" : "row"}>
      <Avatar size={isSmall ? 48 : 80} />
      <Typography variant={isSmall ? "body2" : "h6"}>
        {user.name}
      </Typography>
    </Stack>
  );
}`,
    goodCode: `function ProfileCard({ user }: Props) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }}>
      <Avatar
        sx={{
          width: { xs: 48, sm: 80 },
          height: { xs: 48, sm: 80 },
        }}
      />
      <Typography
        variant="h6"
        sx={{ fontSize: { xs: "0.875rem", sm: "1.25rem" } }}
      >
        {user.name}
      </Typography>
    </Stack>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "MUI's `sx` breakpoint objects compile to CSS media queries, so no JavaScript runs on resize. This is faster, avoids hydration mismatches, and eliminates the re-render on every breakpoint crossing.",
    explanationWrong:
      "`useMediaQuery` triggers a React re-render every time the viewport crosses 600px. For purely visual changes like direction, size, and font size, CSS media queries (via `sx` breakpoints) are more performant and SSR-safe.",
    sourceUrl:
      "https://mui.com/system/getting-started/usage/#responsive-values",
    sourceLabel: "MUI: Responsive values",
  },
  {
    id: "bh-003",
    category: "breakpoint-hooks",
    difficulty: "medium",
    title: "Custom breakpoint hook with SSR safety",
    badCode: `function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handler = () =>
      setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () =>
      window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}`,
    goodCode: `function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)");
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () =>
      mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}`,
    correctSide: "right",
    explanationCorrect:
      "Using `matchMedia` instead of `resize` events is more performant because the browser only fires the callback when the query result *changes*, not on every pixel of resize. Initializing state to `false` avoids crashing during SSR where `window` doesn't exist.",
    explanationWrong:
      "Accessing `window.innerWidth` in `useState` breaks SSR because `window` is undefined on the server. The `resize` event also fires continuously during drag, causing unnecessary re-renders for every pixel of width change.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia",
    sourceLabel: "MDN: matchMedia",
  },
  {
    id: "bh-004",
    category: "breakpoint-hooks",
    difficulty: "medium",
    title: "Debouncing resize vs matchMedia",
    badCode: `function useBreakpoint() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => setWidth(window.innerWidth),
        150,
      );
    };
    window.addEventListener("resize", handler);
    handler();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}`,
    goodCode: `function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    const tablet = matchMedia("(min-width: 640px)");
    const desktop = matchMedia("(min-width: 1024px)");

    const update = () => {
      if (desktop.matches) setBp("desktop");
      else if (tablet.matches) setBp("tablet");
      else setBp("mobile");
    };

    update();
    tablet.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      tablet.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return bp;
}`,
    correctSide: "right",
    explanationCorrect:
      "Two `matchMedia` listeners fire only when crossing 640px or 1024px, not on every pixel of resize. No debounce needed, no stale 150ms delay, and the return value is a clean discriminated string instead of three booleans that could theoretically conflict.",
    explanationWrong:
      "Debouncing `resize` is a workaround for a problem `matchMedia` already solves. The 150ms delay makes the UI feel sluggish during resize, and tracking raw width means the component re-renders for every pixel change even within the same breakpoint.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event",
    sourceLabel: "MDN: MediaQueryList change event",
  },
  {
    id: "bh-005",
    category: "breakpoint-hooks",
    difficulty: "hard",
    title: "Server component with responsive fallback",
    badCode: `// page.tsx (Server Component)
import { useMediaQuery } from "@mui/material";

export default function DashboardPage() {
  // ERROR: hooks can't be used in server components
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile
    ? <MobileDashboard />
    : <DesktopDashboard />;
}`,
    goodCode: `// page.tsx (Server Component)
export default function DashboardPage() {
  return (
    <div>
      <div className="mobile-only">
        <MobileDashboard />
      </div>
      <div className="desktop-only">
        <DesktopDashboard />
      </div>
    </div>
  );
}

// global CSS
// .mobile-only { display: block; }
// .desktop-only { display: none; }
// @media (min-width: 900px) {
//   .mobile-only { display: none; }
//   .desktop-only { display: block; }
// }`,
    correctSide: "right",
    explanationCorrect:
      "Server Components have no access to browser APIs or React hooks. Plain CSS-based responsive switching works everywhere: server, client, and static HTML. Both components render in the HTML, and CSS hides the wrong one instantly with no JavaScript. Note: MUI's `sx` prop requires Emotion's client runtime, so use plain CSS or CSS modules in Server Components.",
    explanationWrong:
      '`useMediaQuery` is a React hook that requires client-side execution. Using it in a Server Component throws a build error. Even if you add `"use client"`, you\'d lose the benefits of server rendering for the entire page.',
    sourceUrl:
      "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
    sourceLabel: "Next.js: Server Components",
  },
];
