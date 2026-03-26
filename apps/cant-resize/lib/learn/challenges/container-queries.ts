import type { Challenge } from "../types";

export const containerQueryChallenges: Challenge[] = [
  {
    id: "cq-001",
    category: "container-queries",
    difficulty: "easy",
    title: "Component-level vs viewport-level",
    badCode: `/* Card adapts to viewport width */
.card {
  display: flex;
  flex-direction: column;
}

@media (min-width: 600px) {
  .card {
    flex-direction: row;
  }
}`,
    goodCode: `/* Card adapts to its own container */
.card-wrapper {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "A card in a sidebar might be 300px wide even on a 1440px screen. `@container` queries let the card respond to its *own* available space, not the viewport. This makes the component truly reusable across different layout contexts.",
    explanationWrong:
      "Using `@media` means the card always switches to row layout at 600px viewport width, even when it's in a narrow sidebar where row layout doesn't fit. The component's layout should depend on how much space *it* has, not the screen.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    sourceLabel: "MDN: Container queries",
  },
  {
    id: "cq-002",
    category: "container-queries",
    difficulty: "easy",
    title: "Setting up containment",
    badCode: `/* Missing container context */
.sidebar {
  width: 300px;
}

@container (min-width: 250px) {
  .sidebar .widget {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}`,
    goodCode: `.sidebar {
  width: 300px;
  container-type: inline-size;
}

@container (min-width: 250px) {
  .sidebar .widget {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`@container` queries only work when an ancestor has `container-type` set. Without it, the query has no container to measure and the styles won't apply. `inline-size` is the most common value since it tracks the container's width.",
    explanationWrong:
      "The `@container` rule is silently ignored because no ancestor declares itself as a container. This is the most common container query mistake: the query looks correct but nothing happens because the containment context is missing.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/container-type",
    sourceLabel: "MDN: container-type",
  },
  {
    id: "cq-003",
    category: "container-queries",
    difficulty: "medium",
    title: "Named containers",
    badCode: `.page {
  container-type: inline-size;
}

.sidebar {
  container-type: inline-size;
}

/* Which container does this query? */
@container (min-width: 500px) {
  .card { flex-direction: row; }
}`,
    goodCode: `.page {
  container-type: inline-size;
  container-name: page;
}

.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

@container sidebar (min-width: 300px) {
  .card { flex-direction: row; }
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "When multiple ancestors have `container-type`, an unnamed `@container` query matches the *nearest* container ancestor. Named containers (`container-name` + `@container name`) make the intent explicit and prevent surprises when components are moved between layouts.",
    explanationWrong:
      "Without naming, `@container` matches the nearest container ancestor. If the `.card` moves from the sidebar to the page, it suddenly queries the page's width instead. This is a subtle bug that's hard to debug because the CSS didn't change.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/container-name",
    sourceLabel: "MDN: container-name",
  },
  {
    id: "cq-004",
    category: "container-queries",
    difficulty: "medium",
    title: "Container query units",
    badCode: `.hero-title {
  font-size: 5vw;
}`,
    goodCode: `.hero {
  container-type: inline-size;
}

.hero-title {
  font-size: clamp(1.5rem, 5cqi, 3rem);
}`,
    lang: "css",
    correctSide: "right",
    explanationCorrect:
      "`cqi` (container query inline) scales relative to the container's width, not the viewport. Combined with `clamp()`, the text scales fluidly within the hero's bounds and respects min/max limits, even if the hero is in a sidebar or modal.",
    explanationWrong:
      "`5vw` scales with the viewport, so the text is the same size whether the hero is full-width or in a half-width column. Container query units (`cqi`) let the font scale with the component's actual width.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/length#container_query_length_units",
    sourceLabel: "MDN: Container query units",
  },
  {
    id: "cq-005",
    category: "container-queries",
    difficulty: "hard",
    title: "Container queries in React components",
    badCode: `function ProductCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      setWide(entry.contentRect.width > 400);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Stack direction={wide ? "row" : "column"}>
        <ProductImage />
        <ProductDetails />
      </Stack>
    </div>
  );
}`,
    goodCode: `function ProductCard() {
  return (
    <Box sx={{ containerType: "inline-size" }}>
      <Stack
        sx={{
          flexDirection: "column",
          "@container (min-width: 400px)": {
            flexDirection: "row",
          },
        }}
      >
        <ProductImage />
        <ProductDetails />
      </Stack>
    </Box>
  );
}`,
    correctSide: "right",
    explanationCorrect:
      "CSS container queries replace the need for `ResizeObserver` + state for layout changes. No JavaScript runs on resize, no re-renders, no SSR issues. MUI's `sx` prop supports `@container` queries directly as nested selectors.",
    explanationWrong:
      "`ResizeObserver` triggers a state update and re-render on every resize frame. This causes layout thrashing because the browser calculates layout, JavaScript reads it, updates state, React re-renders, and the browser recalculates layout. Container queries handle this entirely in CSS.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    sourceLabel: "MDN: Container queries",
  },
];
